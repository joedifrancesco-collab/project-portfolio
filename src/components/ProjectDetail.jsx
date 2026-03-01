import ProjectProperties from './ProjectProperties';
import TaskList from './TaskList';
import DocumentList from './DocumentList';
import NotesSection from './NotesSection';

export default function ProjectDetail({ project, onUpdateProject }) {
  const updateField = (updates) => {
    onUpdateProject({ ...project, ...updates });
  };

  const addTask = (task) => {
    onUpdateProject({ ...project, tasks: [...project.tasks, task] });
  };

  const updateTask = (taskId, updates) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    });
  };

  const deleteTask = (taskId) => {
    onUpdateProject({ ...project, tasks: project.tasks.filter((t) => t.id !== taskId) });
  };

  const addDocument = (doc) => {
    onUpdateProject({ ...project, documents: [...project.documents, doc] });
  };

  const deleteDocument = (docId) => {
    onUpdateProject({ ...project, documents: project.documents.filter((d) => d.id !== docId) });
  };

  const addNote = (note) => {
    onUpdateProject({ ...project, notes: [...project.notes, note] });
  };

  const deleteNote = (noteId) => {
    onUpdateProject({ ...project, notes: project.notes.filter((n) => n.id !== noteId) });
  };

  return (
    <div className="project-detail">
      <h1 className="project-title">{project.name}</h1>

      <ProjectProperties project={project} onUpdate={updateField} />

      <TaskList
        tasks={project.tasks}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />

      <DocumentList
        documents={project.documents}
        onAddDocument={addDocument}
        onDeleteDocument={deleteDocument}
      />

      <NotesSection
        notes={project.notes}
        onAddNote={addNote}
        onDeleteNote={deleteNote}
      />
    </div>
  );
}
