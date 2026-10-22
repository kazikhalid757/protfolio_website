'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  GitBranch,
  Layers,
  Cpu
} from 'lucide-react';

interface InteractiveConsoleProps {
  testSuites?: any[];
}

export default function InteractiveConsole({ testSuites }: InteractiveConsoleProps) {
  // Tabs: 'capabilities' | 'architecture'
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<'capabilities' | 'architecture'>('capabilities');

  return (
    <section id="capabilities" className="scroll-mt-24 space-y-6 pt-4 pb-12">
      {/* Anchor aliases for #qa-studio, #qa-runner, #architecture */}
      <span id="qa-studio" className="sr-only">Capabilities</span>
      <span id="qa-runner" className="sr-only">Capabilities</span>
      <span id="architecture" className="sr-only">Architecture</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header + Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-borderLight pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-emeraldSolid uppercase tracking-wider block">
              ENGINEERING ARCHITECTURE
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight mt-0.5">
              Core Capabilities &amp; Pipeline
            </h2>
          </div>

          {/* Clean Architectural Tabs */}
          <div className="inline-flex bg-nested border border-borderLight rounded-md p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveWorkbenchTab('capabilities')}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold micro-transition cursor-pointer ${
                activeWorkbenchTab === 'capabilities' 
                  ? 'bg-ink text-white shadow-sm' 
                  : 'text-inkMuted hover:text-ink'
              }`}
            >
              Capabilities
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkbenchTab('architecture')}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold micro-transition cursor-pointer ${
                activeWorkbenchTab === 'architecture' 
                  ? 'bg-ink text-white shadow-sm' 
                  : 'text-inkMuted hover:text-ink'
              }`}
            >
              CI/CD Pipeline
            </button>
          </div>
        </div>

        {/* ===================================================================
             TAB PANEL 1: CAPABILITIES (6-Card Architecture Matrix)
             =================================================================== */}
        {activeWorkbenchTab === 'capabilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="arch-card rounded-xl p-5 space-y-3 bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText inline-block">
                UI &amp; E2E Testing
              </span>
              <h3 className="font-display font-bold text-base text-ink">High-Velocity Web Automation</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Deterministic Playwright and Cypress architectures with network mocking, auto-waiting, and 12-way parallel Docker execution.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                Playwright • Cypress • TypeScript • Grid 4
              </div>
            </div>

            <div className="arch-card rounded-xl p-5 space-y-3 bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blueSurface border border-blueBorder text-blueText inline-block">
                API &amp; Microservices
              </span>
              <h3 className="font-display font-bold text-base text-ink">API Contract &amp; Integration Testing</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Schema verification, idempotency checks, and stateful payload fuzzing across REST and GraphQL endpoints before deployment.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                REST Assured • Postman • OpenAPI • JSON Schema
              </div>
            </div>

            <div className="arch-card rounded-xl p-5 space-y-3 bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amberSurface border border-amberBorder text-amberText inline-block">
                DevTestOps Quality Gates
              </span>
              <h3 className="font-display font-bold text-base text-ink">Distributed CI/CD Release Pipelines</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Automated pull-request blockers, containerized test runners, and instant Allure telemetry that prevent regressions from merging.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                GitHub Actions • Docker • Jenkins • GitLab CI
              </div>
            </div>

            <div className="arch-card rounded-xl p-5 space-y-3 bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blueSurface border border-blueBorder text-blueText inline-block">
                AppSec &amp; Security
              </span>
              <h3 className="font-display font-bold text-base text-ink">Automated Security &amp; DAST Audits</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Google Bug Hunters VRP insights applied to automated OWASP ZAP scanning, auth bypass checks, and secret leakage audits.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                OWASP ZAP • Burp Suite • OAuth2/JWT Auditing
              </div>
            </div>

            <div className="arch-card rounded-xl p-5 space-y-3 bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText inline-block">
                Performance SLA
              </span>
              <h3 className="font-display font-bold text-base text-ink">Load, Stress &amp; Spike Engineering</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                High-concurrency JMeter &amp; k6 simulation modeling production traffic to identify latency bottlenecks and database lockups early.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                Apache JMeter • k6 • P95/P99 SLA Profiling
              </div>
            </div>

            <div className="arch-card rounded-xl p-5 space-y-3 bg-surface border border-borderLight hover:border-borderHover shadow-sm transition-all">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amberSurface border border-amberBorder text-amberText inline-block">
                Observability
              </span>
              <h3 className="font-display font-bold text-base text-ink">Flakiness Eradication &amp; Reporting</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Quarantine governance, deterministic mocking, DOM stability waits, and executive Allure dashboards maintaining a &lt; 0.5% flakiness SLA.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                Allure Reports • Trace Viewer • Custom Reporters
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
             TAB PANEL 2: CI/CD PIPELINE ARCHITECTURE
             =================================================================== */}
        {activeWorkbenchTab === 'architecture' && (
          <div className="bg-surface border border-borderLight rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderLight pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">Zero-Defect Continuous Verification Pipeline</h3>
                <p className="text-xs text-inkMuted">Deterministic quality gate architecture enforced on every commit</p>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText">
                MEAN PIPELINE TIME: ~6m
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-canvas border border-borderLight rounded-lg p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-ink">01 • PRE-MERGE</div>
                <div className="font-display font-bold text-sm text-ink">Static &amp; Contract Gate</div>
                <p className="text-xs text-inkMuted">OpenAPI schema lint, TypeScript strict compile, and API contract verification.</p>
                <div className="pt-2 font-mono text-[11px] text-emeraldSolid font-semibold">SLA: &lt; 45s</div>
              </div>

              <div className="bg-canvas border border-borderLight rounded-lg p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-emeraldSolid">02 • SHARDED MATRIX</div>
                <div className="font-display font-bold text-sm text-ink">Parallel E2E &amp; API Suite</div>
                <p className="text-xs text-inkMuted">12 Dockerized Playwright &amp; REST Assured nodes running critical user journeys.</p>
                <div className="pt-2 font-mono text-[11px] text-emeraldSolid font-semibold">SLA: &lt; 3m 30s</div>
              </div>

              <div className="bg-canvas border border-borderLight rounded-lg p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-blueSolid">03 • SEC &amp; PERF</div>
                <div className="font-display font-bold text-sm text-ink">OWASP ZAP &amp; Load Smoke</div>
                <p className="text-xs text-inkMuted">Automated DAST vulnerability baseline scan + P95 response verification.</p>
                <div className="pt-2 font-mono text-[11px] text-blueSolid font-semibold">SLA: &lt; 1m 30s</div>
              </div>

              <div className="bg-canvas border border-borderLight rounded-lg p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-amberSolid">04 • TELEMETRY</div>
                <div className="font-display font-bold text-sm text-ink">Allure Audit &amp; Deploy</div>
                <p className="text-xs text-inkMuted">Full trace artifacts archived; automatic promotion only on 100% green pass.</p>
                <div className="pt-2 font-mono text-[11px] text-amberSolid font-semibold">Escape: &lt; 0.2%</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
