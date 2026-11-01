import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import { safeUrl } from '@/lib/safeUrl';
import type { Award, Certification } from '@/lib/schemas';

interface AwardsCertificationsProps {
  awards?: Award[];
  certifications?: Certification[];
}

export default function AwardsCertifications({ awards, certifications }: AwardsCertificationsProps) {
  const a = awards || [];
  const c = certifications || [];
  if (a.length === 0 && c.length === 0) return null;

  return (
    <section id="recognition" className="scroll-mt-20 bg-paperDeep border-y border-rule">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <SectionHead
          index="06"
          eyebrow="Recognition"
          title={
            <>
              Bugs that <span className="italic">Google</span> said thanks for.
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-signal mb-2">Security</h3>
            <ul className="border-t border-char">
              {a.map((x) => (
                <li key={x.id} className="py-6 border-b border-rule">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="text-xl font-semibold tracking-tight text-char">{x.title}</h4>
                    <span className="font-mono text-xs text-mute shrink-0">{x.date}</span>
                  </div>
                  <p className="mt-1 text-charSoft">{x.issuer}</p>
                  <p className="mt-3 text-mute leading-relaxed">{x.description}</p>
                  {safeUrl(x.verifyUrl) && (
                    <a
                      href={safeUrl(x.verifyUrl)}
                      data-track="award_verify"
                      data-track-label={x.title}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 min-h-11 text-sm font-medium text-char underline underline-offset-4 decoration-signal"
                    >
                      Verify <ArrowUpRight size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-signal mb-2">Certifications</h3>
            <ul className="border-t border-char">
              {c.map((x) => (
                <li key={x.id} className="py-6 border-b border-rule">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold tracking-tight text-char">{x.title}</h4>
                      <p className="mt-1 text-mute">
                        {x.issuer}
                        {x.date ? <span> · {x.date}</span> : null}
                      </p>
                    </div>
                    {safeUrl(x.verifyUrl) && (
                      <a
                        href={safeUrl(x.verifyUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify ${x.title}`}
                        data-track="cert_verify"
                        data-track-label={x.title}
                        className="shrink-0 -mt-2 -mr-2 grid place-items-center w-11 h-11 text-char hover:text-signal"
                      >
                        <ArrowUpRight size={20} />
                      </a>
                    )}
                  </div>
                  {x.skills?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {x.skills.map((t: string) => (
                        <li key={t} className="px-2.5 py-1 border border-char/30 font-mono text-xs text-charSoft">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
