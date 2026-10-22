'use client';

import React from 'react';
import Image from 'next/image';
import { Briefcase, Calendar, MapPin, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface HeroProps {
  profile: any;
  experiences?: any[];
}

export default function Hero({ profile, experiences }: HeroProps) {
  const p = profile || {};
  const metrics = p.metrics || {};
  const socials = p.socials || {};

  // Dynamically detect current active role
  const currentExp = experiences?.find((e: any) => 
    e.period?.toLowerCase().includes('present')
  ) || experiences?.[0];

  const frameworks = [
    'Playwright',
    'Cypress',
    'Selenium Grid',
    'REST Assured',
    'Docker',
    'GitHub Actions'
  ];

  return (
    <section id="about" className="scroll-mt-24 pt-8 pb-12">
      {/* Anchor alias for #overview */}
      <span id="overview" className="sr-only">Overview</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ===================================================================
             HERO 12-COLUMN ARCHITECTURAL GRID (Equally balanced columns)
             =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN (7 Cols) - Headline, Intro, Actions & Telemetry Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1 space-y-6">
            
            {/* Top Block: Status, Headline, Bio, Buttons */}
            <div className="space-y-6">
              {/* Top Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface border border-borderLight shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="font-mono text-[11px] font-semibold tracking-wider text-ink uppercase">
                  Systems Operational // Available for SDET Roles
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[52px] text-ink tracking-tight leading-[1.08]">
                Engineering{' '}
                <span className="text-emeraldSolid border-b-4 border-emeraldSolid pb-0.5">
                  Zero-Defect Releases
                </span>{' '}
                Through Test Architecture.
              </h1>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-lg text-inkMuted leading-relaxed max-w-2xl font-normal">
                I'm <strong className="font-semibold text-ink">{p.name || 'Kazi Khalid Hasan Tamim'}</strong>, a QA &amp; Test Automation Engineer (SDET) with 3+ years of experience. I architect resilient test frameworks in <strong className="font-semibold text-ink">Playwright</strong>, <strong className="font-semibold text-ink">Cypress</strong>, and <strong className="font-semibold text-ink">REST Assured</strong>, paired with automated <strong className="font-semibold text-ink">CI/CD Quality Gates</strong> to guarantee zero-defect releases.
              </p>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* 1. View Capabilities */}
                <a 
                  href="#capabilities"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-ink hover:bg-inkHover text-white font-mono text-xs sm:text-sm font-semibold micro-transition cursor-pointer shadow-sm"
                >
                  <span className="text-[#10B981] font-bold">&gt;_</span>
                  <span>View Capabilities</span>
                </a>

                {/* 2. Hire on Upwork */}
                <a 
                  href={socials.upwork || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-emeraldSolid hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold micro-transition shadow-sm"
                >
                  <span>Hire on Upwork</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17L17 7M17 7H8M17 7V16"/>
                  </svg>
                </a>

                {/* 3. Download CV */}
                {p.resumeUrl && (
                  <a 
                    href={p.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-surface hover:bg-nested text-ink border border-borderHover text-xs sm:text-sm font-semibold micro-transition cursor-pointer"
                    title="Download Official CV"
                  >
                    <svg className="w-4 h-4 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </div>

            {/* Smart Space Management: Verified QA Telemetry Metrics (Fills left column with high-signal proof) */}
            <div className="pt-6 border-t border-borderLight space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emeraldSolid" />
                  <span className="font-mono text-[11px] font-bold text-inkSubtle uppercase tracking-wider">
                    VERIFIED QA TELEMETRY
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-emeraldSolid">
                  Production SLA Benchmarks
                </span>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Metric 01: Automated Test Runs */}
                <div className="p-3.5 rounded-xl bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
                  <div className="font-mono text-[10px] font-bold text-inkSubtle uppercase tracking-wider">
                    AUTOMATED TEST RUNS
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-ink mt-1 tracking-tight">
                    {metrics.automatedTestsExecuted || '18,500+'}
                  </div>
                  <p className="text-[11px] font-medium text-inkMuted mt-0.5">
                    Completed test executions
                  </p>
                </div>

                {/* Metric 02: Pipeline Pass Rate */}
                <div className="p-3.5 rounded-xl bg-surface border border-borderLight hover:border-emeraldBorder shadow-sm transition-all">
                  <div className="font-mono text-[10px] font-bold text-emeraldSolid uppercase tracking-wider">
                    PIPELINE PASS SLA
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emeraldSolid mt-1 tracking-tight">
                    {metrics.pipelinePassRate || '99.8%'}
                  </div>
                  <p className="text-[11px] font-medium text-inkMuted mt-0.5">
                    Flakiness-free execution rate
                  </p>
                </div>

                {/* Metric 03: Regressions Blocked */}
                <div className="p-3.5 rounded-xl bg-surface border border-borderLight hover:border-amberBorder shadow-sm transition-all">
                  <div className="font-mono text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    REGRESSIONS BLOCKED
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 tracking-tight">
                    {metrics.bugsCaughtPreProd || '480+'}
                  </div>
                  <p className="text-[11px] font-medium text-inkMuted mt-0.5">
                    Pre-production defects caught
                  </p>
                </div>

                {/* Metric 04: Defect Escape */}
                <div className="p-3.5 rounded-xl bg-surface border border-borderLight hover:border-blueBorder shadow-sm transition-all">
                  <div className="font-mono text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    DEFECT ESCAPE SLA
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1 tracking-tight">
                    &lt; 0.2%
                  </div>
                  <p className="text-[11px] font-medium text-inkMuted mt-0.5">
                    Strict production release gate
                  </p>
                </div>
              </div>

              {/* Core Frameworks Pill Row */}
              <div className="p-3 rounded-xl bg-canvas border border-borderLight flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-inkSubtle uppercase">
                  ACTIVE FRAMEWORKS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {frameworks.map((tool) => (
                    <span 
                      key={tool} 
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-borderLight text-ink font-semibold"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Cols) - Full Picture + Dynamic Current Company Work Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-surface border border-borderLight rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 space-y-5 h-full flex flex-col justify-between">
              
              {/* Full Portrait Photo (Exact 3:4 Aspect Ratio of original photo) */}
              <div className="relative w-full aspect-[3/4] max-w-[420px] mx-auto rounded-xl overflow-hidden bg-nested border border-borderLight shadow-sm">
                <Image 
                  src={p.avatar || '/images/kazi-tamim.jpg'} 
                  alt={p.name || 'Kazi Khalid Hasan Tamim'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  style={{ objectFit: 'cover' }}
                  priority
                  className="rounded-xl"
                />
                {/* Active Availability Badge on Image */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-xs font-semibold tracking-wide">
                    Available for Remote Roles
                  </span>
                </div>
              </div>

              {/* Name, Role & Location Header */}
              <div className="space-y-1">
                <h2 className="font-display font-extrabold text-2xl text-ink tracking-tight">
                  {p.name || 'Kazi Khalid Hasan Tamim'}
                </h2>
                <p className="font-mono text-xs sm:text-sm font-semibold text-emeraldSolid">
                  QA &amp; Test Automation Engineer | SDET
                </p>
              </div>

              {/* Dynamic Current Company Work Information */}
              {currentExp && (
                <div className="p-4 rounded-xl bg-canvas border border-borderLight space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-mono text-[11px] font-bold text-emeraldSolid uppercase tracking-wider">
                        CURRENT ROLE
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-surface border border-borderLight text-inkMuted">
                      {currentExp.period || 'Present'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-ink">
                      {currentExp.role}
                    </h3>
                    <div className="text-xs font-semibold text-inkMuted mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-emeraldSolid font-bold">@ {currentExp.company}</span>
                      <span>•</span>
                      <span>{currentExp.type || 'Full-Time (Remote)'}</span>
                      {currentExp.location && (
                        <>
                          <span>•</span>
                          <span>{currentExp.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {currentExp.highlights && currentExp.highlights.length > 0 && (
                    <ul className="space-y-1 pt-1.5 border-t border-borderLight">
                      {currentExp.highlights.slice(0, 2).map((h: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-inkMuted leading-relaxed">
                          <span className="text-emeraldSolid font-bold mt-0.5">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {currentExp.techStack && currentExp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-borderLight">
                      {currentExp.techStack.map((tech: string) => (
                        <span key={tech} className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-borderLight text-ink font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Location & Availability Quick Row */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-surface border border-borderLight">
                  <span className="text-[10px] uppercase text-inkSubtle block">Location</span>
                  <span className="font-semibold text-ink truncate block">{p.location || 'Dhaka, Bangladesh'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-borderLight">
                  <span className="text-[10px] uppercase text-inkSubtle block">Availability</span>
                  <span className="font-semibold text-emeraldSolid truncate block">Remote Worldwide</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
