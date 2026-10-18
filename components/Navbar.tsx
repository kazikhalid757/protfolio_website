'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Lock, 
  ExternalLink 
} from 'lucide-react';

interface NavbarProps {
  profile?: any;
}

export default function Navbar({ profile }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  const navLinks = [
    { id: 'overview', num: '01', name: 'Overview', href: '#overview' },
    { id: 'capabilities', num: '02', name: 'Capabilities', href: '#capabilities' },
    { id: 'qa-studio', num: '03', name: 'QA Studio', href: '#qa-studio' },
    { id: 'architecture', num: '04', name: 'Architecture', href: '#architecture' },
    { id: 'systems', num: '05', name: 'Systems', href: '#systems' },
    { id: 'credentials', num: '06', name: 'Credentials', href: '#credentials' },
    { id: 'track-record', num: '07', name: 'Track Record', href: '#track-record' },
    { id: 'contact', num: '08', name: 'Contact', href: '#contact' },
  ];

  const upworkUrl = profile?.socials?.upwork || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share';

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-borderLight">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Left Brand Cluster */}
        <Link href="#overview" className="flex items-center gap-3 shrink-0 group focus:outline-none">
          <div className="w-9 h-9 rounded-md bg-ink flex items-center justify-center text-white shrink-0 micro-transition group-hover:bg-inkHover">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-tight text-ink whitespace-nowrap">KAZI.SDET</span>
              <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emeraldSurface border border-emeraldBorder text-emeraldText whitespace-nowrap">
                QA ARCHITECT
              </span>
            </div>
            <span className="text-[11px] text-inkSubtle font-medium tracking-tight whitespace-nowrap hidden sm:inline">
              Zero-Defect CI/CD Engineering
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Single-line, non-wrapping) */}
        <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveNav(link.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap micro-transition ${
                  isActive 
                    ? 'bg-nested text-ink border border-borderLight' 
                    : 'text-inkMuted hover:text-ink hover:bg-nested border border-transparent'
                }`}
              >
                <span className="font-mono text-[11px] text-emeraldSolid font-semibold mr-1">{link.num}</span>
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Cluster */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={upworkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-emeraldSolid hover:bg-[#047857] text-white whitespace-nowrap micro-transition"
          >
            <span>Hire on Upwork</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M7 17L17 7M17 7H8M17 7V16"/>
            </svg>
          </a>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 rounded-md text-xs font-semibold bg-ink hover:bg-inkHover text-white whitespace-nowrap micro-transition"
          >
            Get in Touch
          </a>

          <Link
            href="/admin"
            className="p-2 rounded-md bg-nested border border-borderLight text-inkMuted hover:text-ink hover:border-borderHover micro-transition"
            title="Admin CMS"
          >
            <Lock className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle Navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-md bg-nested border border-borderLight text-ink hover:border-borderHover micro-transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-bar */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface border-t border-borderLight px-4 py-3 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-borderLight">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActiveNav(link.id);
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap bg-nested text-ink border border-borderLight"
              >
                <span className="font-mono text-emeraldSolid mr-1">{link.num}</span>
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
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
              className="px-4 py-2 rounded-md text-xs font-semibold bg-nested border border-borderLight text-ink flex items-center gap-1"
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
