'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  ExternalLink, 
  Github, 
  Layers, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  GitFork,
  Shield,
  FileCode,
  Sparkles
} from 'lucide-react';

interface FlagshipProjectsProps {
  projects?: any[];
  onOpenReportModal?: (project: any) => void;
}

export default function FlagshipProjects({ projects, onOpenReportModal }: FlagshipProjectsProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('flagship-1');

  const projectList = projects && projects.length > 0 ? projects : [];

  return (
    <section id="flagship" className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Production Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Flagship Test Engineering Engines
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 md:mt-0 max-w-md">
            Distributed test execution systems, contract verification, and CI/CD quality gates engineered for deterministic releases.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectList.map((project) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <div
                key={project.id}
                className="bg-zinc-900 border border-zinc-800 rounded p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  {/* Top Badge and Title */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                      {project.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">ID: {project.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100 mb-2">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                    {project.subtitle}
                  </p>

                  {/* Hard Metrics Bar */}
                  {project.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-zinc-950 border border-zinc-850 rounded mb-4 font-mono text-xs">
                      {Object.entries(project.metrics).map(([key, val]) => (
                        <div key={key}>
                          <div className="text-[10px] text-zinc-500 uppercase">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="font-semibold text-zinc-200 truncate">{String(val)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Architecture Flow Diagram (ASCII Schematic) */}
                  {project.schematic && (
                    <div className="mb-4">
                      <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Cpu size={12} className="text-emerald-400" />
                        <span>Execution Pipeline Schematic:</span>
                      </div>
                      <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-[11px] text-emerald-400/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {project.schematic}
                      </div>
                    </div>
                  )}

                  {/* Key Engineering Challenges Overcome */}
                  {project.challenges && (
                    <div className="mb-4">
                      <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Key Engineering Challenges Overcome:
                      </div>
                      <ul className="space-y-1.5">
                        {project.challenges.map((c: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-normal">
                            <span className="text-emerald-400 font-mono mt-0.5">›</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CI/CD Integration Specs */}
                  {project.ciIntegration && (
                    <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded mb-4">
                      <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1">
                        <GitFork size={11} className="text-emerald-400" />
                        <span>CI/CD Quality Gate Specification:</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-normal font-mono">
                        {project.ciIntegration}
                      </p>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.techStack?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Hub */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                      >
                        <Github size={13} />
                        <span>View Repository</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenReportModal && onOpenReportModal(project)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Inspect HTML Report</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
