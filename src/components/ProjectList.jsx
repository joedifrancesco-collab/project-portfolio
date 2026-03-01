import { useState } from 'react';

const STATUS_COLORS = {
  Planning: '#6366f1',
  'In Progress': '#3b82f6',
  'On Hold': '#f59e0b',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

export default function ProjectList({ projects, selectedId, onSelect, onAddProject, onDeleteProject }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', status: 'Planning', category: '', businessUnit: '', businessSponsor: '', description: '' });

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAddProject({
      ...form,
      id: crypto.randomUUID(),
      tasks: [],
      documents: [],
      notes: [],
    });
    setForm({ name: '', status: 'Planning', category: '', businessUnit: '', businessSponsor: '', description: '' });
    setShowForm(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">Project Portfolio</h1>
      </div>

      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sidebar-actions">
        <button className="btn-new-project" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form className="new-project-form" onSubmit={handleAdd}>
          <input
            className="form-input"
            placeholder="Project name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Planning</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input
            className="form-input"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Business Unit"
            value={form.businessUnit}
            onChange={(e) => setForm({ ...form, businessUnit: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Business Sponsor"
            value={form.businessSponsor}
            onChange={(e) => setForm({ ...form, businessSponsor: e.target.value })}
          />
          <textarea
            className="form-textarea"
            placeholder="Short description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="btn-submit" type="submit">Create Project</button>
        </form>
      )}

      <ul className="project-list">
        {filtered.length === 0 && (
          <li className="empty-msg" style={{ padding: '1rem' }}>No projects found.</li>
        )}
        {filtered.map((project) => (
          <li
            key={project.id}
            className={`project-list-item${selectedId === project.id ? ' selected' : ''}`}
            onClick={() => onSelect(project.id)}
          >
            <div className="project-list-name">{project.name}</div>
            <div className="project-list-meta">
              <span
                className="status-dot"
                style={{ background: STATUS_COLORS[project.status] || '#9ca3af' }}
              />
              <span className="project-list-status">{project.status}</span>
              <span className="project-list-priority">· {project.category}</span>
            </div>
            <button
              className="btn-delete project-delete"
              title="Delete project"
              onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
