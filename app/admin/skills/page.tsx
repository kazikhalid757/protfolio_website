'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  Layers, 
  Activity 
} from 'lucide-react';

export default function AdminSkills() {
  const [data, setData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setSkills(d.skills || []);
        if (d.skills && d.skills.length > 0) {
          setActiveCategory(d.skills[0].category);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = (category: string) => {
    setIsNew(true);
    setEditingSkill({
      category,
      name: '',
      level: 90,
      experience: '2 yrs',
      icon: 'CheckCircle2'
    });
  };

  const handleEdit = (category: string, item: any, itemIndex: number) => {
    setIsNew(false);
    setEditingSkill({
      category,
      itemIndex,
      ...item
    });
  };

  const handleDelete = async (category: string, itemIndex: number) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;

    const updatedSkills = skills.map((cat) => {
      if (cat.category === category) {
        return {
          ...cat,
          items: cat.items.filter((_: any, idx: number) => idx !== itemIndex)
        };
      }
      return cat;
    });

    const updatedData = { ...data, skills: updatedSkills };
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setSkills(updatedSkills);
        setData(updatedData);
        showToast('Skill deleted successfully.');
      }
    } catch {
      showToast('Error deleting skill.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill.name) return;

    const updatedSkills = skills.map((cat) => {
      if (cat.category === editingSkill.category) {
        let newItems: any[];
        const itemPayload = {
          name: editingSkill.name,
          level: Number(editingSkill.level),
          experience: editingSkill.experience,
          icon: editingSkill.icon || 'Code2'
        };

        if (isNew) {
          newItems = [...(cat.items || []), itemPayload];
        } else {
          newItems = cat.items.map((it: any, idx: number) => idx === editingSkill.itemIndex ? itemPayload : it);
        }

        return { ...cat, items: newItems };
      }
      return cat;
    });

    const updatedData = { ...data, skills: updatedSkills };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setSkills(updatedSkills);
        setData(updatedData);
        setEditingSkill(null);
        showToast(isNew ? 'Skill added successfully!' : 'Skill updated successfully!');
      }
    } catch {
      showToast('Error saving skill.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Skills...</div>;
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Skills & Tech Stack Manager</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Configure QA methodologies, frameworks, languages, and proficiency levels displayed in your matrix.
          </p>
        </div>
      </div>

      {/* Categories Accordions / Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {skills.map((categoryGroup) => (
          <div 
            key={categoryGroup.category} 
            className="glass-panel"
            style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-cyan)' }}>
                  {categoryGroup.category}
                </h2>
                <span className="badge badge-cyan">{categoryGroup.items?.length || 0} skills</span>
              </div>

              <button 
                onClick={() => handleOpenAdd(categoryGroup.category)} 
                className="btn btn-outline btn-sm"
              >
                <Plus size={14} />
                Add Skill
              </button>
            </div>

            {/* Items List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {categoryGroup.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-emerald)' }}>{item.level}%</span>
                  </div>

                  <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.level}%`, background: 'var(--brand-cyan)' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Exp: {item.experience}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEdit(categoryGroup.category, item, idx)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.2rem 0.4rem', height: 'auto' }}
                      >
                        <Edit3 size={13} color="var(--brand-cyan)" />
                      </button>
                      <button 
                        onClick={() => handleDelete(categoryGroup.category, idx)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.2rem 0.4rem', height: 'auto' }}
                      >
                        <Trash2 size={13} color="var(--brand-rose)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingSkill && (
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
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {isNew ? `Add Skill to ${editingSkill.category}` : `Edit ${editingSkill.name}`}
              </h2>
              <button onClick={() => setEditingSkill(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="form-group">
                <label className="form-label">Skill / Tool Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Proficiency Level</label>
                  <span style={{ fontWeight: 700, color: 'var(--brand-cyan)' }}>{editingSkill.level}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={editingSkill.level}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                  style={{ width: '100%', accentColor: 'var(--brand-cyan)', cursor: 'pointer' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Label</label>
                <input
                  type="text"
                  placeholder="e.g. 3 yrs / 2.5 yrs"
                  value={editingSkill.experience || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, experience: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingSkill(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
