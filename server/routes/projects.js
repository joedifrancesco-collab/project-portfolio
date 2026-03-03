const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// ── helpers ──────────────────────────────────────────────────────────────────

async function fetchFullProject(pool, id) {
  const [projectResult, tasksResult, docsResult, notesResult] = await Promise.all([
    pool.request().input('id', sql.NVarChar, id).query('SELECT * FROM Projects WHERE id = @id'),
    pool.request().input('id', sql.NVarChar, id).query('SELECT * FROM Tasks WHERE projectId = @id'),
    pool.request().input('id', sql.NVarChar, id).query('SELECT * FROM Documents WHERE projectId = @id'),
    pool.request().input('id', sql.NVarChar, id).query('SELECT * FROM Notes WHERE projectId = @id'),
  ]);

  const project = projectResult.recordset[0];
  if (!project) return null;

  return {
    ...project,
    tasks: tasksResult.recordset,
    documents: docsResult.recordset,
    notes: notesResult.recordset,
  };
}

// ── GET /api/projects ─────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const projectsResult = await pool.request().query('SELECT * FROM Projects ORDER BY createdAt');
    const projects = projectsResult.recordset;

    if (projects.length === 0) return res.json([]);

    // Fetch all nested data in one query each, then group by projectId
    const [tasksResult, docsResult, notesResult] = await Promise.all([
      pool.request().query('SELECT * FROM Tasks'),
      pool.request().query('SELECT * FROM Documents'),
      pool.request().query('SELECT * FROM Notes'),
    ]);

    const tasksByProject = groupBy(tasksResult.recordset, 'projectId');
    const docsByProject = groupBy(docsResult.recordset, 'projectId');
    const notesByProject = groupBy(notesResult.recordset, 'projectId');

    const result = projects.map((p) => ({
      ...p,
      tasks: tasksByProject[p.id] || [],
      documents: docsByProject[p.id] || [],
      notes: notesByProject[p.id] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error('GET /api/projects error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/projects/:id ─────────────────────────────────────────────────────

router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const project = await fetchFullProject(pool, req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('GET /api/projects/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/projects ────────────────────────────────────────────────────────

router.post('/', async (req, res) => {
  const { id, name, status, category, businessUnit, businessSponsor, description, tasks = [], documents = [], notes = [] } = req.body;
  try {
    const pool = await getPool();

    await pool.request()
      .input('id', sql.NVarChar, id)
      .input('name', sql.NVarChar, name)
      .input('status', sql.NVarChar, status || 'Planning')
      .input('category', sql.NVarChar, category || null)
      .input('businessUnit', sql.NVarChar, businessUnit || null)
      .input('businessSponsor', sql.NVarChar, businessSponsor || null)
      .input('description', sql.NVarChar, description || null)
      .query(`INSERT INTO Projects (id, name, status, category, businessUnit, businessSponsor, description)
              VALUES (@id, @name, @status, @category, @businessUnit, @businessSponsor, @description)`);

    await insertNested(pool, id, tasks, documents, notes);

    const project = await fetchFullProject(pool, id);
    res.status(201).json(project);
  } catch (err) {
    console.error('POST /api/projects error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/projects/:id ─────────────────────────────────────────────────────

router.put('/:id', async (req, res) => {
  const { name, status, category, businessUnit, businessSponsor, description, tasks = [], documents = [], notes = [] } = req.body;
  try {
    const pool = await getPool();

    const exists = await pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .query('SELECT id FROM Projects WHERE id = @id');

    if (exists.recordset.length === 0) return res.status(404).json({ error: 'Project not found' });

    await pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .input('name', sql.NVarChar, name)
      .input('status', sql.NVarChar, status || 'Planning')
      .input('category', sql.NVarChar, category || null)
      .input('businessUnit', sql.NVarChar, businessUnit || null)
      .input('businessSponsor', sql.NVarChar, businessSponsor || null)
      .input('description', sql.NVarChar, description || null)
      .query(`UPDATE Projects
              SET name = @name, status = @status, category = @category,
                  businessUnit = @businessUnit, businessSponsor = @businessSponsor,
                  description = @description, updatedAt = GETDATE()
              WHERE id = @id`);

    // Replace nested data: delete then re-insert
    await pool.request().input('id', sql.NVarChar, req.params.id).query('DELETE FROM Tasks WHERE projectId = @id');
    await pool.request().input('id', sql.NVarChar, req.params.id).query('DELETE FROM Documents WHERE projectId = @id');
    await pool.request().input('id', sql.NVarChar, req.params.id).query('DELETE FROM Notes WHERE projectId = @id');
    await insertNested(pool, req.params.id, tasks, documents, notes);

    const project = await fetchFullProject(pool, req.params.id);
    res.json(project);
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────

router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .query('DELETE FROM Projects WHERE id = @id');
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── private helpers ───────────────────────────────────────────────────────────

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

async function insertNested(pool, projectId, tasks, documents, notes) {
  for (const t of tasks) {
    await pool.request()
      .input('id', sql.NVarChar, t.id)
      .input('projectId', sql.NVarChar, projectId)
      .input('title', sql.NVarChar, t.title)
      .input('status', sql.NVarChar, t.status || 'Not Started')
      .input('assignee', sql.NVarChar, t.assignee || null)
      .query('INSERT INTO Tasks (id, projectId, title, status, assignee) VALUES (@id, @projectId, @title, @status, @assignee)');
  }
  for (const d of documents) {
    await pool.request()
      .input('id', sql.NVarChar, d.id)
      .input('projectId', sql.NVarChar, projectId)
      .input('name', sql.NVarChar, d.name)
      .input('type', sql.NVarChar, d.type || null)
      .input('url', sql.NVarChar, d.url || null)
      .input('uploadedAt', sql.NVarChar, d.uploadedAt || null)
      .query('INSERT INTO Documents (id, projectId, name, type, url, uploadedAt) VALUES (@id, @projectId, @name, @type, @url, @uploadedAt)');
  }
  for (const n of notes) {
    await pool.request()
      .input('id', sql.NVarChar, n.id)
      .input('projectId', sql.NVarChar, projectId)
      .input('text', sql.NVarChar, n.text)
      .input('createdAt', sql.NVarChar, n.createdAt || null)
      .query('INSERT INTO Notes (id, projectId, text, createdAt) VALUES (@id, @projectId, @text, @createdAt)');
  }
}

module.exports = router;
