'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, Check, GitFork } from 'lucide-react';

interface ExperienceProps {
  experiences?: any[];
}

export default function ExperienceSection({ experiences }: ExperienceProps) {
  const expList = experiences && experiences.length > 0 ? experiences : [];

  return (
    <section id="experience" className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Engineering Track Record
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Production Experience & Impact
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 md:mt-0 max-w-md">
            Architecting test frameworks and leading release quality across high-velocity teams in Canada and Bangladesh.
          </p>
        </div>

        <div className="space-y-6">
          {expList.map((exp) => (
            <div
              key={exp.id}
              className="bg-zinc-900 border border-zinc-800 rounded p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-zinc-850 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-100">{exp.role}</h3>
                  <div className="text-sm font-mono text-emerald-400 font-semibold">{exp.company}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">{exp.period}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">{exp.location}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{exp.type}</span>
                </div>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 mb-4">
                {exp.highlights?.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                    <span className="text-emerald-400 font-mono mt-0.5">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack Chips */}
              {exp.techStack && (
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-zinc-850">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 mr-1">TECH:</span>
                  {exp.techStack.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
