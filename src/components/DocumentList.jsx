import { useState } from 'react';

const TYPE_ICONS = {
  PDF: '📄',
  DOCX: '📝',
  XLSX: '📊',
  PPTX: '📋',
  default: '📎',
};

export default function DocumentList({ documents, onAddDocument, onDeleteDocument }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'PDF', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAddDocument({
      ...form,
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString().slice(0, 10),
    });
    setForm({ name: '', type: 'PDF', url: '' });
    setShowForm(false);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Documents</h2>
        <button className="btn-add" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Document'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            placeholder="Document name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>PDF</option>
            <option>DOCX</option>
            <option>XLSX</option>
            <option>PPTX</option>
            <option>Other</option>
          </select>
          <input
            className="form-input"
            placeholder="URL (optional)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <button className="btn-submit" type="submit">Add</button>
        </form>
      )}

      {documents.length === 0 ? (
        <p className="empty-msg">No documents yet. Add one above.</p>
      ) : (
        <ul className="doc-list">
          {documents.map((doc) => (
            <li key={doc.id} className="doc-item">
              <span className="doc-icon">{TYPE_ICONS[doc.type] || TYPE_ICONS.default}</span>
              <div className="doc-info">
                {doc.url && doc.url !== '#' ? (
                  <a className="doc-name" href={doc.url} target="_blank" rel="noreferrer">
                    {doc.name}
                  </a>
                ) : (
                  <span className="doc-name">{doc.name}</span>
                )}
                <span className="doc-meta">{doc.type} · Added {doc.uploadedAt}</span>
              </div>
              <button className="btn-delete" onClick={() => onDeleteDocument(doc.id)} title="Delete document">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
