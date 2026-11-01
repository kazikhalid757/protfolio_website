import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import { safeUrl } from '@/lib/safeUrl';
import type { Project } from '@/lib/schemas';

interface ProjectsSectionProps {
  projects?: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const items = projects || [];
  if (items.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <SectionHead
          index="05"
          eyebrow="Open source"
          title={
            <>
              Automation <span className="italic">frameworks</span> on GitHub.
            </>
          }
          intro="Practice grounds where I try tools before they go near a client's pipeline. Every repo is public."
        />

        <ul className="border-t border-char">
          {items.map((p, i: number) => {
            const href = safeUrl(p.github) || safeUrl(p.liveDemo);
            const Row: React.ElementType = href ? 'a' : 'div';
            return (
              <li key={p.id || i} className="border-b border-rule">
                <Row
                  {...(href ? { href, target: '_blank', rel: 'noopener noreferrer', 'data-track': 'project_open', 'data-track-label': p.title } : {})}
                  className="group grid grid-cols-12 gap-x-4 gap-y-2 py-7 hover:bg-paperDeep transition-colors"
                >
                  <span className="col-span-2 md:col-span-1 font-serif text-3xl text-signal leading-none pl-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="col-span-10 md:col-span-6">
                    <h3 className="text-xl font-semibold tracking-tight text-char">{p.title}</h3>
                    <p className="mt-2 text-mute leading-relaxed">{p.description}</p>
                  </div>
                  <div className="col-span-10 col-start-3 md:col-span-4 md:col-start-8">
                    {p.metrics && <p className="font-mono text-xs text-charSoft">{p.metrics}</p>}
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {(p.tags || []).map((t: string) => (
                        <li key={t} className="px-2 py-0.5 border border-char/30 font-mono text-[11px] text-charSoft">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="hidden md:flex col-span-1 justify-end pr-2 text-char group-hover:text-signal">
                    {href && <ArrowUpRight size={22} />}
                  </span>
                </Row>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
