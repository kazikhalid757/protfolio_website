'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface AwardsProps {
  awards?: any[];
  certifications?: any[];
}

export default function AwardsCertifications({ awards, certifications }: AwardsProps) {
  const awardList = awards || [];
  const certList = certifications || [];

  return (
    <section id="credentials" className="scroll-mt-24 pt-4 pb-12">
      {/* Anchor alias for #awards */}
      <span id="awards" className="sr-only">Credentials</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Credentials Container */}
        <div className="bg-surface border border-borderLight rounded-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-blueSolid uppercase tracking-wider">
                06 // VERIFIED CREDENTIALS &amp; RECOGNITION
              </span>
              <h2 className="font-display font-extrabold text-2xl text-ink mt-0.5">
                Security &amp; Engineering Standing
              </h2>
            </div>
            <a
              href="https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blueSurface border border-blueBorder text-blueSolid font-mono text-xs font-bold hover:bg-blueSolid hover:text-white micro-transition self-start sm:self-auto"
            >
              <span>Verify Google VRP Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3 Core Standing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Google VRP */}
            <div className="p-4 rounded-md bg-blueSurface border border-blueBorder space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-blueText">Google Vulnerability Reward Program (VRP)</h3>
                  <span className="font-mono text-[10px] font-bold bg-surface px-2 py-0.5 rounded border border-blueBorder text-blueSolid">
                    HALL OF FAME
                  </span>
                </div>
                <p className="text-xs text-inkMuted leading-relaxed">
                  Recognized Independent Security Researcher identifying and reporting valid web and API vulnerabilities to Google Security.
                </p>
              </div>
              <div className="pt-2 font-mono text-[11px] text-blueText font-semibold flex items-center justify-between">
                <span>Google Security Team VRP</span>
                <span>Verified ✓</span>
              </div>
            </div>

            {/* Upwork Top-Rated */}
            <div className="p-4 rounded-md bg-emeraldSurface border border-emeraldBorder space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-emeraldText">Upwork Top-Rated SDET Consultant</h3>
                  <span className="font-mono text-[10px] font-bold bg-surface px-2 py-0.5 rounded border border-emeraldBorder text-emeraldSolid">
                    100% JSS
                  </span>
                </div>
                <p className="text-xs text-inkMuted leading-relaxed">
                  Demonstrated excellence delivering resilient test automation frameworks for international engineering teams across US, EU, and APAC.
                </p>
              </div>
              <div className="pt-2 font-mono text-[11px] text-emeraldText font-semibold flex items-center justify-between">
                <span>Top-Rated SDET Talent</span>
                <span>Active ✓</span>
              </div>
            </div>

            {/* Quality SLA Guarantee */}
            <div className="p-4 rounded-md bg-canvas border border-borderLight space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-ink">Quality Engineering SLA Guarantee</h3>
                  <span className="font-mono text-[10px] font-bold bg-surface px-2 py-0.5 rounded border border-borderLight text-ink">
                    &lt; 0.5% FLAKE
                  </span>
                </div>
                <p className="text-xs text-inkMuted leading-relaxed">
                  Every automated test suite is delivered with deterministic auto-waits, Dockerized reproducibility, and CI/CD quality gate enforcement.
                </p>
              </div>
              <div className="pt-2 font-mono text-[11px] text-ink font-semibold flex items-center justify-between">
                <span>Zero Regression Release Gate</span>
                <span>Enforced ✓</span>
              </div>
            </div>
          </div>

          {/* Industry Certifications */}
          <div className="pt-4 border-t border-borderLight space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-inkSubtle uppercase tracking-wider">
                PROFESSIONAL CERTIFICATIONS
              </span>
              <span className="font-mono text-xs text-emeraldSolid font-semibold">
                Verified Credentials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {certList.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="p-3.5 rounded-md bg-canvas border border-borderLight flex items-start gap-3 micro-transition hover:border-borderHover"
                >
                  <div className="w-8 h-8 rounded bg-surface border border-borderLight flex items-center justify-center text-ink shrink-0 font-mono text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-ink truncate">{cert.title}</div>
                    <div className="text-[11px] text-inkSubtle mt-0.5">{cert.issuer} • {cert.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
