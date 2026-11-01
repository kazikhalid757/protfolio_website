import React from 'react';
import { Loader2 } from 'lucide-react';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="font-serif font-normal text-4xl md:text-5xl leading-tight tracking-tight text-char">{title}</h1>
        {description && <p className="mt-2 text-mute leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = '',
  tone = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'danger' | 'dark';
}) {
  const tones = {
    default: 'bg-white border-rule',
    danger: 'bg-white border-signal',
    dark: 'bg-char border-char text-paper',
  };
  return <section className={`border ${tones[tone]} ${className}`}>{children}</section>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  busy?: boolean;
};

export function Button({ variant = 'primary', size = 'md', busy, className = '', children, disabled, ...rest }: ButtonProps) {
  const variants = {
    primary: 'bg-char text-paper hover:bg-signal border border-char hover:border-signal',
    outline: 'bg-white text-char border border-char hover:bg-char hover:text-paper',
    ghost: 'bg-transparent text-charSoft border border-transparent hover:bg-paperDeep',
    danger: 'bg-white text-signal border border-signal hover:bg-signal hover:text-white',
  };
  const sizes = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-5 text-sm' };
  return (
    <button
      {...rest}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {busy && <Loader2 size={15} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'signal' | 'dark' | 'ok';
}) {
  const tones = {
    neutral: 'bg-paperDeep text-charSoft border-rule',
    signal: 'bg-signal text-white border-signal',
    dark: 'bg-char text-paper border-char',
    ok: 'bg-white text-char border-char',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-mute" role="status">
      <Loader2 className="animate-spin" size={20} aria-hidden />
      <span className="font-mono text-xs uppercase tracking-[0.14em]">{label}…</span>
    </div>
  );
}

export function Notice({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn';
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border-l-4 px-4 py-3 text-sm leading-relaxed ${tone === 'warn' ? 'border-signal bg-white' : 'border-char bg-paperDeep'}`}>
      {title && <p className="font-semibold text-char mb-0.5">{title}</p>}
      <div className="text-charSoft">{children}</div>
    </div>
  );
}
