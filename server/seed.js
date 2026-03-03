/**
 * seed.js — Inserts the sample projects (tasks, documents, notes)
 * and lookup tables (Categories, BusinessUnits) into the ProjectPortfolio database.
 * Run once:  node seed.js
 */

const { getPool, sql } = require('./db');

const sampleCategories = [
  'Marketing',
  'Technology',
  'Infrastructure',
  'Finance',
  'Operations',
];

const sampleBusinessUnits = [
  'Corporate Communications',
  'Product Development',
  'IT Operations',
  'Finance & Accounting',
  'Human Resources',
];

const sampleProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    status: 'In Progress',
    category: 'Marketing',
    businessUnit: 'Corporate Communications',
    businessSponsor: 'Jane Smith',
    description: 'Complete overhaul of the company website with modern design and improved UX.',
    tasks: [
      { id: 't1', title: 'Wireframe mockups', status: 'Done', assignee: 'Alice' },
      { id: 't2', title: 'Design system setup', status: 'In Progress', assignee: 'Bob' },
      { id: 't3', title: 'Homepage development', status: 'Not Started', assignee: 'Alice' },
    ],
    documents: [
      { id: 'd1', name: 'Design Brief.pdf', type: 'PDF', url: '#', uploadedAt: '2026-01-16' },
      { id: 'd2', name: 'Brand Guidelines.docx', type: 'DOCX', url: '#', uploadedAt: '2026-01-20' },
    ],
    notes: [
      { id: 'n1', text: 'Kickoff meeting completed. Team aligned on goals.', createdAt: '2026-01-15T10:00:00Z' },
      { id: 'n2', text: 'Client approved wireframes. Moving to design phase.', createdAt: '2026-02-01T14:30:00Z' },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Launch',
    status: 'Planning',
    category: 'Technology',
    businessUnit: 'Product Development',
    businessSponsor: 'John Doe',
    description: 'Develop and launch a cross-platform mobile app for iOS and Android.',
    tasks: [
      { id: 't4', title: 'Requirements gathering', status: 'Done', assignee: 'John' },
      { id: 't5', title: 'Tech stack decision', status: 'In Progress', assignee: 'Team' },
    ],
    documents: [
      { id: 'd3', name: 'Requirements Doc.pdf', type: 'PDF', url: '#', uploadedAt: '2026-02-10' },
    ],
    notes: [
      { id: 'n3', text: 'Initial scoping session completed. Budget approved by stakeholders.', createdAt: '2026-02-15T09:00:00Z' },
    ],
  },
  {
    id: '3',
    name: 'Data Migration',
    status: 'On Hold',
    category: 'Infrastructure',
    businessUnit: 'IT Operations',
    businessSponsor: 'Mary Johnson',
    description: 'Migrate legacy database to new cloud infrastructure.',
    tasks: [
      { id: 't6', title: 'Inventory legacy data', status: 'Done', assignee: 'Dave' },
      { id: 't7', title: 'Map data schemas', status: 'Done', assignee: 'Dave' },
      { id: 't8', title: 'Migration scripts', status: 'Not Started', assignee: 'Dave' },
      { id: 't9', title: 'Validation testing', status: 'Not Started', assignee: 'QA Team' },
    ],
    documents: [
      { id: 'd4', name: 'Data Schema Map.xlsx', type: 'XLSX', url: '#', uploadedAt: '2026-02-20' },
      { id: 'd5', name: 'Migration Plan.pdf', type: 'PDF', url: '#', uploadedAt: '2026-02-22' },
    ],
    notes: [
      { id: 'n4', text: 'Project on hold pending budget review.', createdAt: '2026-02-28T11:00:00Z' },
    ],
  },
];

async function seed() {
  const pool = await getPool();
  console.log('Connected to database. Seeding sample data…\n');

  for (const project of sampleProjects) {
    // Skip if project already exists
    const exists = await pool.request()
      .input('id', sql.NVarChar, project.id)
      .query('SELECT id FROM Projects WHERE id = @id');

    if (exists.recordset.length > 0) {
      console.log(`  SKIP  "${project.name}" (already exists)`);
      continue;
    }

    await pool.request()
      .input('id', sql.NVarChar, project.id)
      .input('name', sql.NVarChar, project.name)
      .input('status', sql.NVarChar, project.status)
      .input('category', sql.NVarChar, project.category)
      .input('businessUnit', sql.NVarChar, project.businessUnit)
      .input('businessSponsor', sql.NVarChar, project.businessSponsor)
      .input('description', sql.NVarChar, project.description)
      .query(`INSERT INTO Projects (id, name, status, category, businessUnit, businessSponsor, description)
              VALUES (@id, @name, @status, @category, @businessUnit, @businessSponsor, @description)`);

    for (const t of project.tasks) {
      await pool.request()
        .input('id', sql.NVarChar, t.id)
        .input('projectId', sql.NVarChar, project.id)
        .input('title', sql.NVarChar, t.title)
        .input('status', sql.NVarChar, t.status)
        .input('assignee', sql.NVarChar, t.assignee)
        .query('INSERT INTO Tasks (id, projectId, title, status, assignee) VALUES (@id, @projectId, @title, @status, @assignee)');
    }

    for (const d of project.documents) {
      await pool.request()
        .input('id', sql.NVarChar, d.id)
        .input('projectId', sql.NVarChar, project.id)
        .input('name', sql.NVarChar, d.name)
        .input('type', sql.NVarChar, d.type)
        .input('url', sql.NVarChar, d.url)
        .input('uploadedAt', sql.NVarChar, d.uploadedAt)
        .query('INSERT INTO Documents (id, projectId, name, type, url, uploadedAt) VALUES (@id, @projectId, @name, @type, @url, @uploadedAt)');
    }

    for (const n of project.notes) {
      await pool.request()
        .input('id', sql.NVarChar, n.id)
        .input('projectId', sql.NVarChar, project.id)
        .input('text', sql.NVarChar, n.text)
        .input('createdAt', sql.NVarChar, n.createdAt)
        .query('INSERT INTO Notes (id, projectId, text, createdAt) VALUES (@id, @projectId, @text, @createdAt)');
    }

    console.log(`  OK    "${project.name}" — ${project.tasks.length} task(s), ${project.documents.length} doc(s), ${project.notes.length} note(s)`);
  }

  // Seed Categories
  const existingCats = await pool.request().query('SELECT COUNT(*) AS cnt FROM Categories');
  if (existingCats.recordset[0].cnt === 0) {
    for (const name of sampleCategories) {
      await pool.request()
        .input('name', sql.NVarChar, name)
        .query('INSERT INTO Categories (name) VALUES (@name)');
    }
    console.log(`\n  OK    Seeded ${sampleCategories.length} categories`);
  } else {
    console.log('\n  SKIP  Categories (already seeded)');
  }

  // Seed BusinessUnits
  const existingBUs = await pool.request().query('SELECT COUNT(*) AS cnt FROM BusinessUnits');
  if (existingBUs.recordset[0].cnt === 0) {
    for (const name of sampleBusinessUnits) {
      await pool.request()
        .input('name', sql.NVarChar, name)
        .query('INSERT INTO BusinessUnits (name) VALUES (@name)');
    }
    console.log(`  OK    Seeded ${sampleBusinessUnits.length} business units`);
  } else {
    console.log('  SKIP  BusinessUnits (already seeded)');
  }

  console.log('\nSeed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
