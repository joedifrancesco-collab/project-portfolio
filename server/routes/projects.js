const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// ── helpers ──────────────────────────────────────────────────────────────────

async function fetchFullProject(pool, id) {
  const [projectResult, tasksResult, docsResult, notesResult] = await Promise.all([
    pool.query('SELECT * FROM Projects WHERE id = $1', [id]),
    pool.query('SELECT * FROM Tasks WHERE projectId = $1', [id]),
    pool.query('SELECT * FROM Documents WHERE projectId = $1', [id]),
    pool.query('SELECT * FROM Notes WHERE projectId = $1', [id]),
  ]);

  const project = projectResult.rows[0];
  if (!project) return null;

  return {
    ...project,
    tasks: tasksResult.rows,
    documents: docsResult.rows,
    notes: notesResult.rows,
  };
}

// ── GET /api/projects ─────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const projectsResult = await pool.query('SELECT * FROM Projects ORDER BY createdAt');
    const projects = projectsResult.rows;

    if (projects.length === 0) return res.json([]);

    // Fetch all nested data in one query each, then group by projectId
    const [tasksResult, docsResult, notesResult] = await Promise.all([
      pool.query('SELECT * FROM Tasks'),
      pool.query('SELECT * FROM Documents'),
      pool.query('SELECT * FROM Notes'),
    ]);

    const tasksByProject = groupBy(tasksResult.rows, 'projectid');
    const docsByProject = groupBy(docsResult.rows, 'projectid');
    const notesByProject = groupBy(notesResult.rows, 'projectid');

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

    await pool.query(
      `INSERT INTO Projects (id, name, status, category, businessUnit, businessSponsor, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, name, status || 'Planning', category || null, businessUnit || null, businessSponsor || null, description || null]
    );

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

    const exists = await pool.query('SELECT id FROM Projects WHERE id = $1', [req.params.id]);

    if (exists.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    await pool.query(
      `UPDATE Projects
       SET name = $1, status = $2, category = $3, businessUnit = $4,
           businessSponsor = $5, description = $6, updatedAt = NOW()
       WHERE id = $7`,
      [name, status || 'Planning', category || null, businessUnit || null, businessSponsor || null, description || null, req.params.id]
    );

    // Replace nested data: delete then re-insert
    await pool.query('DELETE FROM Tasks WHERE projectId = $1', [req.params.id]);
    await pool.query('DELETE FROM Documents WHERE projectId = $1', [req.params.id]);
    await pool.query('DELETE FROM Notes WHERE projectId = $1', [req.params.id]);
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
    await pool.query('DELETE FROM Projects WHERE id = $1', [req.params.id]);
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
    await pool.query(
      'INSERT INTO Tasks (id, projectId, title, status, assignee) VALUES ($1, $2, $3, $4, $5)',
      [t.id, projectId, t.title, t.status || 'Not Started', t.assignee || null]
    );
  }
  for (const d of documents) {
    await pool.query(
      'INSERT INTO Documents (id, projectId, name, type, url, uploadedAt) VALUES ($1, $2, $3, $4, $5, $6)',
      [d.id, projectId, d.name, d.type || null, d.url || null, d.uploadedAt || null]
    );
  }
  for (const n of notes) {
    await pool.query(
      'INSERT INTO Notes (id, projectId, text, createdAt) VALUES ($1, $2, $3, $4)',
      [n.id, projectId, n.text, n.createdAt || null]
    );
  }
}

module.exports = router;
