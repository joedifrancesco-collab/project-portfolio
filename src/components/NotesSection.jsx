import { useState } from 'react';

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotesSection({ notes, onAddNote, onDeleteNote }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddNote({ id: crypto.randomUUID(), text: text.trim(), createdAt: new Date().toISOString() });
    setText('');
  };

  const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Notes</h2>
      </div>

      <form className="note-form" onSubmit={handleSubmit}>
        <textarea
          className="note-textarea"
          placeholder="Add a note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <button className="btn-submit" type="submit" disabled={!text.trim()}>
          Add Note
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="empty-msg">No notes yet. Add one above.</p>
      ) : (
        <ul className="notes-list">
          {sorted.map((note) => (
            <li key={note.id} className="note-item">
              <div className="note-meta">{formatDate(note.createdAt)}</div>
              <div className="note-text">{note.text}</div>
              <button className="btn-delete note-delete" onClick={() => onDeleteNote(note.id)} title="Delete note">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
