'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export default function AdminServices() {
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setServices(d.services || []);
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
    setEditingService({
      id: 'srv-' + Date.now(),
      title: '',
      icon: 'Cpu',
      summary: '',
      deliverables: ['Custom automation framework architecture', 'Parallel test execution setup'],
      hireUrl: 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'
    });
  };

  const handleEdit = (service: any) => {
    setIsNew(false);
    setEditingService({ ...service });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const updated = services.filter(s => s.id !== id);
    const updatedData = { ...data, services: updated };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setServices(updated);
        setData(updatedData);
        showToast('Service deleted.');
      }
    } catch {
      showToast('Error deleting service.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title) return;

    let updatedList: any[];
    if (isNew) {
      updatedList = [...services, editingService];
    } else {
      updatedList = services.map(s => s.id === editingService.id ? editingService : s);
    }

    const updatedData = { ...data, services: updatedList };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setServices(updatedList);
        setData(updatedData);
        setEditingService(null);
        showToast('Services updated successfully!');
      }
    } catch {
      showToast('Error saving service.');
    }
  };

  const addDeliverable = () => {
    setEditingService({
      ...editingService,
      deliverables: [...(editingService.deliverables || []), '']
    });
  };

  const updateDeliverable = (idx: number, val: string) => {
    const list = [...(editingService.deliverables || [])];
    list[idx] = val;
    setEditingService({ ...editingService, deliverables: list });
  };

  const removeDeliverable = (idx: number) => {
    const list = editingService.deliverables.filter((_: any, i: number) => i !== idx);
    setEditingService({ ...editingService, deliverables: list });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Services...</div>;
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Engineering Services Manager</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage the quality assurance and test automation services you offer to clients and recruiters.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {services.map((srv) => (
          <div
            key={srv.id}
            className="glass-panel"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-emerald">{srv.icon || 'Cpu'}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(srv)} className="btn btn-outline btn-sm">
                    <Edit3 size={13} color="var(--brand-cyan)" />
                  </button>
                  <button onClick={() => handleDelete(srv.id)} className="btn btn-outline btn-sm">
                    <Trash2 size={13} color="var(--brand-rose)" />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {srv.summary}
              </p>

              {srv.deliverables && (
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {srv.deliverables.map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--brand-cyan)' }}>Upwork Hire Link Configured</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingService && (
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
              maxWidth: '600px',
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
                {isNew ? 'Add Service Specification' : 'Edit Service Specification'}
              </h2>
              <button onClick={() => setEditingService(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Name</label>
                <select
                  value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="form-select"
                >
                  <option value="CheckSquare">CheckSquare (Manual QA)</option>
                  <option value="Cpu">Cpu (Automation)</option>
                  <option value="GitBranch">GitBranch (DevTestOps)</option>
                  <option value="Zap">Zap (API & Performance)</option>
                  <option value="ShieldCheck">ShieldCheck (Security / Bug Bounty)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.summary}
                  onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="form-label">Deliverables List</label>
                  <button type="button" onClick={addDeliverable} className="btn btn-outline btn-sm">
                    <Plus size={12} />
                    Add Item
                  </button>
                </div>
                {editingService.deliverables?.map((d: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateDeliverable(idx, e.target.value)}
                      className="form-input"
                    />
                    <button type="button" onClick={() => removeDeliverable(idx)} className="btn btn-ghost btn-sm">
                      <Trash2 size={14} color="var(--brand-rose)" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Upwork Hire URL</label>
                <input
                  type="url"
                  value={editingService.hireUrl || ''}
                  onChange={(e) => setEditingService({ ...editingService, hireUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingService(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
