'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  Calendar, 
  MapPin 
} from 'lucide-react';

export default function AdminExperience() {
  const [data, setData] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setExperiences(d.experiences || []);
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
    setEditingExp({
      id: 'exp-' + Date.now(),
      role: '',
      company: '',
      location: 'Dhaka, Bangladesh',
      period: '2025 – Present',
      type: 'Full-Time (Remote)',
      highlights: [
        'Executed end-to-end regression test automation.',
        'Reduced bug escape rate by 40% using automated CI gates.'
      ],
      techStack: ['Playwright', 'Python', 'Docker', 'Postman']
    });
  };

  const handleEdit = (exp: any) => {
    setIsNew(false);
    setEditingExp({ ...exp });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this experience?')) return;

    const updated = experiences.filter(e => e.id !== id);
    const updatedData = { ...data, experiences: updated };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setExperiences(updated);
        setData(updatedData);
        showToast('Experience entry deleted.');
      }
    } catch {
      showToast('Error deleting experience.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp.role || !editingExp.company) return;

    let updatedList: any[];
    if (isNew) {
      updatedList = [editingExp, ...experiences];
    } else {
      updatedList = experiences.map(e => e.id === editingExp.id ? editingExp : e);
    }

    const updatedData = { ...data, experiences: updatedList };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setExperiences(updatedList);
        setData(updatedData);
        setEditingExp(null);
        showToast(isNew ? 'Experience added!' : 'Experience updated!');
      }
    } catch {
      showToast('Error saving experience.');
    }
  };

  const addHighlight = () => {
    setEditingExp({
      ...editingExp,
      highlights: [...(editingExp.highlights || []), '']
    });
  };

  const updateHighlight = (idx: number, val: string) => {
    const list = [...(editingExp.highlights || [])];
    list[idx] = val;
    setEditingExp({ ...editingExp, highlights: list });
  };

  const removeHighlight = (idx: number) => {
    const list = editingExp.highlights.filter((_: any, i: number) => i !== idx);
    setEditingExp({ ...editingExp, highlights: list });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Experiences...</div>;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {toast && (
        <div className="toast-notice">
          <Check size={18} color="var(--brand-emerald)" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Professional Experience Manager</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage career timeline, company roles, achievements, and tech stacks.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="glass-panel"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              borderLeft: '4px solid var(--brand-amber)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{exp.role}</h3>
                <div style={{ fontSize: '1.05rem', color: 'var(--brand-cyan)', fontWeight: 600 }}>{exp.company}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {exp.period} • {exp.location} • <span style={{ color: 'var(--brand-emerald)' }}>{exp.type}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(exp)} className="btn btn-outline btn-sm">
                  <Edit3 size={14} color="var(--brand-cyan)" />
                  Edit
                </button>
                <button onClick={() => handleDelete(exp.id)} className="btn btn-outline btn-sm">
                  <Trash2 size={14} color="var(--brand-rose)" />
                </button>
              </div>
            </div>

            {/* Highlights */}
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {exp.highlights?.map((h: string, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>

            {/* Tech Stack */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {exp.techStack?.map((t: string, i: number) => (
                <span key={i} className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingExp && (
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
              maxWidth: '680px',
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {isNew ? 'Add Experience Entry' : 'Edit Experience Entry'}
              </h2>
              <button onClick={() => setEditingExp(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Period / Duration</label>
                  <input
                    type="text"
                    value={editingExp.period || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Job Type (e.g. Full-Time, Remote, Contract)</label>
                  <input
                    type="text"
                    value={editingExp.type || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Highlights */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="form-label">Key Achievements / Bullet Points</label>
                  <button type="button" onClick={addHighlight} className="btn btn-outline btn-sm">
                    <Plus size={12} />
                    Add Bullet
                  </button>
                </div>
                {editingExp.highlights?.map((h: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHighlight(idx, e.target.value)}
                      className="form-input"
                    />
                    <button type="button" onClick={() => removeHighlight(idx)} className="btn btn-ghost btn-sm">
                      <Trash2 size={14} color="var(--brand-rose)" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <div className="form-group">
                <label className="form-label">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Playwright, Python, Postman, JIRA, Docker"
                  value={editingExp.techStack ? editingExp.techStack.join(', ') : ''}
                  onChange={(e) => setEditingExp({
                    ...editingExp,
                    techStack: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)
                  })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingExp(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
