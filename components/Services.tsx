import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import { safeUrl } from '@/lib/safeUrl';
import type { Service } from '@/lib/schemas';

interface ServicesProps {
  services?: Service[];
}

export default function Services({ services }: ServicesProps) {
  const items = services || [];
  if (items.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-20 bg-paperDeep border-y border-rule">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16 md:py-20 lg:py-28">
        <SectionHead
          index="03"
          eyebrow="Services"
          title={
            <>
              What you can <span className="italic">hire me</span> for.
            </>
          }
          intro="Open to full-time roles and to contract work. These are the jobs I take on most."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
          {items.map((s, i: number) => (
            <article key={s.id || i} className="group bg-paper p-7 md:p-9 flex flex-col">
              <p className="font-serif text-4xl leading-none text-signal">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-char">{s.title}</h3>
              {s.summary && <p className="mt-3 leading-relaxed text-mute">{s.summary}</p>}

              {s.deliverables?.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {s.deliverables.map((d: string) => (
                    <li key={d} className="flex gap-3 text-sm leading-relaxed text-charSoft">
                      <span className="mt-2 w-1.5 h-1.5 shrink-0 bg-signal" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {safeUrl(s.hireUrl) && (
                <a
                  href={safeUrl(s.hireUrl)}
                  data-track="hire_service"
                  data-track-label={s.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-7 inline-flex items-center gap-1.5 min-h-11 font-medium text-char underline underline-offset-4 decoration-2 decoration-signal hover:text-signal"
                >
                  Hire me for this <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
