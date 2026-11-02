import React from 'react';
import SectionHead from './SectionHead';
import type { SkillCategory } from '@/lib/schemas';

interface SkillsSectionProps {
  skills?: SkillCategory[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groups = skills || [];
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="scroll-mt-20 bg-char text-paper">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="mb-8 md:mb-12 lg:mb-16 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/60 mb-5">
            <span className="text-signal">04</span>
            <span className="mx-3 inline-block w-8 h-px bg-paper/30 align-middle" />
            Toolbox
          </p>
          <h2 className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-paper">
            What I reach for <span className="italic text-signal">first</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-paper/20 border border-paper/20">
          {groups.map((g, gi: number) => {
            const wide = groups.length % 2 === 1 && gi === groups.length - 1;
            return (
            <div key={g.category} className={`bg-char p-7 md:p-9 ${wide ? 'md:col-span-2' : ''}`}>
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-signal mb-6">{g.category}</h3>
              <ul className={wide ? 'grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3' : 'space-y-3'}>
                {(g.items || []).map((it) => (
                  <li key={it.name} className="flex items-baseline justify-between gap-4 border-b border-paper/10 pb-3">
                    <span className="text-lg text-paper">{it.name}</span>
                    {it.experience && <span className="font-mono text-xs text-paper/60 shrink-0">{it.experience}</span>}
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
