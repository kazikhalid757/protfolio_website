import React from 'react';

interface SectionHeadProps {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}

export default function SectionHead({ index, eyebrow, title, intro }: SectionHeadProps) {
  return (
    <div className="mb-8 md:mb-12 lg:mb-16 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mute mb-5">
        <span className="text-signal">{index}</span>
        <span className="mx-3 inline-block w-8 h-px bg-rule align-middle" />
        {eyebrow}
      </p>
      <h2 className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-char">
        {title}
      </h2>
      {intro && <p className="mt-6 text-lg leading-relaxed text-mute max-w-2xl">{intro}</p>}
    </div>
  );
}
