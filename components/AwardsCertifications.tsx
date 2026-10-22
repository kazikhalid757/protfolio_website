'use client';

import React from 'react';
import { 
  Trophy, 
  ExternalLink, 
  Award,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AwardsProps {
  awards?: any[];
  certifications?: any[];
}

export default function AwardsCertifications({ awards }: AwardsProps) {
  const allAwards = [
    {
      id: 'vrp-hof',
      title: 'Google Vulnerability Reward Program (VRP)',
      issuer: 'Google Security Team',
      badge: 'HALL OF FAME',
      description: 'Recognized in the Google Bug Hunters Hall of Fame as an Independent Security Researcher for reporting verified vulnerabilities.',
      verifyUrl: 'https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759',
      badgeClass: 'bg-blueSurface border-blueBorder text-[#1D4ED8]'
    },
    {
      id: 'award-snake',
      title: 'Snake Achievement Award',
      issuer: 'Google Bug Hunters',
      badge: 'GOOGLE VRP',
      description: 'Awarded by Google Security for discovering and responsibly reporting verified web and API security vulnerabilities.',
      verifyUrl: 'https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759',
      badgeClass: 'bg-blueSurface border-blueBorder text-[#1D4ED8]'
    },
    {
      id: 'award-first',
      title: 'First Report Submitted Award',
      issuer: 'Google Bug Hunters',
      badge: 'VERIFIED DISCLOSURE',
      description: 'Successfully submitted and verified bug report to Google\'s Vulnerability Reward Program.',
      verifyUrl: 'https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759',
      badgeClass: 'bg-blueSurface border-blueBorder text-[#1D4ED8]'
    }
  ];

  return (
    <section id="awards" className="scroll-mt-24 pt-4 pb-12">
      {/* Anchor alias for #credentials */}
      <span id="credentials" className="sr-only">Awards</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Awards Container */}
        <div className="bg-surface border border-borderLight rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  HONORS &amp; RECOGNITION
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                  Awards
                </h2>
              </div>
            </div>

            <a
              href="https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-blueSurface border border-blueBorder text-blueSolid font-mono text-xs font-bold hover:bg-blueSolid hover:text-white transition-colors self-start sm:self-auto shadow-sm"
            >
              <span>Google VRP Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Clean 3-Card Grid: Verified Google Security Awards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allAwards.map((item) => (
              <a
                key={item.id}
                href={item.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg bg-canvas border border-borderLight hover:border-borderHover flex flex-col justify-between gap-3 transition-all hover:shadow-sm group block"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border inline-block bg-white border-borderLight text-inkSubtle">
                      {item.issuer}
                    </span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-ink group-hover:text-emeraldSolid transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-inkMuted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-borderLight flex items-center justify-between font-mono text-[11px] text-inkMuted">
                  <span className="flex items-center gap-1 text-emeraldSolid font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Standing</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-inkSubtle group-hover:text-ink">
                    <span>View Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
