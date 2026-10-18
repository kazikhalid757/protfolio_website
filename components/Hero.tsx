'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroProps {
  profile: any;
}

export default function Hero({ profile }: HeroProps) {
  const p = profile || {};
  const metrics = p.metrics || {};
  const socials = p.socials || {};

  const toolSpecs: Record<string, string> = {
    'PLAYWRIGHT': 'E2E Web & API Multi-Browser Engine • Parallel Sharding (12x workers)',
    'CYPRESS': 'Component & SPA Regression Harness • Custom Network Stubbing',
    'SELENIUM GRID 4': 'Distributed Cross-Browser Kubernetes Pod Matrix',
    'REST ASSURED': 'Contract, Schema & Stateful Microservice API Verification',
    'APACHE JMETER': 'High-Concurrency Load, Stress & Spike Throughput Testing',
    'DOCKER': 'Hermetic Ephemeral Test Containers & Isolated CI Environments',
    'GITHUB ACTIONS': 'Automated PR Quality Gates, Matrix Workflows & Release Blockers',
    'OWASP ZAP': 'Automated DAST Security Scanning & API Vulnerability Auditing',
    'ALLURE REPORTS': 'Executive Telemetry, Trace Attachments & Flakiness Analytics'
  };

  const toolList = [
    'PLAYWRIGHT',
    'CYPRESS',
    'SELENIUM GRID 4',
    'REST ASSURED',
    'APACHE JMETER',
    'DOCKER',
    'GITHUB ACTIONS',
    'OWASP ZAP',
    'ALLURE REPORTS'
  ];

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [readoutText, setReadoutText] = useState('READY // 9 Core Frameworks Integrated in CI/CD');

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    setReadoutText(`${tool} // ${toolSpecs[tool] || 'Verified Production Test Toolchain'}`);
  };

  return (
    <section id="about" className="scroll-mt-24 pt-8 pb-12">
      {/* Anchor alias for #overview */}
      <span id="overview" className="sr-only">Overview</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ===================================================================
             HERO 12-COLUMN ASYMMETRIC ARCHITECTURAL GRID
             =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div className="space-y-6">
              
              {/* Top Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface border border-borderLight">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0"></span>
                <span className="font-mono text-[11px] font-semibold tracking-wider text-ink uppercase">
                  SYSTEMS OPERATIONAL // CI/CD QUALITY GATES ACTIVE
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-ink tracking-tight leading-[1.08]">
                Engineering{' '}
                <span className="text-emeraldSolid border-b-4 border-emeraldSolid pb-0.5">
                  Zero-Defect Releases
                </span>{' '}
                Through Test Architecture.
              </h1>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-[17px] text-inkMuted leading-relaxed max-w-2xl font-normal">
                I am <strong className="font-semibold text-ink">{p.name || 'Kazi Khalid Hasan Tamim'}</strong>. I architect high-speed automation frameworks, distributed CI/CD quality gates, and automated security verification to ensure web and API software never breaks in production.
              </p>

              {/* Action Bar (3 buttons aligned cleanly) */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* 1. Launch QA Command Studio */}
                <a 
                  href="#qa-runner"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-ink hover:bg-inkHover text-white font-mono text-xs sm:text-sm font-semibold micro-transition cursor-pointer"
                >
                  <span className="text-[#10B981] font-bold">&gt;_</span>
                  <span>Launch QA Command Studio</span>
                </a>

                {/* 2. Hire on Upwork */}
                <a 
                  href={socials.upwork || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-emeraldSolid hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold micro-transition"
                >
                  <span>Hire on Upwork</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
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
                    <svg className="w-4 h-4 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </div>

            {/* SLA Telemetry Bar (Two structured solid mini-cards side-by-side) */}
            <div className="pt-8 mt-8 border-t border-borderLight grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Mini-Card 1: Flakiness Rate */}
              <div className="bg-surface border border-borderLight rounded-md px-4 py-3 flex items-center justify-between micro-transition hover:border-borderHover">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-emeraldSurface border border-emeraldBorder flex items-center justify-center text-emeraldSolid shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-inkMuted">Flakiness Rate:</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText">
                  &lt; 0.5% SLA
                </span>
              </div>

              {/* Mini-Card 2: Direct Response */}
              <div className="bg-surface border border-borderLight rounded-md px-4 py-3 flex items-center justify-between micro-transition hover:border-borderHover">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blueSurface border border-blueBorder flex items-center justify-center text-blueSolid shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-inkMuted">Direct Response:</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blueSurface border border-blueBorder text-blueText">
                  &lt; 4 Hours
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Cols) - Organized Profile & Architecture Dossier Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface border border-borderLight rounded-lg overflow-hidden flex flex-col h-full justify-between">
              
              {/* Structural Header Bar */}
              <div className="bg-nested border-b border-borderLight px-5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ink"></span>
                  <span className="font-mono text-[11px] font-semibold text-inkMuted tracking-wider uppercase">
                    ARCHITECT DOSSIER // ID: KKH-SDET
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-emeraldSolid">
                  v4.2 STABLE
                </span>
              </div>

              {/* Main Card Body */}
              <div className="p-5 sm:p-6 space-y-5 flex-1">
                
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  {/* Clean Professional Avatar with Solid Border & Online Indicator */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-md bg-nested border border-borderHover overflow-hidden relative">
                      <Image 
                        src={p.avatar || '/images/me.jpg'} 
                        alt={p.name || 'Kazi Khalid Hasan Tamim'}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                    {/* Solid Online Indicator */}
                    <span 
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-surface" 
                      title="Available for Remote Engineering"
                    />
                  </div>

                  {/* Name, Role & Location */}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display font-bold text-lg text-ink tracking-tight truncate">
                      {p.name || 'Kazi Khalid Hasan Tamim'}
                    </h2>
                    <p className="font-mono text-xs font-semibold text-emeraldSolid mt-0.5 truncate">
                      &gt; {p.title || 'QA & Test Automation Engineer | SDET'}
                    </p>
                    <p className="text-xs text-inkSubtle mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>{p.location || 'Mirpur-2, Dhaka (UTC+6)'}</span>
                      <span>•</span>
                      <span className="font-medium text-inkMuted">Remote Worldwide</span>
                    </p>
                  </div>
                </div>

                {/* Credential Rows (2 structured solid rows with 1px borders) */}
                <div className="space-y-2.5">
                  {/* Row 1: Google Bug Hunters VRP */}
                  {socials.bughunters && (
                    <a
                      href={socials.bughunters}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-md bg-surface border border-borderLight flex items-center justify-between gap-3 micro-transition hover:border-blueBorder block"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-md bg-blueSurface border border-blueBorder flex items-center justify-center text-blueSolid shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="M9 12l2 2 4-4"/>
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-ink truncate">Google Bug Hunters VRP</div>
                          <div className="text-[11px] text-inkSubtle truncate">Independent Security Researcher</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded bg-blueSurface border border-blueBorder text-[#1D4ED8] whitespace-nowrap shrink-0">
                        VERIFIED PROFILE
                      </span>
                    </a>
                  )}

                  {/* Row 2: Top-Rated Upwork SDET */}
                  <a
                    href={socials.upwork || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-md bg-surface border border-borderLight flex items-center justify-between gap-3 micro-transition hover:border-emeraldBorder block"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-emeraldSurface border border-emeraldBorder flex items-center justify-center text-emeraldSolid shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-ink truncate">Top-Rated Upwork SDET</div>
                        <div className="text-[11px] text-inkSubtle truncate">100% Job Success Rate</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded bg-emeraldSurface border border-emeraldBorder text-[#047857] whitespace-nowrap shrink-0">
                      AVAILABLE
                    </span>
                  </a>
                </div>

                {/* PROVEN AUTOMATION TOOLCHAIN (Clean 3x3 organized grid with active interaction) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-inkSubtle">
                      PROVEN AUTOMATION TOOLCHAIN
                    </span>
                    <span className="font-mono text-[10px] text-emeraldSolid">
                      Click tag to inspect spec
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {toolList.map((tool) => {
                      const isSelected = activeTool === tool;
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => handleToolClick(tool)}
                          className={`toolchain-tag py-2 px-2 rounded font-mono text-[11px] font-semibold text-center truncate cursor-pointer ${
                            isSelected ? 'active-tag' : ''
                          }`}
                        >
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                  {/* Dynamic Tool Readout Bar */}
                  <div className="bg-canvas border border-borderLight rounded px-3 py-1.5 font-mono text-[11px] text-inkMuted flex items-center justify-between">
                    <span className="truncate mr-2">{readoutText}</span>
                    <span className="text-emeraldSolid font-bold shrink-0">OK</span>
                  </div>
                </div>

              </div>

              {/* Card Footer Telemetry (2-column split with 1px solid #E2E8F0 divider, #F8FAFC solid background) */}
              <div className="bg-canvas border-t border-borderLight grid grid-cols-2 divide-x divide-borderLight">
                {/* Col 1: PIPELINE PASS RATE */}
                <div className="p-4 space-y-2">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-inkSubtle">
                    PIPELINE PASS RATE
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xl font-extrabold text-emeraldSolid">
                      {metrics.pipelinePassRate || '99.8%'}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-emeraldText">SLA VERIFIED</span>
                  </div>
                  {/* Solid Progress Bar */}
                  <div className="w-full h-1.5 bg-borderLight rounded-none overflow-hidden">
                    <div className="h-full bg-emeraldSolid w-[99.8%]"></div>
                  </div>
                </div>

                {/* Col 2: PRE-PROD DEFECTS */}
                <div className="p-4 space-y-2">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-inkSubtle">
                    PRE-PROD DEFECTS
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xl font-extrabold text-ink">
                      {metrics.bugsCaughtPreProd || '480+'} Blocked
                    </span>
                  </div>
                  {/* Solid Status Indicator */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="inline-block w-2 h-2 bg-emeraldSolid"></span>
                    <span className="inline-block w-2 h-2 bg-emeraldSolid"></span>
                    <span className="inline-block w-2 h-2 bg-emeraldSolid"></span>
                    <span className="inline-block w-2 h-2 bg-emeraldSolid"></span>
                    <span className="font-mono text-[10px] font-semibold text-inkMuted ml-1">ZERO P0 ESCAPES</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ===================================================================
             3. KEY METRICS BENTO BAR (4-Column Organized Architectural Grid)
             =================================================================== */}
        <div aria-label="Key QA Metrics" className="bg-surface border border-borderLight rounded-lg p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Metric 01: AUTOMATED SUITES */}
            <div className="bg-surface border border-borderLight border-t-[3px] border-t-ink rounded-md p-5 micro-transition hover:border-borderHover">
              <div className="font-mono text-[11px] font-bold text-inkSubtle tracking-wider uppercase">
                01 // AUTOMATED SUITES
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-ink mt-2 tracking-tight">
                {metrics.automatedTestsExecuted || '18,500+'}
              </div>
              <p className="text-xs font-medium text-inkMuted mt-2">
                Total test executions completed
              </p>
            </div>

            {/* Metric 02: PIPELINE PASS SLA */}
            <div className="bg-surface border border-borderLight border-t-[3px] border-t-emeraldSolid rounded-md p-5 micro-transition hover:border-borderHover">
              <div className="font-mono text-[11px] font-bold text-inkSubtle tracking-wider uppercase">
                02 // PIPELINE PASS SLA
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-emeraldSolid mt-2 tracking-tight">
                {metrics.pipelinePassRate || '99.8%'}
              </div>
              <p className="text-xs font-medium text-inkMuted mt-2">
                Flakiness-free execution rate
              </p>
            </div>

            {/* Metric 03: REGRESSIONS BLOCKED */}
            <div className="bg-surface border border-borderLight border-t-[3px] border-t-amberSolid rounded-md p-5 micro-transition hover:border-borderHover">
              <div className="font-mono text-[11px] font-bold text-inkSubtle tracking-wider uppercase">
                03 // REGRESSIONS BLOCKED
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-amberSolid mt-2 tracking-tight">
                {metrics.bugsCaughtPreProd || '480+'}
              </div>
              <p className="text-xs font-medium text-inkMuted mt-2">
                Defects caught pre-production
              </p>
            </div>

            {/* Metric 04: DEFECT ESCAPE */}
            <div className="bg-surface border border-borderLight border-t-[3px] border-t-blueSolid rounded-md p-5 micro-transition hover:border-borderHover">
              <div className="font-mono text-[11px] font-bold text-inkSubtle tracking-wider uppercase">
                04 // DEFECT ESCAPE
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-blueSolid mt-2 tracking-tight">
                &lt; 0.2%
              </div>
              <p className="text-xs font-medium text-inkMuted mt-2">
                Strict production escape ratio
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
