'use client';

import React from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Check, 
  TrendingUp,
  GitCommit
} from 'lucide-react';

interface ExperienceProps {
  experiences?: any[];
}

export default function ExperienceTimeline({ experiences }: ExperienceProps) {
  const expList = experiences || [];

  return (
    <section id="track-record" className="scroll-mt-24 pt-4 pb-12">
      {/* Anchor alias for #experience */}
      <span id="experience" className="sr-only">Track Record</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="bg-surface border border-borderLight rounded-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-emeraldSolid uppercase tracking-wider">
                07 // PROFESSIONAL TRACK RECORD
              </span>
              <h2 className="font-display font-extrabold text-2xl text-ink mt-0.5">
                Career History &amp; Release Engineering Log
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-nested border border-borderLight text-ink self-start sm:self-auto">
              3+ YEARS SDET EXPERIENCE
            </span>
          </div>

          <div className="space-y-4">
            {expList.map((exp, idx) => {
              const roleCode = `ENG-0${idx + 1}`;
              return (
                <div
                  key={exp.id || idx}
                  className="p-5 rounded-md bg-canvas border border-borderLight border-l-4 border-l-ink space-y-3 micro-transition hover:border-borderHover"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-nested border border-borderLight text-ink">
                          {roleCode}
                        </span>
                        <h3 className="font-display font-bold text-base text-ink">
                          {exp.role}
                        </h3>
                      </div>
                      <div className="font-display font-semibold text-sm text-emeraldSolid">
                        {exp.company}
                      </div>
                    </div>

                    <div className="flex sm:flex-col sm:items-end gap-2 text-xs font-mono text-inkSubtle">
                      <span className="px-2 py-0.5 rounded bg-surface border border-borderLight font-semibold text-ink">
                        {exp.type}
                      </span>
                      <span>{exp.period}</span>
                      <span className="hidden sm:inline">{exp.location}</span>
                    </div>
                  </div>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-borderLight">
                      {exp.highlights.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-inkMuted leading-relaxed">
                          <span className="text-emeraldSolid font-bold mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
