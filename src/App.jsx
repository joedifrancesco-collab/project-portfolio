import { useState, useEffect } from 'react';
import { useProjects } from './hooks/useProjects';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import './App.css';

export default function App() {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();
  const [selectedId, setSelectedId] = useState(null);

  // Select first project once data loads
  useEffect(() => {
    if (projects.length > 0 && !selectedId) {
      setSelectedId(projects[0].id);
    }
  }, [projects, selectedId]);

  const selectedProject = projects.find((p) => p.id === selectedId) || null;

  const handleSelect = (id) => setSelectedId(id);

  const handleAddProject = async (project) => {
    await addProject(project);
    setSelectedId(project.id);
  };

  const handleDeleteProject = async (id) => {
    await deleteProject(id);
    if (selectedId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setSelectedId(remaining[0]?.id || null);
    }
  };

  const handleUpdateProject = async (updated) => {
    await updateProject(updated);
  };

  if (loading) {
    return (
      <div className="app-layout">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <h2>Connecting to database…</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2>Database connection error</h2>
          <p>{error}</p>
          <p>Make sure the API server is running: <code>cd server &amp;&amp; npm start</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <ProjectList
        projects={projects}
        selectedId={selectedId}
        onSelect={handleSelect}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
      />

      <main className="main-content">
        {selectedProject ? (
          <ProjectDetail project={selectedProject} onUpdateProject={handleUpdateProject} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <h2>No project selected</h2>
            <p>Select a project from the list, or create a new one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
