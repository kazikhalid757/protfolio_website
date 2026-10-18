'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  Cpu, 
  Activity, 
  Layers, 
  Check, 
  FileCode,
  Search,
  ExternalLink,
  ShieldCheck,
  GitBranch,
  ArrowRight,
  Sparkles,
  Copy
} from 'lucide-react';

interface InteractiveConsoleProps {
  testSuites?: any[];
}

export default function InteractiveConsole({ testSuites }: InteractiveConsoleProps) {
  // Tabs: 'studio' | 'capabilities' | 'architecture'
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<'studio' | 'capabilities' | 'architecture'>('studio');

  // QA Studio Data Suites
  const studioSuites: Record<string, any> = {
    playwright: {
      title: 'Playwright Distributed E2E Regression Suite',
      subtitle: 'Chromium + WebKit + Firefox • 12 Parallel Docker Shards • Zero-Flake Retry Gate',
      duration: '4.18s',
      assertions: '142 / 142',
      gate: 'APPROVED',
      specs: [
        { id: 'PW-101', name: 'auth.session.spec.ts — OAuth2 PKCE + Multi-Factor Session Persistence', time: '640ms', status: 'PASS' },
        { id: 'PW-102', name: 'checkout.idempotency.spec.ts — Zero Duplicate Charge Under Double-Click', time: '810ms', status: 'PASS' },
        { id: 'PW-103', name: 'rbac.permissions.spec.ts — Tenant Isolation & Admin Route Guarding', time: '590ms', status: 'PASS' },
        { id: 'PW-104', name: 'webhook.reconciliation.spec.ts — Async Stripe Event State Sync', time: '720ms', status: 'PASS' },
        { id: 'PW-105', name: 'dom.accessibility.spec.ts — WCAG 2.1 AA Critical Flow Verification', time: '680ms', status: 'PASS' },
        { id: 'PW-106', name: 'visual.layout.spec.ts — Responsive Breakpoint & Zero-CLS Gate', time: '740ms', status: 'PASS' }
      ],
      logs: [
        '[09:00:01] INIT // Spawning 12 hermetic Docker worker containers...',
        '[09:00:01] CONF // Flakiness SLA threshold locked at < 0.5%',
        '[09:00:02] RUN  // Executing 6 E2E spec files across Chromium, Firefox, WebKit',
        '[09:00:03] PASS // PW-101, PW-102, PW-103 verified with 0 retries',
        '[09:00:04] PASS // PW-104, PW-105, PW-106 verified with 0 retries',
        '[09:00:04] GATE // 142/142 assertions green. Allure trace bundle archived.',
        '[09:00:04] DONE // CI Quality Gate APPROVED for production deployment.'
      ]
    },
    restassured: {
      title: 'REST Assured Microservice & Contract Suite',
      subtitle: 'OpenAPI 3.1 Schema Validation • Stateful Token Fuzzing • SLA Latency Checks',
      duration: '2.94s',
      assertions: '218 / 218',
      gate: 'APPROVED',
      specs: [
        { id: 'API-201', name: 'POST /v2/ledger/transfer — Idempotency-Key & Decimal Precision Contract', time: '410ms', status: 'PASS' },
        { id: 'API-202', name: 'GET /v2/accounts/{id} — BOLA / Cross-Tenant Authorization Boundary', time: '380ms', status: 'PASS' },
        { id: 'API-203', name: 'PUT /v2/webhooks/config — JSON Schema Strict Validation & Rate Limit', time: '490ms', status: 'PASS' },
        { id: 'API-204', name: 'POST /v2/auth/refresh — Rotated JWT Revocation & Replay Protection', time: '520ms', status: 'PASS' },
        { id: 'API-205', name: 'GraphQL /query — Depth-Limiting & N+1 Query SLA (< 120ms P95)', time: '610ms', status: 'PASS' },
        { id: 'API-206', name: 'DELETE /v2/sessions — Audit Log Immutability Verification', time: '530ms', status: 'PASS' }
      ],
      logs: [
        '[09:01:10] INIT // Loading OpenAPI 3.1 specification & RestAssured context...',
        '[09:01:11] RUN  // Verifying 95 endpoint contracts and payload schemas',
        '[09:01:12] PASS // BOLA & tenant isolation checks passed (0 leaks)',
        '[09:01:12] PERF // P95 API response measured at 68ms (SLA < 150ms)',
        '[09:01:13] GATE // 218/218 contract assertions verified. Zero schema drift.'
      ]
    },
    owasp: {
      title: 'OWASP ZAP Automated DAST & Security Gate',
      subtitle: 'Google VRP-Inspired Security Verification • Active API & Header Audit',
      duration: '5.40s',
      assertions: '86 / 86',
      gate: 'SECURE',
      specs: [
        { id: 'SEC-301', name: 'SQLi & NoSQL Injection Active Fuzzing Across Query Parameters', time: '920ms', status: 'PASS' },
        { id: 'SEC-302', name: 'Cross-Site Scripting (DOM & Reflected XSS) Payload Sanitization', time: '880ms', status: 'PASS' },
        { id: 'SEC-303', name: 'Strict CSP, HSTS, X-Frame-Options & SameSite Cookie Enforcement', time: '640ms', status: 'PASS' },
        { id: 'SEC-304', name: 'SSRF & Unvalidated Redirect Parameter Boundary Verification', time: '950ms', status: 'PASS' },
        { id: 'SEC-305', name: 'Broken Function Level Authorization (BFLA) Role Matrix', time: '1020ms', status: 'PASS' },
        { id: 'SEC-306', name: 'Sensitive Token Entropy & Secret Leakage Scan in API Responses', time: '990ms', status: 'PASS' }
      ],
      logs: [
        '[09:02:00] INIT // Starting OWASP ZAP headless daemon & API spider...',
        '[09:02:02] SCAN // Injecting fuzz vectors across authenticated endpoints',
        '[09:02:04] PASS // 0 High, 0 Medium, 0 Low vulnerabilities detected',
        '[09:02:05] GATE // Security baseline signed off by Kazi.SDET rule engine.'
      ]
    }
  };

  const [currentSuiteKey, setCurrentSuiteKey] = useState<string>('playwright');
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [progress, setProgress] = useState(100);
  const [activeSpecs, setActiveSpecs] = useState<any[]>(studioSuites.playwright.specs);
  const [activeLogs, setActiveLogs] = useState<string[]>(studioSuites.playwright.logs);
  const [statusBadgeText, setStatusBadgeText] = useState('PASSED // 100%');
  const [statusBadgeClass, setStatusBadgeClass] = useState('bg-emeraldSurface border-emeraldBorder text-emeraldText');
  const [copyFeedback, setCopyFeedback] = useState('Copy Audit Report');

  const currentSuite = studioSuites[currentSuiteKey] || studioSuites.playwright;
  const consoleRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectSuite = (key: string) => {
    if (isRunningSuite) return;
    setCurrentSuiteKey(key);
    const suite = studioSuites[key];
    setActiveSpecs(suite.specs);
    setActiveLogs(suite.logs);
    setProgress(100);
    setStatusBadgeText('PASSED // 100%');
    setStatusBadgeClass('bg-emeraldSurface border-emeraldBorder text-emeraldText');
  };

  const runSelectedSuite = () => {
    if (isRunningSuite) return;
    setIsRunningSuite(true);
    const suite = studioSuites[currentSuiteKey];

    setStatusBadgeText('EXECUTING // CI GATE');
    setStatusBadgeClass('bg-amberSurface border-amberBorder text-amberText');
    setProgress(0);
    setActiveSpecs([]);
    setActiveLogs([]);

    let step = 0;
    const total = suite.specs.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (step < total) {
        const nextSpec = suite.specs[step];
        setActiveSpecs((prev) => [...prev, nextSpec]);
        const pct = Math.round(((step + 1) / total) * 100);
        setProgress(pct);

        if (suite.logs[step]) {
          setActiveLogs((prev) => [...prev, suite.logs[step]]);
        }

        if (consoleRef.current) {
          consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
        step++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (suite.logs[total]) {
          setActiveLogs((prev) => [...prev, suite.logs[total]]);
        }
        setStatusBadgeText('PASSED // 100%');
        setStatusBadgeClass('bg-emeraldSurface border-emeraldBorder text-emeraldText');
        setIsRunningSuite(false);
      }
    }, 280);
  };

  const copyReportSummary = () => {
    const summary = `KAZI.SDET // ${currentSuite.title}\nStatus: PASSED (99.8% SLA) | Assertions: ${currentSuite.assertions} | Duration: ${currentSuite.duration}`;
    navigator.clipboard.writeText(summary);
    setCopyFeedback('✓ Copied Audit Summary');
    setTimeout(() => setCopyFeedback('Copy Audit Report'), 1800);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section id="qa-studio" className="scroll-mt-24 space-y-6 pt-4 pb-12">
      {/* Anchor aliases for #qa-runner, #capabilities, #architecture */}
      <span id="qa-runner" className="sr-only">QA Studio</span>
      <span id="capabilities" className="sr-only">Capabilities</span>
      <span id="architecture" className="sr-only">Architecture</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header + Interactive Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-borderLight pb-5">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emeraldSolid uppercase tracking-wider">
              <span>02 — 04 // ENGINEERING WORKBENCH</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight mt-1">
              Interactive QA Command Studio &amp; Test Architecture
            </h2>
          </div>

          {/* Solid Architectural Tabs */}
          <div className="inline-flex bg-nested border border-borderLight rounded-md p-1 self-start">
            <button
              type="button"
              onClick={() => setActiveWorkbenchTab('studio')}
              className={`px-3.5 py-2 rounded text-xs font-mono font-bold micro-transition cursor-pointer ${
                activeWorkbenchTab === 'studio' 
                  ? 'bg-ink text-white' 
                  : 'text-inkMuted hover:text-ink'
              }`}
            >
              03 // Live QA Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkbenchTab('capabilities')}
              className={`px-3.5 py-2 rounded text-xs font-mono font-bold micro-transition cursor-pointer ${
                activeWorkbenchTab === 'capabilities' 
                  ? 'bg-ink text-white' 
                  : 'text-inkMuted hover:text-ink'
              }`}
            >
              02 // Capabilities
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkbenchTab('architecture')}
              className={`px-3.5 py-2 rounded text-xs font-mono font-bold micro-transition cursor-pointer ${
                activeWorkbenchTab === 'architecture' 
                  ? 'bg-ink text-white' 
                  : 'text-inkMuted hover:text-ink'
              }`}
            >
              04 // CI/CD Architecture
            </button>
          </div>
        </div>

        {/* ===================================================================
             TAB PANEL 1: 03 // LIVE QA COMMAND STUDIO
             =================================================================== */}
        {activeWorkbenchTab === 'studio' && (
          <div className="bg-surface border border-borderLight rounded-lg overflow-hidden">
            {/* Studio Top Control Bar */}
            <div className="bg-nested border-b border-borderLight px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-ink text-white font-mono text-xs font-bold">&gt;_ QA STUDIO v4.2</span>
                <span className="font-mono text-xs text-inkMuted">TARGET: <strong className="text-ink">prod-release-candidate-842</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Suite Selector Pills */}
                <button
                  type="button"
                  onClick={() => selectSuite('playwright')}
                  className={`px-3 py-1.5 rounded font-mono text-xs font-semibold cursor-pointer micro-transition ${
                    currentSuiteKey === 'playwright'
                      ? 'bg-ink text-white border border-ink'
                      : 'bg-surface text-ink border border-borderLight hover:border-ink'
                  }`}
                >
                  Playwright E2E (12 Shards)
                </button>

                <button
                  type="button"
                  onClick={() => selectSuite('restassured')}
                  className={`px-3 py-1.5 rounded font-mono text-xs font-semibold cursor-pointer micro-transition ${
                    currentSuiteKey === 'restassured'
                      ? 'bg-ink text-white border border-ink'
                      : 'bg-surface text-ink border border-borderLight hover:border-ink'
                  }`}
                >
                  REST Assured API
                </button>

                <button
                  type="button"
                  onClick={() => selectSuite('owasp')}
                  className={`px-3 py-1.5 rounded font-mono text-xs font-semibold cursor-pointer micro-transition ${
                    currentSuiteKey === 'owasp'
                      ? 'bg-ink text-white border border-ink'
                      : 'bg-surface text-ink border border-borderLight hover:border-ink'
                  }`}
                >
                  OWASP ZAP Security
                </button>

                <button
                  type="button"
                  onClick={runSelectedSuite}
                  disabled={isRunningSuite}
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-emeraldSolid hover:bg-[#047857] text-white font-mono text-xs font-bold cursor-pointer micro-transition disabled:opacity-50"
                >
                  <span>{isRunningSuite ? '⏳ RUNNING SHARDS...' : '▶ EXECUTE PIPELINE'}</span>
                </button>
              </div>
            </div>

            {/* Studio Split Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-borderLight">
              {/* Left 7 Cols: Live Test Specification & Execution Steps */}
              <div className="lg:col-span-7 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">
                      {currentSuite.title}
                    </h3>
                    <p className="font-mono text-xs text-inkSubtle mt-0.5">
                      {currentSuite.subtitle}
                    </p>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${statusBadgeClass}`}>
                    {statusBadgeText}
                  </span>
                </div>

                {/* Overall Progress Bar (Solid) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-inkMuted">EXECUTION PROGRESS</span>
                    <span className="font-bold text-ink">
                      {activeSpecs.length} / {currentSuite.specs.length} Specs Verified ({currentSuite.duration})
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-nested border border-borderLight overflow-hidden">
                    <div 
                      className="h-full bg-emeraldSolid micro-transition" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Structured Test Case Rows */}
                <div className="space-y-2 pt-1">
                  {activeSpecs.map((s: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-canvas border border-borderLight flex items-center justify-between gap-3 font-mono text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-1.5 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText text-[10px] font-bold shrink-0">
                          {s.status}
                        </span>
                        <span className="text-ink font-semibold shrink-0">{s.id}</span>
                        <span className="text-inkMuted truncate font-sans text-xs">{s.name}</span>
                      </div>
                      <span className="text-inkSubtle text-[11px] shrink-0">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Real-time Telemetry & Assertion Log */}
              <div className="lg:col-span-5 bg-canvas p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-borderLight pb-2.5">
                    <span className="font-mono text-xs font-bold text-ink uppercase">PIPELINE TELEMETRY LOG</span>
                    <button
                      type="button"
                      onClick={copyReportSummary}
                      className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded bg-surface border border-borderLight hover:border-ink text-ink cursor-pointer micro-transition"
                    >
                      {copyFeedback}
                    </button>
                  </div>

                  {/* Solid Console Output Box */}
                  <div 
                    ref={consoleRef}
                    className="bg-surface border border-borderLight rounded p-3.5 font-mono text-xs space-y-1.5 h-60 overflow-y-auto text-ink"
                  >
                    {activeLogs.map((line, i) => {
                      const isHighlighted = line.includes('PASS') || line.includes('DONE') || line.includes('GATE');
                      return (
                        <div 
                          key={i} 
                          className={`leading-relaxed ${isHighlighted ? 'text-emeraldSolid font-semibold' : 'text-inkMuted'}`}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Gate Box */}
                <div className="bg-surface border border-borderLight rounded p-3.5 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-nested p-2 rounded">
                    <div className="font-mono text-[10px] text-inkSubtle">DURATION</div>
                    <div className="font-mono text-sm font-bold text-ink mt-0.5">{currentSuite.duration}</div>
                  </div>
                  <div className="bg-emeraldSurface border border-emeraldBorder p-2 rounded">
                    <div className="font-mono text-[10px] text-emeraldText">ASSERTIONS</div>
                    <div className="font-mono text-sm font-bold text-emeraldSolid mt-0.5">{currentSuite.assertions}</div>
                  </div>
                  <div className="bg-blueSurface border border-blueBorder p-2 rounded">
                    <div className="font-mono text-[10px] text-blueText">RELEASE GATE</div>
                    <div className="font-mono text-sm font-bold text-blueSolid mt-0.5">{currentSuite.gate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
             TAB PANEL 2: 02 // CAPABILITIES (6-Card Architectural Matrix)
             =================================================================== */}
        {activeWorkbenchTab === 'capabilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="arch-card rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText">CAP-01</span>
                <span className="font-mono text-xs text-inkSubtle">UI &amp; E2E</span>
              </div>
              <h3 className="font-display font-bold text-base text-ink">High-Velocity Web Automation</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Deterministic Playwright and Cypress architectures using Page Object &amp; Screenplay patterns, network state injection, and parallel shard execution.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                Playwright • Cypress • TypeScript • Grid 4
              </div>
            </div>

            <div className="arch-card rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blueSurface border border-blueBorder text-blueText">CAP-02</span>
                <span className="font-mono text-xs text-inkSubtle">API &amp; MICROSERVICES</span>
              </div>
              <h3 className="font-display font-bold text-base text-ink">API Contract &amp; Integration Testing</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Deep schema validation, idempotency verification, and stateful payload fuzzing across REST and GraphQL endpoints before UI deployment.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                REST Assured • Postman • OpenAPI • JSON Schema
              </div>
            </div>

            <div className="arch-card rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amberSurface border border-amberBorder text-amberText">CAP-03</span>
                <span className="font-mono text-xs text-inkSubtle">DEVOPS QUALITY GATES</span>
              </div>
              <h3 className="font-display font-bold text-base text-ink">Distributed CI/CD Release Pipelines</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Automated pull-request blockers, containerized Docker test runners, and instant Allure/Slack telemetry that stop regressions from merging.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                GitHub Actions • Docker • Jenkins • GitLab CI
              </div>
            </div>

            <div className="arch-card rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blueSurface border border-blueBorder text-blueText">CAP-04</span>
                <span className="font-mono text-xs text-inkSubtle">APPSEC &amp; VRP</span>
              </div>
              <h3 className="font-display font-bold text-base text-ink">Automated Security &amp; DAST Audits</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                Backed by Google Bug Hunters VRP experience—embedding OWASP ZAP scans, auth-bypass checks, and injection guards directly into CI workflows.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                OWASP ZAP • Burp Suite • OAuth2/JWT Auditing
              </div>
            </div>

            <div className="arch-card rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText">CAP-05</span>
                <span className="font-mono text-xs text-inkSubtle">PERFORMANCE SLA</span>
              </div>
              <h3 className="font-display font-bold text-base text-ink">Load, Stress &amp; Spike Engineering</h3>
              <p className="text-xs text-inkMuted leading-relaxed">
                High-concurrency JMeter &amp; k6 simulation modeling real production traffic spikes to pinpoint latency bottlenecks and database locks early.
              </p>
              <div className="pt-2 border-t border-borderLight font-mono text-[11px] text-ink font-semibold">
                Apache JMeter • k6 • P95/P99 SLA Profiling
              </div>
            </div>

            <div className="arch-card rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amberSurface border border-amberBorder text-amberText">CAP-06</span>
                <span className="font-mono text-xs text-inkSubtle">OBSERVABILITY</span>
              </div>
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
             TAB PANEL 3: 04 // CI/CD ARCHITECTURE BLUEPRINT
             =================================================================== */}
        {activeWorkbenchTab === 'architecture' && (
          <div className="bg-surface border border-borderLight rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderLight pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">Zero-Defect Continuous Verification Pipeline</h3>
                <p className="text-xs text-inkMuted">4-Stage deterministic quality gate architecture enforced on every commit</p>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText">
                MEAN EXECUTION TIME: 6m 12s
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-canvas border border-borderLight rounded-md p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-ink">STAGE 01 // PRE-MERGE</div>
                <div className="font-display font-bold text-sm text-ink">Static &amp; Contract Gate</div>
                <p className="text-xs text-inkMuted">OpenAPI schema lint, TypeScript strict compile, unit &amp; API contract verification.</p>
                <div className="pt-2 font-mono text-[11px] text-emeraldSolid font-semibold">Gate SLA: &lt; 45s</div>
              </div>

              <div className="bg-canvas border border-borderLight rounded-md p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-emeraldSolid">STAGE 02 // MATRIX EXECUTION</div>
                <div className="font-display font-bold text-sm text-ink">Sharded E2E &amp; API Suite</div>
                <p className="text-xs text-inkMuted">12 Dockerized Playwright &amp; REST Assured nodes running critical user journeys in parallel.</p>
                <div className="pt-2 font-mono text-[11px] text-emeraldSolid font-semibold">Gate SLA: &lt; 3m 30s</div>
              </div>

              <div className="bg-canvas border border-borderLight rounded-md p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-blueSolid">STAGE 03 // SEC &amp; PERF</div>
                <div className="font-display font-bold text-sm text-ink">OWASP ZAP &amp; JMeter Smoke</div>
                <p className="text-xs text-inkMuted">Automated DAST vulnerability baseline scan + P95 API response time verification.</p>
                <div className="pt-2 font-mono text-[11px] text-blueSolid font-semibold">Gate SLA: &lt; 1m 30s</div>
              </div>

              <div className="bg-canvas border border-borderLight rounded-md p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-amberSolid">STAGE 04 // TELEMETRY</div>
                <div className="font-display font-bold text-sm text-ink">Allure Audit &amp; Prod Promote</div>
                <p className="text-xs text-inkMuted">Full trace artifacts archived; automatic deployment approval only on 100% gate pass.</p>
                <div className="pt-2 font-mono text-[11px] text-amberSolid font-semibold">Escape Ratio: &lt; 0.2%</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
