import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sampleProjects } from './data/sampleData';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import './App.css';

export default function App() {
  const [projects, setProjects] = useLocalStorage('pp-projects', sampleProjects);
  const [selectedId, setSelectedId] = useState(projects[0]?.id || null);

  const selectedProject = projects.find((p) => p.id === selectedId) || null;

  const handleSelect = (id) => setSelectedId(id);

  const handleAddProject = (project) => {
    setProjects((prev) => [...prev, project]);
    setSelectedId(project.id);
  };

  const handleDeleteProject = (id) => {
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    if (selectedId === id) {
      setSelectedId(remaining[0]?.id || null);
    }
  };

  const handleUpdateProject = (updated) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

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
