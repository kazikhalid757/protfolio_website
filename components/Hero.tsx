import React from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin } from 'lucide-react';
import { safeUrl } from '@/lib/safeUrl';
import { RESUME_PDF_PATH, hasResume, resumeFileName } from '@/lib/resume/document';
import type { Experience, Profile, Resume } from '@/lib/schemas';

interface HeroProps {
  profile: Profile;
  experiences?: Experience[];
  resume?: Resume;
}

const metricLabels: Record<string, string> = {
  yearsExperience: 'Years in QA',
  saasProducts: 'SaaS products tested',
  automationRepos: 'Automation repos',
  googleVrpAwards: 'Google VRP awards',
};

export default function Hero({ profile, experiences, resume }: HeroProps) {
  const p = profile;
  const metrics = Object.entries(p.metrics || {}).filter(([k]) => metricLabels[k]);
  const current = experiences?.find((e) => e.period?.toLowerCase().includes('present'));
  const firstName = (p.shortName || 'Kazi').split(' ')[0];

  return (
    <section id="top" className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-7 pb-12 sm:pt-9 md:pt-10 md:pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start lg:items-center">
          <div className="md:col-span-7">
            {p.availableForHire && (
              <p className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.14em] text-char mb-8">
                <span className="w-2 h-2 bg-signal" aria-hidden />
                {p.availabilityStatus || 'Available for work'}
              </p>
            )}

            <h1 className="font-serif font-normal text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-char">
              Hi, I&apos;m {firstName}.
              <br />
              <span className="italic text-signal">QA &amp; automation</span> engineer.
            </h1>

            <p className="mt-8 text-xl leading-relaxed text-charSoft max-w-xl">{p.tagline}</p>
            <p className="mt-4 text-base leading-relaxed text-mute max-w-xl">{p.bio}</p>

            {current && (
              <p className="mt-6 text-sm text-mute">
                Now at <span className="text-char font-medium">{current.company}</span>
                {current.product ? <>, testing {current.product}</> : null}.
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#products"
                data-track="see_work"
                className="inline-flex items-center gap-2 h-12 px-6 bg-char text-paper font-medium hover:bg-signal transition-colors"
              >
                See my work <ArrowDown size={16} />
              </a>
              {hasResume(resume) && (
                <a
                  href={RESUME_PDF_PATH}
                  download={resumeFileName(resume)}
                  data-track="cv_download"
                  className="inline-flex items-center gap-2 h-12 px-6 border border-char text-char font-medium hover:bg-char hover:text-paper transition-colors"
                >
                  Download CV <Download size={16} />
                </a>
              )}
            </div>

            {(safeUrl(p.socials?.github) || safeUrl(p.socials?.linkedin)) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-mute mr-1">Find me on</span>
                {safeUrl(p.socials?.github) && (
                  <a
                    href={safeUrl(p.socials.github)}
                    data-track="social_github"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 h-11 pl-3 pr-4 bg-white border border-rule text-char font-medium hover:border-char transition-colors"
                  >
                    <Github size={18} /> GitHub
                    <ArrowUpRight size={14} className="text-mute group-hover:text-signal" />
                  </a>
                )}
                {safeUrl(p.socials?.linkedin) && (
                  <a
                    href={safeUrl(p.socials.linkedin)}
                    data-track="social_linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 h-11 pl-3 pr-4 bg-white border border-rule text-char font-medium hover:border-char transition-colors"
                  >
                    <Linkedin size={18} /> LinkedIn
                    <ArrowUpRight size={14} className="text-mute group-hover:text-signal" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex justify-center md:justify-end">
            <figure className="w-full max-w-sm">
              <div className="relative mr-4 mb-4">
                <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-signal" aria-hidden />
                <div className="relative aspect-[4/5] bg-paperDeep border border-char overflow-hidden">
                  <Image
                    src={safeUrl(p.avatar) || '/images/kazi-tamim.jpg'}
                    alt={`${p.name}${p.title ? `, ${p.title}` : ''}`}
                    fill
                    priority
                    sizes="(min-width: 768px) 380px, 90vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute -left-3 bottom-8 bg-signal text-white font-mono text-[11px] uppercase tracking-[0.16em] px-3 py-2">
                  QA · Automation
                </span>
              </div>
              <figcaption className="mt-5 font-mono text-xs text-mute lowercase text-balance">
                always breaking things, so you don&apos;t have to.
              </figcaption>
            </figure>
          </div>
        </div>

        {metrics.length > 0 && (
          <dl className="mt-12 md:mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border-t border-char">
            {metrics.map(([key, value], i) => (
              <div
                key={key}
                className={`bg-paper py-6 md:py-8 pr-4 ${
                  i === 0 ? 'pl-0' : i === 2 ? 'pl-0 md:pl-6' : 'pl-4 md:pl-6'
                }`}
              >
                <dd className="font-serif text-5xl md:text-6xl text-char leading-none">{String(value)}</dd>
                <dt className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-mute">
                  {metricLabels[key]}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
