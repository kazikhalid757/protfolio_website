'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  Check, 
  AlertCircle, 
  Link as LinkIcon, 
  ShieldCheck, 
  Activity,
  FileText
} from 'lucide-react';

export default function AdminProfile() {
  const [data, setData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setProfile(d.profile || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData = {
        ...data,
        profile: profile
      };

      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        setData(updatedData);
        showToast('Profile and Hero section updated successfully!');
      } else {
        showToast('Failed to save changes. Please try again.');
      }
    } catch {
      showToast('Error saving profile data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
        Loading Profile Editor...
      </div>
    );
  }

  const updateField = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateMetric = (field: string, value: any) => {
    setProfile((prev: any) => ({
      ...prev,
      metrics: {
        ...(prev.metrics || {}),
        [field]: value
      }
    }));
  };

  const updateSocial = (field: string, value: any) => {
    setProfile((prev: any) => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [field]: value
      }
    }));
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Toast Alert */}
      {toast && (
        <div className="toast-notice">
          <Check size={18} color="#34d399" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span className="tech-stamp tech-stamp-slate">EDITOR // 01</span>
            <span className="tech-stamp tech-stamp-emerald">HERO & IDENTITY</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Profile & Hero Editor</h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Configure your professional headline, bio description, live status, verified metrics, and social handles.
          </p>
        </div>

        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn btn-primary"
        >
          <Save size={15} />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Basic Personal Details */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Basic Information & Headline
            </h2>
            <span className="tech-stamp tech-stamp-blue">CORE IDENTITY</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                value={profile.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short / Preferred Name</label>
              <input
                type="text"
                value={profile.shortName || ''}
                onChange={(e) => updateField('shortName', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Professional Role Headline *</label>
              <input
                type="text"
                required
                value={profile.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Tagline (Shown in Hero Banner)</label>
              <input
                type="text"
                value={profile.tagline || ''}
                onChange={(e) => updateField('tagline', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Bio Description</label>
              <textarea
                rows={4}
                value={profile.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Availability Status Text</label>
              <input
                type="text"
                value={profile.availabilityStatus || ''}
                onChange={(e) => updateField('availabilityStatus', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Avatar Image Path</label>
              <input
                type="text"
                value={profile.avatar || ''}
                onChange={(e) => updateField('avatar', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Resume / CV Download URL</label>
              <input
                type="url"
                value={profile.resumeUrl || ''}
                onChange={(e) => updateField('resumeUrl', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Contact & Location Details
            </h2>
            <span className="tech-stamp tech-stamp-emerald">DIRECT CHANNELS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                value={profile.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone / WhatsApp *</label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Location / Engineering Base</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Hero Performance Metrics */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Hard Telemetry Metrics
            </h2>
            <span className="tech-stamp tech-stamp-amber">KEY INDICATORS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Automated Tests Executed</label>
              <input
                type="text"
                value={profile.metrics?.automatedTestsExecuted || ''}
                onChange={(e) => updateMetric('automatedTestsExecuted', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pipeline Pass Rate</label>
              <input
                type="text"
                value={profile.metrics?.pipelinePassRate || ''}
                onChange={(e) => updateMetric('pipelinePassRate', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bugs Caught Pre-Production</label>
              <input
                type="text"
                value={profile.metrics?.bugsCaughtPreProd || ''}
                onChange={(e) => updateMetric('bugsCaughtPreProd', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="text"
                value={profile.metrics?.yearsExperience || ''}
                onChange={(e) => updateMetric('yearsExperience', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Social & Platform Links */}
        <div className="spec-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Platform & Social Handles
            </h2>
            <span className="tech-stamp tech-stamp-slate">EXTERNAL PROFILES</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                value={profile.socials?.linkedin || ''}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub Profile URL</label>
              <input
                type="url"
                value={profile.socials?.github || ''}
                onChange={(e) => updateSocial('github', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upwork Freelancer URL</label>
              <input
                type="url"
                value={profile.socials?.upwork || ''}
                onChange={(e) => updateSocial('upwork', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Bug Hunters Profile URL</label>
              <input
                type="url"
                value={profile.socials?.bughunters || ''}
                onChange={(e) => updateSocial('bughunters', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
