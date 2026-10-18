'use client';

import React, { useState } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Activity, 
  Zap, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface PhilosophyMatrixProps {
  philosophyMatrix?: any[];
}

export default function PhilosophyMatrix({ philosophyMatrix }: PhilosophyMatrixProps) {
  const defaultItems = [
    {
      area: 'Authentication & Test State',
      common: 'Navigating to /login, filling in email/password inputs, and clicking submit before every single UI test case.',
      architect: 'Pre-authenticating via direct API call, persisting session state, and bootstrapping cookies/localStorage in 10ms.'
    },
    {
      area: 'Timing & Synchronization',
      common: 'Arbitrary `cy.wait(5000)` or `time.sleep(3)` sleeps, creating flaky timeouts and 40m+ bloated test runs.',
      architect: 'Deterministic auto-waiting, network response interceptors, and web-first assertions tied directly to DOM mutation.'
    },
    {
      area: 'Test Execution Pipeline',
      common: 'Single-node sequential test suite executed locally or taking 1+ hour on a monolithic uncontainerized runner.',
      architect: 'Containerized sharded test runner partitioning specs across N parallel GitHub Actions workers with sub-5m execution.'
    },
    {
      area: 'Failure Diagnostics',
      common: 'Static PNG screenshots dumped into Slack with ambiguous \'element not found\' stack traces.',
      architect: 'Comprehensive Playwright Trace Viewer artifacts containing step-by-step DOM snapshots, console logs, and network HAR.'
    },
    {
      area: 'Quality Culture & Gates',
      common: 'Manual QA regression cycles delayed until days before production, acting as a release bottleneck.',
      architect: 'Automated zero-defect PR gates that block merges on flaky tests or latency regressions, empowering teams to ship continuously.'
    }
  ];

  const items = philosophyMatrix && philosophyMatrix.length > 0 ? philosophyMatrix : defaultItems;
  const [activeFilter, setActiveFilter] = useState<string>('all');

  return (
    <section id="philosophy" className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Engineering Mindset
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Testing Philosophy & Architecture Matrix
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 md:mt-0 max-w-md">
            Direct comparison: Eliminating common anti-patterns in favor of deterministic, production-grade test systems.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="space-y-4">
          {items.map((row, idx) => (
            <div 
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{row.area}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Common QA Practice (Anti-pattern) */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 uppercase tracking-wider mb-1.5">
                    <XCircle size={14} />
                    <span>Common QA Practice</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono">
                    {row.common}
                  </p>
                </div>

                {/* Staff SDET Standard */}
                <div className="p-4 bg-zinc-950 border border-emerald-500/30 rounded bg-emerald-950/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1.5">
                    <CheckCircle2 size={14} />
                    <span>My Engineering Standard</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-mono font-medium">
                    {row.architect}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
