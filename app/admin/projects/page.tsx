'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  ExternalLink, 
  Github, 
  Activity,
  Star
} from 'lucide-react';

export default function AdminProjects() {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setProjects(d.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingProject({
      id: 'proj-' + Date.now(),
      title: '',
      category: 'Test Automation',
      featured: false,
      description: '',
      metrics: '',
      tags: ['Playwright', 'TypeScript'],
      github: '',
      liveDemo: '',
      image: '/images/1.png'
    });
  };

  const handleEdit = (project: any) => {
    setIsNew(false);
    setEditingProject({ ...project });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const updatedProjects = projects.filter(p => p.id !== id);
    const updatedData = { ...data, projects: updatedProjects };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setProjects(updatedProjects);
        setData(updatedData);
        showToast('Project deleted successfully.');
      }
    } catch {
      showToast('Error deleting project.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject.title) return;

    let updatedProjects: any[];
    if (isNew) {
      updatedProjects = [editingProject, ...projects];
    } else {
      updatedProjects = projects.map(p => p.id === editingProject.id ? editingProject : p);
    }

    const updatedData = { ...data, projects: updatedProjects };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setProjects(updatedProjects);
        setData(updatedData);
        setEditingProject(null);
        showToast(isNew ? 'New project added successfully!' : 'Project updated successfully!');
      }
    } catch {
      showToast('Error saving project.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Projects...</div>;
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      {toast && (
        <div className="toast-notice">
          <Check size={18} color="var(--brand-emerald)" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Automation Projects Manager</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Add, update, or remove automation repositories, framework demos, and performance test suites.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      {/* Projects List Table / Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              {proj.featured && (
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={12} />
                    Featured
                  </span>
                </div>
              )}

              <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
                {proj.category}
              </span>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', paddingRight: '2rem' }}>
                {proj.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {proj.description}
              </p>

              {proj.metrics && (
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Activity size={14} />
                  <span>{proj.metrics}</span>
                </div>
              )}

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {proj.tags?.map((t: string, i: number) => (
                  <span 
                    key={i} 
                    style={{ 
                      fontSize: '0.7rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '0.15rem 0.45rem', 
                      borderRadius: '4px' 
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Github size={13} />
                    Repo
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(proj)} className="btn btn-outline btn-sm" title="Edit Project">
                  <Edit3 size={14} color="var(--brand-cyan)" />
                  Edit
                </button>
                <button onClick={() => handleDelete(proj.id)} className="btn btn-outline btn-sm" title="Delete Project">
                  <Trash2 size={14} color="var(--brand-rose)" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingProject && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            className="spec-card"
            style={{
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                {isNew ? 'Add New Project System' : 'Edit Project System'}
              </h2>
              <button onClick={() => setEditingProject(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Test Automation">Test Automation</option>
                    <option value="DevTestOps">DevTestOps</option>
                    <option value="API Testing">API Testing</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Featured on Homepage?</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                    <input
                      type="checkbox"
                      id="featured-check"
                      checked={editingProject.featured || false}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="featured-check" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                      Mark as Featured
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Metrics Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. 65% faster builds | 100% automated triggers"
                  value={editingProject.metrics || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Playwright, JavaScript, Docker, Jenkins"
                  value={editingProject.tags ? editingProject.tags.join(', ') : ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)
                  })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.github || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Live Demo / Allure Report URL</label>
                  <input
                    type="url"
                    value={editingProject.liveDemo || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemo: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL / Path</label>
                <input
                  type="text"
                  placeholder="/images/1.png"
                  value={editingProject.image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
