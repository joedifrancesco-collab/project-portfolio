import { useState } from 'react';

const FIELDS = [
  { key: 'name', label: 'Project Name' },
  { key: 'description', label: 'Short Description', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'] },
  { key: 'category', label: 'Category' },
  { key: 'businessUnit', label: 'Business Unit' },
  { key: 'businessSponsor', label: 'Business Sponsor' },
];

const STATUS_BADGE = {
  Planning: '#6366f1',
  'In Progress': '#3b82f6',
  'On Hold': '#f59e0b',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

export default function ProjectProperties({ project, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...project });

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...project });
    setEditing(false);
  };

  if (editing) {
    return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Project Properties</h2>
          <div className="btn-group">
            <button className="btn-save" onClick={handleSave}>Save</button>
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
        <form className="props-form" onSubmit={handleSave}>
          <div className="props-grid">
            {FIELDS.map(({ key, label, type, options }) => (
              <div key={key} className={`form-group${type === 'textarea' ? ' full-width' : ''}`}>
                <label className="form-label">{label}</label>
                {type === 'select' ? (
                  <select
                    className="form-select"
                    value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  >
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    className="form-input"
                    type={type || 'text'}
                    value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="section props-section">
      <div className="section-header">
        <h2 className="section-title">Project Properties</h2>
        <button className="btn-add" onClick={() => setEditing(true)}>Edit</button>
      </div>
      <div className="props-grid">
        <div className="prop-item">
          <span className="prop-label">Status</span>
          <span
            className="status-badge"
            style={{ background: STATUS_BADGE[project.status] || '#6b7280' }}
          >
            {project.status}
          </span>
        </div>
        <div className="prop-item">
          <span className="prop-label">Category</span>
          <span className="prop-value">{project.category || '—'}</span>
        </div>
        <div className="prop-item">
          <span className="prop-label">Business Unit</span>
          <span className="prop-value">{project.businessUnit || '—'}</span>
        </div>
        <div className="prop-item">
          <span className="prop-label">Business Sponsor</span>
          <span className="prop-value">{project.businessSponsor || '—'}</span>
        </div>
        {project.description && (
          <div className="prop-item full-width">
            <span className="prop-label">Short Description</span>
            <span className="prop-value">{project.description}</span>
          </div>
        )}
      </div>
    </section>
  );
}
