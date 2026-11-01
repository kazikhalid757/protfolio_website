'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Profile } from '@/lib/schemas';

interface NavbarProps {
  profile: Profile;
}

const links = [
  { href: '#work', label: 'Work' },
  { href: '#products', label: 'Products' },
  { href: '#services', label: 'Services' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#recognition', label: 'Recognition' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const name = profile?.shortName || 'Kazi Tamim';
  const [first, ...rest] = name.split(' ');
  const last = rest.join(' ');
  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    onScroll();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper border-b transition-colors ${
        scrolled ? 'border-rule' : 'border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" aria-label={`${name}, back to top`} className="group flex shrink-0 items-center gap-3 whitespace-nowrap">
          <span
            className="grid place-items-center w-10 h-10 bg-char text-paper font-mono text-sm font-semibold tracking-tight group-hover:bg-signal transition-colors"
            aria-hidden
          >
            {initials}
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[26px] tracking-tight text-char">
              {first}
              {last && <span className="italic"> {last}</span>}
            </span>
            <span className="block mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              QA &amp; Automation
            </span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="block py-3 -my-3 text-sm text-mute hover:text-char transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          data-track="hire_me"
          data-track-label="Nav button"
          className="hidden lg:inline-flex shrink-0 items-center h-9 px-4 text-sm font-medium whitespace-nowrap bg-char text-paper hover:bg-signal transition-colors"
        >
          Hire me
        </a>

        <button
          type="button"
          className="lg:hidden grid place-items-center w-11 h-11 -mr-2 text-char"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        ref={bar}
        aria-hidden
        className="absolute left-0 right-0 -bottom-px h-0.5 bg-signal origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      {open && (
        <div className="lg:hidden bg-paper border-t border-rule max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <ul className="max-w-6xl mx-auto px-5 sm:px-8 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-char border-b border-rule"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <a
                href="#contact"
                data-track="hire_me"
                data-track-label="Mobile menu"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center h-12 bg-char text-paper font-medium hover:bg-signal transition-colors"
              >
                Hire me
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
