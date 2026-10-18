'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  GitBranch, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  Lock,
  Github,
  Linkedin
} from 'lucide-react';

interface HeaderHeroProps {
  profile: any;
  onOpenReportModal?: () => void;
}

export default function HeaderHero({ profile, onOpenReportModal }: HeaderHeroProps) {
  const p = profile || {};
  const telemetry = p.telemetry || {
    totalRuns: '28,450+',
    parallelSpeedup: '5.2x Faster',
    flakinessRate: '< 0.28%',
    coverageRatio: '96.4%'
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Minimal Navigation Bar */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-zinc-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              QA
            </div>
            <div>
              <span className="font-mono text-sm font-semibold text-zinc-100 tracking-tight">KAZI KHALID HASAN TAMIM</span>
              <span className="hidden sm:inline-block text-xs font-mono text-zinc-500 ml-2">/ ARCHITECTURE & SDET</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-5 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <a href="#flagship" className="hover:text-emerald-400 transition-colors">Flagship Engines</a>
              <a href="#philosophy" className="hover:text-emerald-400 transition-colors">Engineering Standards</a>
              <a href="#inspector" className="hover:text-emerald-400 transition-colors">Live Allure Report</a>
              <a href="#skills" className="hover:text-emerald-400 transition-colors">Skills</a>
              <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
            </nav>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
              title="Open Admin CMS"
            >
              <Lock size={12} className="text-emerald-400" />
              <span>CMS</span>
            </Link>
          </div>
        </div>

        {/* Hero Content Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald"></span>
              <span className="text-zinc-300">LIVE PIPELINE TELEMETRY:</span>
              <span className="text-emerald-400 font-semibold">ALL GATES OPERATIONAL (0 DEFECT ESCAPES)</span>
            </div>

            {/* Direct Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
                {p.title || 'Senior Software Development Engineer in Test (SDET) | Quality Systems Architect'}
              </h1>
            </div>

            {/* Value Prop */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
              {p.tagline || 'Engineering deterministic test frameworks, self-healing pipelines, and resilient CI/CD test gates.'}
            </p>

            {/* Action Hub Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#flagship"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-colors shadow-sm"
              >
                <Terminal size={16} />
                <span>Explore Flagship Engines</span>
              </a>

              <a
                href="#inspector"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-sm font-mono transition-colors"
              >
                <Activity size={16} className="text-emerald-400" />
                <span>Inspect Live Allure Report</span>
              </a>

              {p.resumeUrl && (
                <a
                  href={p.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-sm font-mono transition-colors"
                >
                  <Download size={15} />
                  <span>CV / Resume</span>
                </a>
              )}

              {p.socials?.github && (
                <a
                  href={p.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github size={18} />
                </a>
              )}

              {p.socials?.linkedin && (
                <a
                  href={p.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Right Status Card: Security & Google Bug Bounty Recognition */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Security Telemetry</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <ShieldCheck size={12} />
                VERIFIED VRP
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-zinc-400">RESEARCHER PROFILE</div>
              <div className="text-sm font-semibold text-zinc-200">Google Bug Hunters Recognition</div>
              <p className="text-xs text-zinc-400 leading-normal">
                Awarded Year of the Snake & First Report Submitted badges by Google Security for verified vulnerability disclosures.
              </p>
            </div>

            {p.socials?.bughunters && (
              <a
                href={p.socials.bughunters}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Inspect Google Security Profile</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Live Status Strip: 4 High-Density Telemetry Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>TOTAL CI RUNS</span>
              <Activity size={14} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">{telemetry.totalRuns}</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">Continuous GitHub Actions jobs</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>PARALLEL SPEEDUP</span>
              <Cpu size={14} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{telemetry.parallelSpeedup}</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">8x sharded container matrix</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>FLAKINESS RATIO</span>
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">{telemetry.flakinessRate}</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">Deterministic auto-wait assertions</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>CRITICAL COVERAGE</span>
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">{telemetry.coverageRatio}</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">Core user journeys & API contracts</div>
          </div>
        </div>
      </div>
    </header>
  );
}
