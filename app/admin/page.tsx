'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  CheckCircle, 
  Briefcase, 
  MessageSquare, 
  User, 
  Layers, 
  Award, 
  Settings, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Activity,
  Check,
  Database,
  Cpu,
  Clock,
  Terminal
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
        Loading QA Admin Workspace...
      </div>
    );
  }

  const profile = data?.profile || {};
  const totalProjects = data?.projects?.length || 0;
  const totalSkills = data?.skills?.reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0) || 0;
  const totalExperiences = data?.experiences?.length || 0;
  const totalMessages = data?.messages?.length || 0;
  const unreadMessages = data?.messages?.filter((m: any) => !m.read)?.length || 0;
  const totalAwards = (data?.awards?.length || 0) + (data?.certifications?.length || 0);

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      {/* Top Welcome & System Status Banner */}
      <div 
        className="spec-card"
        style={{
          padding: '2rem 2.25rem',
          backgroundColor: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span className="tech-stamp tech-stamp-emerald">
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              OPERATIONAL
            </span>
            <span className="tech-stamp tech-stamp-slate">
              PORTFOLIO CMS CONTROL
            </span>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.4rem', color: '#0f172a', letterSpacing: '-0.025em' }}>
            Welcome back, {profile.name || 'Kazi Tamim'}!
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', maxWidth: '640px', lineHeight: 1.6 }}>
            Manage and update every portfolio section in real-time. Changes are stored persistently to disk in <code style={{ color: '#0f172a', fontWeight: 600 }}>data/portfolio.json</code>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Link href="/admin/profile" className="btn btn-primary">
            <User size={15} />
            <span>Edit Profile</span>
          </Link>
          <Link href="/" target="_blank" className="btn btn-outline">
            <ExternalLink size={15} />
            <span>Live Site</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Tiles */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Projects KPI */}
        <div className="spec-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
              AUTOMATION SYSTEMS
            </span>
            <FolderGit2 size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>{totalProjects}</div>
          <Link 
            href="/admin/projects" 
            style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}
          >
            <span>Manage Projects</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Skills KPI */}
        <div className="spec-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
              VERIFIED TECH STACK
            </span>
            <CheckCircle size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669' }}>{totalSkills}</div>
          <Link 
            href="/admin/skills" 
            style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}
          >
            <span>Manage Skills</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Experience KPI */}
        <div className="spec-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
              WORK EXPERIENCE
            </span>
            <Briefcase size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>{totalExperiences}</div>
          <Link 
            href="/admin/experience" 
            style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}
          >
            <span>Manage Positions</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Inquiries KPI */}
        <div className="spec-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
              CONTACT INBOX
            </span>
            <MessageSquare size={18} color="#dc2626" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>{totalMessages}</div>
            {unreadMessages > 0 && (
              <span className="tech-stamp tech-stamp-red" style={{ fontSize: '0.7rem' }}>
                {unreadMessages} UNREAD
              </span>
            )}
          </div>
          <Link 
            href="/admin/messages" 
            style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}
          >
            <span>Open Message Inbox</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* System Information & Architecture Status */}
      <div 
        className="spec-card"
        style={{
          padding: '1.5rem 1.75rem',
          backgroundColor: '#f8fafc',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
            STORAGE ENGINE
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <Database size={14} color="#059669" />
            <span>data/portfolio.json</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
            FRAMEWORK BUILD
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <Cpu size={14} color="#2563eb" />
            <span>Next.js 14 (App Router)</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
            STATIC PAGES GENERATED
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <CheckCircle size={14} color="#059669" />
            <span>18 / 18 Routes Ready</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>
            VRP CREDENTIALS
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <ShieldCheck size={14} color="#059669" />
            <span>Google Bug Hunters Active</span>
          </div>
        </div>
      </div>

      {/* Quick Management Shortcuts */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
          CMS Management Shortcuts
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
          Direct Section Editors
        </span>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <Link 
          href="/admin/profile" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Profile & Hero Section
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Bio, headline, metrics, social links, resume URL
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/projects" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Automation Systems ({totalProjects})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Add new projects, descriptions, tags, and metrics
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/skills" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Technical Skills Matrix ({totalSkills})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Proficiency levels, categories, experience years
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/experience" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Professional Experience ({totalExperiences})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Companies, roles, bullet point achievements
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/services" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Engineering Services
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Service packages, deliverables, Upwork links
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/awards" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Awards & Credentials ({totalAwards})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Google Bug Hunters VRP and certifications
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/messages" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Inquiry Messages ({totalMessages})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              View and reply to client inquiries
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>

        <Link 
          href="/admin/settings" 
          className="spec-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Backup & System Settings
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              1-click JSON export, restore seed defaults, change PIN
            </div>
          </div>
          <ArrowRight size={18} color="#059669" />
        </Link>
      </div>
    </div>
  );
}
