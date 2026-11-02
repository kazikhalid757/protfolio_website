import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import { safeUrl } from '@/lib/safeUrl';
import type { Product } from '@/lib/schemas';

interface ProductsSectionProps {
  products?: Product[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  const items = products || [];
  if (items.length === 0) return null;

  return (
    <section id="products" className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16 md:py-20 lg:py-28">
        <SectionHead
          index="02"
          eyebrow="Products"
          title={
            <>
              Software I&apos;ve <span className="italic">built</span> and software I&apos;ve{' '}
              <span className="italic">broken</span>.
            </>
          }
          intro="Two products are mine end to end. The rest are SaaS products I tested for their teams."
        />

        <div className="space-y-8">
          {items.map((p, i: number) => {
            const own = p.kind === 'Built by me';
            return (
              <article
                key={p.id || i}
                className={`grid grid-cols-1 lg:grid-cols-12 border ${
                  own ? 'bg-char text-paper border-char' : 'bg-white text-char border-rule'
                }`}
              >
                <div className={`lg:col-span-5 p-7 md:p-10 border-b lg:border-b-0 lg:border-r ${own ? 'border-paper/20' : 'border-rule'}`}>
                  <p className="font-mono text-xs uppercase tracking-[0.14em]">
                    <span className="text-signal">{String(i + 1).padStart(2, '0')}</span>
                    <span className={own ? 'text-paper/60' : 'text-mute'}> · {p.kind}</span>
                  </p>
                  <h3 className="mt-6 font-serif font-normal text-5xl leading-none text-inherit">{p.name}</h3>
                  <p className={`mt-4 text-lg leading-snug ${own ? 'text-paper/80' : 'text-charSoft'}`}>{p.tagline}</p>
                  <p className={`mt-6 font-mono text-xs ${own ? 'text-paper/60' : 'text-mute'}`}>{p.role}</p>

                  {safeUrl(p.url) && (
                    <a
                      href={safeUrl(p.url)}
                      data-track="product_visit"
                      data-track-label={p.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 min-h-11 font-medium underline underline-offset-4 decoration-2 decoration-signal hover:text-signal"
                    >
                      Visit {p.url.replace(/^https?:\/\//, '')} <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>

                <div className="lg:col-span-7 p-7 md:p-10 space-y-7">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-signal">The problem</h4>
                    <p className={`mt-2 leading-relaxed ${own ? 'text-paper/80' : 'text-mute'}`}>{p.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-signal">
                      {own ? 'What I built' : 'What I did'}
                    </h4>
                    <p className={`mt-2 leading-relaxed ${own ? 'text-paper/80' : 'text-mute'}`}>{p.built}</p>
                  </div>

                  {p.stats?.length > 0 && (
                    <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-6 border-t ${own ? 'border-paper/20' : 'border-rule'}`}>
                      {p.stats.map((s: string) => (
                        <li key={s} className="flex gap-3 text-sm font-medium">
                          <span className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-signal" aria-hidden />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}

                  {p.stack?.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {p.stack.map((t: string) => (
                        <li
                          key={t}
                          className={`px-2.5 py-1 border font-mono text-xs ${
                            own ? 'border-paper/30 text-paper/80' : 'border-char/30 text-charSoft'
                          }`}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
