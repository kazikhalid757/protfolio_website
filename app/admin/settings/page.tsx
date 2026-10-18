'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  KeyRound, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Database,
  Lock
} from 'lucide-react';

export default function AdminSettings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportJson = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `kazi-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database JSON exported successfully!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.profile || !parsed.projects) {
          showToast('Invalid portfolio backup JSON format.');
          return;
        }

        const res = await fetch('/api/portfolio', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });

        if (res.ok) {
          setData(parsed);
          showToast('Database restored from JSON successfully!');
        } else {
          showToast('Failed to save imported data.');
        }
      } catch {
        showToast('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = async () => {
    if (!confirm('Are you sure you want to reset all portfolio data back to default initial seed data? Any unsaved edits will be lost.')) return;

    try {
      const res = await fetch('/api/portfolio/reset', { method: 'POST' });
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        showToast('Portfolio reset to initial seed defaults successfully!');
      } else {
        showToast('Failed to reset portfolio.');
      }
    } catch {
      showToast('Error resetting portfolio.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    setPwError(null);

    if (newPassword.length < 4) {
      setPwError('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          newPassword
        })
      });
      const result = await res.json();
      if (res.ok) {
        setPwMessage('Admin password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwError(result.error || 'Failed to update password.');
      }
    } catch {
      setPwError('Error communicating with authentication server.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
        Loading Settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {toast && (
        <div className="toast-notice">
          <Check size={18} color="#34d399" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
          <span className="tech-stamp tech-stamp-slate">DATABASE & SYSTEM</span>
          <span className="tech-stamp tech-stamp-emerald">PERSISTENCE</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Database & CMS Settings</h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          Manage JSON backups, import data, reset initial defaults, and update administrator security PIN.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Backup & Export */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={20} color="#059669" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Data Backup & Portability</h2>
            </div>
            <span className="tech-stamp tech-stamp-slate">JSON DATASET</span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Export a full JSON backup of your entire portfolio (profile, projects, skills, experience, and messages). You can restore this backup anytime on any local or production server.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            <button onClick={handleExportJson} className="btn btn-primary">
              <Download size={15} />
              <span>Export Full Database (JSON)</span>
            </button>

            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
              <Upload size={15} />
              <span>Import Backup JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Change Admin Password */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={20} color="#d97706" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Change Master Security PIN</h2>
            </div>
            <span className="tech-stamp tech-stamp-amber">AUTHENTICATION</span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Default active PIN is: <code style={{ color: '#0f172a', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{data?.adminSettings?.adminPin || 'admin123'}</code>
          </p>

          <form onSubmit={handleChangePassword} style={{ maxWidth: '440px' }}>
            <div className="form-group">
              <label className="form-label">New Password / PIN</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 4 characters"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="form-input"
              />
            </div>

            {pwError && (
              <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {pwError}
              </div>
            )}

            {pwMessage && (
              <div style={{ color: '#059669', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {pwMessage}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Lock size={14} />
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* Reset to Initial Defaults */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #fee2e2', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={20} color="#dc2626" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626' }}>Reset Database to Seed Defaults</h2>
            </div>
            <span className="tech-stamp tech-stamp-red">DANGER ZONE</span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Restore the original portfolio dataset (Kazi&apos;s verified projects, Google Bug Hunters credentials, SoftStandard Solutions experience, and test suites).
          </p>

          <button 
            onClick={handleResetDefaults} 
            className="btn btn-outline" 
            style={{ borderColor: '#fca5a5', color: '#dc2626' }}
          >
            <RotateCcw size={15} />
            <span>Reset to Initial Default Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
