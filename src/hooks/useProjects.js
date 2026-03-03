import { useState, useEffect, useCallback } from 'react';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (project) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error(`Failed to create project (${res.status})`);
    const created = await res.json();
    setProjects((prev) => [...prev, created]);
    return created;
  };

  const updateProject = async (project) => {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error(`Failed to update project (${res.status})`);
    const updated = await res.json();
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  };

  const deleteProject = async (id) => {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete project (${res.status})`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return { projects, loading, error, addProject, updateProject, deleteProject };
}
