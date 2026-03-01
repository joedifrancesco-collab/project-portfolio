import { useState } from 'react';

const STATUS_COLORS = {
  Done: '#22c55e',
  'In Progress': '#3b82f6',
  'Not Started': '#9ca3af',
};

export default function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', status: 'Not Started', assignee: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAddTask({ ...form, id: crypto.randomUUID() });
    setForm({ title: '', status: 'Not Started', assignee: '' });
    setShowForm(false);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Tasks</h2>
        <button className="btn-add" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="form-input"
            placeholder="Assignee"
            value={form.assignee}
            onChange={(e) => setForm({ ...form, assignee: e.target.value })}
          />
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <button className="btn-submit" type="submit">Add</button>
        </form>
      )}

      {tasks.length === 0 ? (
        <p className="empty-msg">No tasks yet. Add one above.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assignee</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.assignee || '—'}</td>
                <td>
                  <select
                    className="status-select"
                    style={{ color: STATUS_COLORS[task.status] }}
                    value={task.status}
                    onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => onDeleteTask(task.id)} title="Delete task">
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
