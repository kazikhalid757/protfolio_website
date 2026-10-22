'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Lock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  profile?: any;
}

export default function Navbar({ profile }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('about');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { id: 'about', name: 'Overview', href: '#about' },
    { id: 'capabilities', name: 'Capabilities', href: '#capabilities' },
    { id: 'skills', name: 'Stack', href: '#skills' },
    { id: 'systems', name: 'Projects', href: '#systems' },
    { id: 'awards', name: 'Awards', href: '#awards' },
    { id: 'track-record', name: 'Experience', href: '#track-record' },
    { id: 'contact', name: 'Contact', href: '#contact' },
  ];

  const upworkUrl = profile?.socials?.upwork || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveNav(sec.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      scrolled 
        ? 'bg-surface/95 backdrop-blur-md border-b border-borderLight shadow-sm' 
        : 'bg-surface border-b border-borderLight'
    }`}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Clean Modern Brand */}
        <Link href="#about" className="flex items-center gap-2.5 shrink-0 group focus:outline-none">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white shrink-0 group-hover:bg-inkHover transition-colors shadow-sm">
            <span className="font-mono text-emerald-400 font-bold text-xs">&gt;_</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm sm:text-base tracking-tight text-ink">
              Kazi Tamim
            </span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emeraldSurface border border-emeraldBorder text-emeraldText">
              SDET
            </span>
          </div>
        </Link>

        {/* Streamlined Desktop Navigation Links (Clean, No Numbered Noise) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-nested text-emeraldSolid border border-borderLight font-bold' 
                    : 'text-inkMuted hover:text-ink hover:bg-nested/70'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={upworkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-md text-xs font-semibold bg-emeraldSolid hover:bg-[#047857] text-white whitespace-nowrap shadow-sm transition-all"
          >
            <span>Hire on Upwork</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 sm:py-2 rounded-md text-xs font-semibold bg-ink hover:bg-inkHover text-white whitespace-nowrap transition-colors"
          >
            Get in Touch
          </a>

          <Link
            href="/admin"
            className="p-2 rounded-md bg-nested border border-borderLight text-inkMuted hover:text-ink hover:border-borderHover transition-colors"
            title="Admin CMS"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle Navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md bg-nested border border-borderLight text-ink hover:border-borderHover transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Robust Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface/98 backdrop-blur-lg border-b border-borderLight px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between ${
                    isActive 
                      ? 'bg-nested text-emeraldSolid border border-borderLight' 
                      : 'text-inkMuted hover:text-ink hover:bg-nested'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-3 h-3 text-inkSubtle" />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-borderLight">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 rounded-md text-xs font-semibold bg-ink text-white"
            >
              Get in Touch
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-semibold bg-nested border border-borderLight text-ink flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>CMS</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
