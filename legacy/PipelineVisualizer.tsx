'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  Box, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Terminal,
  Activity
} from 'lucide-react';

export default function PipelineVisualizer() {
  const stages = [
    {
      id: 1,
      title: 'Git PR Trigger',
      icon: GitBranch,
      tool: 'GitHub Actions / GitLab',
      desc: 'Developer pushes code or opens PR. Webhook triggers automated test workflow instantly.',
      badge: 'Step 1'
    },
    {
      id: 2,
      title: 'Code Lint & Security',
      icon: Search,
      tool: 'Static Analysis',
      desc: 'ESLint, TypeScript validation, dependency vulnerability scans (OWASP, Trivy).',
      badge: 'Step 2'
    },
    {
      id: 3,
      title: 'Docker Test Runner',
      icon: Box,
      tool: 'Docker & Compose',
      desc: 'Spins up isolated multi-arch containers for reproducible, clean test runs.',
      badge: 'Step 3'
    },
    {
      id: 4,
      title: 'Parallel E2E & API',
      icon: Layers,
      tool: 'Playwright & Grid',
      desc: 'Concurrent execution of cross-browser tests and backend contract validation.',
      badge: 'Step 4'
    },
    {
      id: 5,
      title: 'Quality Gate Pass',
      icon: ShieldCheck,
      tool: 'PR Blocker Gate',
      desc: 'Blocks merge if pass rate < 99.5% or flaky regressions detected.',
      badge: 'Step 5'
    },
    {
      id: 6,
      title: 'Deploy & Slack Alert',
      icon: CheckCircle2,
      tool: 'Jenkins & Webhooks',
      desc: 'Automated release staging, Allure test reporting, and team notification.',
      badge: 'Step 6'
    }
  ];

  const [activeStage, setActiveStage] = useState(stages[3]);

  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
      <div className="container">
        <div className="section-head">
          <span className="badge badge-cyan">
            <GitBranch size={14} />
            DevTestOps Architecture
          </span>
          <h2>Automated CI/CD Quality Pipeline</h2>
          <p>
            How automated tests act as infallible quality gates to ensure continuous zero-defect delivery.
          </p>
        </div>

        {/* Pipeline Stepper Horizontal */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = activeStage.id === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveStage(stage)}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--brand-cyan)' : 'var(--border-glass)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-card)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--brand-cyan)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#ffffff' : 'var(--brand-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stage.badge}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}>{stage.title}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(17, 26, 46, 0.95) 0%, rgba(11, 17, 32, 0.95) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-emerald">{activeStage.badge}</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{activeStage.title}</h3>
              <span className="badge badge-cyan">{activeStage.tool}</span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {activeStage.desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Execution SLA</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>&lt; 3.5 Mins</div>
            </div>
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-emerald)'
              }}
            >
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
