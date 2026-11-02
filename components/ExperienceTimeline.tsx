'use client';

import React, { useEffect, useRef, useState } from 'react';
import SectionHead from './SectionHead';
import type { Experience } from '@/lib/schemas';

interface ExperienceTimelineProps {
  experiences?: Experience[];
}

// Vertical centre of a dot, measured from the top of its <li>.
const DOT_CENTER = 16;

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const items = experiences || [];
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState({ top: 0, height: 0 });
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list || items.length === 0) return;

    let dots: number[] = [];
    let raf = 0;
    let lastReached = -1;

    const measure = () => {
      dots = itemRefs.current.map((li) => (li ? li.offsetTop + DOT_CENTER : 0));
      const top = dots[0] ?? 0;
      const height = (dots[dots.length - 1] ?? 0) - top;
      setTrack((t) => (t.top === top && t.height === height ? t : { top, height }));
    };

    // The line fills down to a reading line a little below the middle of the screen.
    const update = () => {
      raf = 0;
      if (dots.length === 0) return;
      const readingY = window.innerHeight * 0.6 - list.getBoundingClientRect().top;
      const span = dots[dots.length - 1] - dots[0];
      const fill = Math.min(Math.max(readingY - dots[0], 0), span);
      if (fillRef.current) fillRef.current.style.height = `${fill}px`;

      const count = dots.filter((y) => y <= readingY).length;
      if (count !== lastReached) {
        lastReached = count;
        setReached(count);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  // Shared x position of the line and the dots: far left on phones, after the date column from md up.
  const lineX = 'left-2 md:left-[12rem] -translate-x-1/2';

  return (
    <section id="work" className="scroll-mt-20 bg-paperDeep border-y border-rule">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16 md:py-20 lg:py-28">
        <SectionHead
          index="01"
          eyebrow="Work"
          title={
            <>
              Three teams, <span className="italic">three SaaS products</span>.
            </>
          }
          intro="Lead automation, fleet software and small-business tooling. Different domains, same job: make sure it works before a customer finds out it doesn't."
        />

        <ol ref={listRef} className="relative">
          {/* Line: a quiet rail, with an orange fill that follows your scroll */}
          <div
            aria-hidden
            className={`absolute w-0.5 bg-char/15 pointer-events-none ${lineX}`}
            style={{ top: track.top, height: track.height }}
          />
          <div
            ref={fillRef}
            aria-hidden
            className={`absolute w-0.5 bg-signal pointer-events-none ${lineX}`}
            style={{ top: track.top, height: 0 }}
          />

          {items.map((e, i: number) => {
            const on = i < reached;
            const isNow = /present/i.test(e.period || '');
            return (
              <li
                key={e.id || i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="relative pl-9 md:pl-0 md:grid md:grid-cols-[10rem_1fr] pb-16 last:pb-0"
              >
                {isNow && on && (
                  <span
                    aria-hidden
                    className={`absolute top-2 w-4 h-4 rotate-45 border-2 border-signal motion-safe:animate-ping ${lineX}`}
                  />
                )}
                <span
                  aria-hidden
                  className={`absolute top-2 z-10 w-4 h-4 rotate-45 border-2 transition-colors duration-300 ${lineX} ${
                    on ? 'bg-signal border-signal' : 'bg-paperDeep border-char/30'
                  }`}
                />

                <div className="md:text-right md:pr-4">
                  <p
                    className={`font-serif text-4xl leading-none transition-colors duration-300 ${
                      on ? 'text-signal' : 'text-char/30'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.06em] text-mute">{e.period}</p>
                  {e.type && <p className="mt-1 font-mono text-xs text-mute">{e.type}</p>}
                  {isNow && (
                    <p className="mt-3 inline-block bg-char text-paper font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1">
                      Now
                    </p>
                  )}
                </div>

                <div className="mt-6 md:mt-0 md:pl-16">
                  <h3 className="text-2xl font-semibold tracking-tight text-char">{e.role}</h3>
                  <p className="mt-1 text-charSoft">
                    {e.company}
                    {e.location ? <span className="text-mute"> · {e.location}</span> : null}
                  </p>

                  {e.summary && <p className="mt-5 text-lg leading-relaxed text-charSoft max-w-2xl">{e.summary}</p>}

                  <ul className="mt-5 space-y-3 max-w-2xl">
                    {(e.highlights || []).map((h: string, j: number) => (
                      <li key={j} className="flex gap-3 text-mute leading-relaxed">
                        <span className="mt-2.5 w-1.5 h-1.5 shrink-0 bg-signal" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {e.techStack?.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {e.techStack.map((t: string) => (
                        <li key={t} className="px-2.5 py-1 border border-char/30 font-mono text-xs text-charSoft">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
