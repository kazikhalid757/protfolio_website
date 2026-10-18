'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bug, 
  Github, 
  Linkedin, 
  ShieldCheck, 
  Lock,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  profile?: any;
}

export default function Footer({ profile }: FooterProps) {
  const p = profile || {};
  const socials = p.socials || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface border-t border-borderLight py-6">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-inkSubtle">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="w-2.5 h-2.5 bg-emeraldSolid inline-block shrink-0"></span>
          <span className="font-mono font-bold text-ink">{p.name || 'KAZI KHALID HASAN TAMIM'}</span>
          <span>—</span>
          <span>QA &amp; Test Automation Architect (SDET)</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="hidden md:inline">PURE SOLID LIGHT MODE // ZERO-DEFECT ENGINEERING</span>
          <Link 
            href="/admin" 
            className="text-inkSubtle hover:text-ink flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
          <button 
            type="button"
            onClick={scrollToTop} 
            className="text-ink hover:text-emeraldSolid font-semibold cursor-pointer"
          >
            Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
