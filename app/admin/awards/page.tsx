'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AdminAwards() {
  const [data, setData] = useState<any>(null);
  const [awards, setAwards] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemType, setItemType] = useState<'award' | 'certification'>('award');
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setAwards(d.awards || []);
        setCertifications(d.certifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAddAward = () => {
    setIsNew(true);
    setItemType('award');
    setEditingItem({
      id: 'award-' + Date.now(),
      title: '',
      issuer: 'Google Bug Hunters',
      date: '2025',
      badgeIcon: 'https://bughunters.google.com/static/assets/images/illustrations/awards/snake.svg',
      description: '',
      verifyUrl: 'https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759'
    });
  };

  const handleOpenAddCert = () => {
    setIsNew(true);
    setItemType('certification');
    setEditingItem({
      id: 'cert-' + Date.now(),
      title: '',
      issuer: 'Coursera',
      image: '/images/google.jpg',
      verifyUrl: ''
    });
  };

  const handleEdit = (item: any, type: 'award' | 'certification') => {
    setIsNew(false);
    setItemType(type);
    setEditingItem({ ...item });
  };

  const handleDelete = async (id: string, type: 'award' | 'certification') => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    let updatedData: any;
    if (type === 'award') {
      const updated = awards.filter(a => a.id !== id);
      setAwards(updated);
      updatedData = { ...data, awards: updated };
    } else {
      const updated = certifications.filter(c => c.id !== id);
      setCertifications(updated);
      updatedData = { ...data, certifications: updated };
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setData(updatedData);
        showToast('Item deleted successfully.');
      }
    } catch {
      showToast('Error deleting item.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.title) return;

    let updatedData: any;
    if (itemType === 'award') {
      let updatedAwards: any[];
      if (isNew) {
        updatedAwards = [...awards, editingItem];
      } else {
        updatedAwards = awards.map(a => a.id === editingItem.id ? editingItem : a);
      }
      setAwards(updatedAwards);
      updatedData = { ...data, awards: updatedAwards };
    } else {
      let updatedCerts: any[];
      if (isNew) {
        updatedCerts = [...certifications, editingItem];
      } else {
        updatedCerts = certifications.map(c => c.id === editingItem.id ? editingItem : c);
      }
      setCertifications(updatedCerts);
      updatedData = { ...data, certifications: updatedCerts };
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setData(updatedData);
        setEditingItem(null);
        showToast('Saved successfully!');
      }
    } catch {
      showToast('Error saving changes.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Awards & Certifications...</div>;
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Honors & Certifications Manager</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage Google Bug Hunters recognitions and verified credentials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleOpenAddAward} className="btn btn-outline">
            <Plus size={16} />
            Add Bug Bounty Award
          </button>
          <button onClick={handleOpenAddCert} className="btn btn-primary">
            <Plus size={16} />
            Add Certification
          </button>
        </div>
      </div>

      {/* Awards Section */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--brand-cyan)' }}>
          Google Bug Hunters & Security Honors
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {awards.map((award) => (
            <div
              key={award.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{award.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-cyan)', margin: '0.2rem 0 0.5rem 0' }}>
                  {award.issuer} • {award.date}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {award.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button onClick={() => handleEdit(award, 'award')} className="btn btn-outline btn-sm">
                  <Edit3 size={13} color="var(--brand-cyan)" />
                </button>
                <button onClick={() => handleDelete(award.id, 'award')} className="btn btn-outline btn-sm">
                  <Trash2 size={13} color="var(--brand-rose)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--brand-emerald)' }}>
          Industry Certifications
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cert.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cert.issuer}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button onClick={() => handleEdit(cert, 'certification')} className="btn btn-outline btn-sm">
                  <Edit3 size={13} color="var(--brand-cyan)" />
                </button>
                <button onClick={() => handleDelete(cert.id, 'certification')} className="btn btn-outline btn-sm">
                  <Trash2 size={13} color="var(--brand-rose)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
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
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {isNew ? `Add ${itemType === 'award' ? 'Award' : 'Certification'}` : `Edit ${editingItem.title}`}
              </h2>
              <button onClick={() => setEditingItem(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issuer / Organization</label>
                <input
                  type="text"
                  value={editingItem.issuer || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                  className="form-input"
                />
              </div>

              {itemType === 'award' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Year / Date</label>
                    <input
                      type="text"
                      value={editingItem.date || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Badge SVG / Icon URL</label>
                    <input
                      type="text"
                      value={editingItem.badgeIcon || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, badgeIcon: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={3}
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="form-textarea"
                    />
                  </div>
                </>
              )}

              {itemType === 'certification' && (
                <div className="form-group">
                  <label className="form-label">Certificate Image Path</label>
                  <input
                    type="text"
                    value={editingItem.image || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Verification Link</label>
                <input
                  type="url"
                  value={editingItem.verifyUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, verifyUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
