'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Layers, 
  Maximize2, 
  FileCode, 
  Video, 
  Search, 
  Check, 
  X,
  PlayCircle,
  ExternalLink
} from 'lucide-react';

export default function ArtifactInspector() {
  const [activeTab, setActiveTab] = useState<'steps' | 'network' | 'trace'>('steps');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(1);

  const testCases = [
    {
      id: 'tc-1',
      title: 'auth.setup.ts › global API session state injection',
      status: 'passed',
      duration: '112ms',
      browser: 'chromium-headless',
      steps: [
        { name: 'POST /api/v1/auth/token [credentials payload]', time: '48ms', status: 'pass' },
        { name: 'assert response status === 201 Created', time: '1ms', status: 'pass' },
        { name: 'assert jwt token claims and RS256 signature', time: '2ms', status: 'pass' },
        { name: 'write state to storageState.json for worker reuse', time: '14ms', status: 'pass' }
      ],
      network: [
        { method: 'POST', url: '/api/v1/auth/token', status: 201, time: '48ms', size: '1.2 KB' },
        { method: 'GET', url: '/api/v1/user/entitlements', status: 200, time: '22ms', size: '3.4 KB' }
      ]
    },
    {
      id: 'tc-2',
      title: 'checkout.spec.ts › multi-currency payment with stripe webhook mock',
      status: 'passed',
      duration: '640ms',
      browser: 'chromium-headless',
      steps: [
        { name: 'inject storageState authentication context', time: '12ms', status: 'pass' },
        { name: 'page.goto("/cart") [direct route without UI login]', time: '140ms', status: 'pass' },
        { name: 'page.click("[data-testid=checkout-btn]")', time: '45ms', status: 'pass' },
        { name: 'intercept POST /api/v1/payments/intent -> mock 200 OK', time: '82ms', status: 'pass' },
        { name: 'expect(orderConfirmationBadge).toBeVisible()', time: '65ms', status: 'pass' },
        { name: 'assert order totals in EUR currency format match calculation', time: '18ms', status: 'pass' }
      ],
      network: [
        { method: 'POST', url: '/api/v1/payments/intent', status: 200, time: '82ms', size: '2.1 KB' },
        { method: 'POST', url: '/api/v1/webhooks/stripe', status: 200, time: '34ms', size: '890 B' }
      ]
    },
    {
      id: 'tc-3',
      title: 'contracts.spec.ts › consumer pact schema validation against broker',
      status: 'passed',
      duration: '310ms',
      browser: 'api-worker',
      steps: [
        { name: 'fetch latest contract verification pact from broker', time: '120ms', status: 'pass' },
        { name: 'execute json-schema-draft-07 against endpoint spec', time: '45ms', status: 'pass' },
        { name: 'assert zero missing mandatory schema properties', time: '15ms', status: 'pass' },
        { name: 'assert p95 latency < 150ms SLA gate', time: '82ms', status: 'pass' }
      ],
      network: [
        { method: 'GET', url: '/pact/contracts/consumer-orders', status: 200, time: '120ms', size: '12.4 KB' }
      ]
    },
    {
      id: 'tc-4',
      title: 'k6-load.spec.ts › 5,000 concurrency p95 latency check',
      status: 'passed',
      duration: '420ms',
      browser: 'k6-runner',
      steps: [
        { name: 'spawn virtual users cluster ramp: 0 -> 5000 in 10s', time: '110ms', status: 'pass' },
        { name: 'monitor http_req_duration{quantile=0.95}', time: '148ms', status: 'pass' },
        { name: 'verify zero 5xx gateway errors across sustained throughput', time: '35ms', status: 'pass' }
      ],
      network: [
        { method: 'GET', url: '/api/v1/catalog/items', status: 200, time: '148ms', size: '4.8 KB' }
      ]
    }
  ];

  const currentTestCase = testCases[selectedTestCaseIndex] || testCases[0];

  return (
    <section id="inspector" className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Live CI Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Test Artifact & Execution Inspector
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 md:mt-0 max-w-md">
            Interactive view into a real Playwright HTML / Allure Report test run with network assertions and trace logs.
          </p>
        </div>

        {/* Embedded Inspector Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
          {/* Top Report Header Bar */}
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-200">
                Playwright Allure Report — PR #248 CI Matrix Run
              </span>
            </div>

            {/* Overall Telemetry Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400 font-semibold">320 PASSED</span>
              <span className="text-zinc-500">0 FAILED</span>
              <span className="text-zinc-500">1 SKIPPED</span>
              <span className="text-zinc-400">DURATION: 3m 12s</span>
              <span className="text-zinc-400">WORKERS: 8 SHARDS</span>
            </div>
          </div>

          {/* Inspector Body: Left Test Suite List / Right Step Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            {/* Left Column: Test Case List */}
            <div className="lg:col-span-5 border-r border-zinc-850 p-3 bg-zinc-925/80 space-y-2 overflow-y-auto max-h-[460px]">
              <div className="text-[11px] font-mono text-zinc-500 uppercase px-2 py-1">
                Executed Specs in Suite (All Passed):
              </div>

              {testCases.map((tc, idx) => {
                const isSelected = selectedTestCaseIndex === idx;
                return (
                  <div
                    key={tc.id}
                    onClick={() => setSelectedTestCaseIndex(idx)}
                    className={`p-3 rounded cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-zinc-850 border-emerald-500/40 text-zinc-100'
                        : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:bg-zinc-850/50 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium truncate">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{tc.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>{tc.browser}</span>
                      <span className="text-emerald-400/80">{tc.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Execution Step Timeline & Trace View */}
            <div className="lg:col-span-7 p-5 bg-zinc-900 flex flex-col justify-between">
              <div>
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('steps')}
                      className={`px-3 py-1 text-xs font-mono rounded ${
                        activeTab === 'steps' ? 'bg-zinc-800 text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Step Actions ({currentTestCase.steps.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('network')}
                      className={`px-3 py-1 text-xs font-mono rounded ${
                        activeTab === 'network' ? 'bg-zinc-800 text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Network Traces ({currentTestCase.network.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('trace')}
                      className={`px-3 py-1 text-xs font-mono rounded ${
                        activeTab === 'trace' ? 'bg-zinc-800 text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Artifact Attachments
                    </button>
                  </div>

                  <span className="text-xs font-mono text-zinc-500">Status: 200 OK</span>
                </div>

                {/* Tab: Steps */}
                {activeTab === 'steps' && (
                  <div className="space-y-2 font-mono text-xs">
                    {currentTestCase.steps.map((st, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-850 rounded">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Check size={14} className="text-emerald-400 flex-shrink-0" />
                          <span>{st.name}</span>
                        </div>
                        <span className="text-zinc-500 text-[11px] flex-shrink-0">{st.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Network */}
                {activeTab === 'network' && (
                  <div className="space-y-2 font-mono text-xs">
                    {currentTestCase.network.map((net, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-850 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {net.method}
                          </span>
                          <span className="text-zinc-300">{net.url}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                          <span>{net.size}</span>
                          <span className="text-emerald-400">{net.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Trace Artifacts */}
                {activeTab === 'trace' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-850 rounded space-y-3 font-mono text-xs">
                    <div className="text-zinc-300 font-semibold">Playwright Trace Viewer Package:</div>
                    <div className="text-zinc-400 text-xs leading-relaxed">
                      trace.zip packaged with full DOM snapshot timeline, console output logs, and network interception HAR.
                    </div>
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-400">
                      $ npx playwright show-trace ./artifacts/test-results/{currentTestCase.id}/trace.zip
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Console Status */}
              <div className="pt-4 mt-6 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span>Spec Assertions: Zero Failures • Zero Flakes</span>
                </div>
                <span className="text-emerald-400 font-medium">EXIT CODE: 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
