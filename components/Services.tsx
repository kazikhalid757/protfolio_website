'use client';

import React from 'react';
import { 
  CheckSquare, 
  Cpu, 
  GitBranch, 
  Zap, 
  ShieldCheck, 
  Check, 
  ArrowRight
} from 'lucide-react';

interface ServicesProps {
  services?: any[];
}

export default function Services({ services }: ServicesProps) {
  const iconMap: Record<string, any> = {
    CheckSquare,
    Cpu,
    GitBranch,
    Zap,
    ShieldCheck
  };

  const defaultServices = [
    {
      id: 'srv-1',
      code: 'SPEC-01',
      title: 'Web & Mobile Test Automation',
      icon: 'Cpu',
      metric: '< 0.5% Flakiness SLA',
      summary: 'Architecting clean Page Object Model (POM) frameworks using Playwright, Cypress, and Selenium Grid across Chrome, Safari, Firefox, and mobile viewport matrix.',
      deliverables: [
        'Page Object Model (POM) architectural design',
        'Parallel headless multi-browser execution matrix',
        'Auto-waiting assertions & self-healing selectors',
        'Automated trace recordings and video failure capture'
      ],
      hireUrl: 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'
    },
    {
      id: 'srv-2',
      code: 'SPEC-02',
      title: 'API Microservices & Contract Testing',
      icon: 'Zap',
      metric: 'Sub-150ms Latency SLA',
      summary: 'Complete automated backend validation asserting strict JSON schemas, token rotation lifecycles, and microservice integration boundaries.',
      deliverables: [
        'REST Assured & Postman/Newman automation',
        'JSON Schema validation & contract testing',
        'OAuth2 & JWT token lifecycle automation',
        'High-speed CI regression gates'
      ],
      hireUrl: 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'
    },
    {
      id: 'srv-3',
      code: 'SPEC-03',
      title: 'DevTestOps CI/CD Quality Gates',
      icon: 'GitBranch',
      metric: 'Zero-Escape Merge Gate',
      summary: 'Embedding test suites directly into GitHub Actions and Jenkins pipelines via Docker to block broken pull requests before they hit staging.',
      deliverables: [
        'GitHub Actions & Jenkins pipeline triggers',
        'Containerized isolated test runners via Docker',
        'Automated Pull Request blocking on regression',
        'HTML & Allure test reports with Slack alerts'
      ],
      hireUrl: 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'
    },
    {
      id: 'srv-4',
      code: 'SPEC-04',
      title: 'Exploratory QA & Security Research',
      icon: 'ShieldCheck',
      metric: 'Google VRP Recognized',
      summary: 'Systematic exploratory test case planning combined with security audits based on Google Vulnerability Rewards Program (VRP) methodology.',
      deliverables: [
        'Comprehensive Test Plans & Traceability Matrices',
        'Defect Life Cycle management with reproducible steps',
        'OWASP Top 10 boundary and input fuzzing',
        'Root-cause defect analysis and team triage'
      ],
      hireUrl: 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'
    }
  ];

  const serviceList = services && services.length > 0 ? services : defaultServices;

  return (
    <section 
      id="services" 
      style={{ 
        padding: '5.5rem 0', 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-head-left">
          <div className="section-kicker">
            <span>[ 01 // ARCHITECTURAL CAPABILITIES ]</span>
          </div>
          <h2>Quality Engineering Capabilities</h2>
          <p>
            From systematic manual QA coverage to resilient test automation frameworks and zero-defect CI/CD pipelines.
          </p>
        </div>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {serviceList.map((service, idx) => {
            const Icon = iconMap[service.icon] || Cpu;
            const specCode = service.code || `SPEC-0${idx + 1}`;
            return (
              <div 
                key={service.id || service.title}
                className="spec-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  {/* Top Spec Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div 
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0f172a'
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <span className="tech-stamp tech-stamp-slate">
                      {specCode}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: '#0f172a' }}>
                    {service.title}
                  </h3>

                  {service.metric && (
                    <div style={{ marginBottom: '0.85rem' }}>
                      <span className="tech-stamp tech-stamp-emerald" style={{ fontSize: '0.68rem' }}>
                        {service.metric}
                      </span>
                    </div>
                  )}

                  <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {service.summary}
                  </p>

                  {/* Deliverables List */}
                  {service.deliverables && service.deliverables.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                        ENGINEERING DELIVERABLES
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {service.deliverables.map((item: string, i: number) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: '#334155' }}>
                            <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Hire CTA */}
                <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                  <a
                    href={service.hireUrl || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>Request Specification</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
