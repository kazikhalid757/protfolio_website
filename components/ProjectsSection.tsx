'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FolderGit2, 
  Github, 
  ExternalLink, 
  Search, 
  Activity,
  Layers,
  ArrowRight,
  Cpu
} from 'lucide-react';

interface ProjectsProps {
  projects?: any[];
}

export default function ProjectsSection({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projectList = projects || [];

  const categories = ['All', 'Test Automation', 'DevTestOps', 'API Testing', 'Performance'];

  const filteredProjects = projectList.filter((proj) => {
    const matchesFilter = filter === 'All' || proj.category === filter;
    const matchesSearch = 
      proj.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const flagshipDeliveries = [
    {
      domain: 'FINTECH CORE',
      badgeClass: 'bg-emeraldSurface border-emeraldBorder text-emeraldText',
      title: 'Multi-Tenant Payment Gateway E2E & API Harness',
      summary: 'Migrated 1,400+ brittle legacy tests to sharded Playwright + REST Assured inside Docker GitHub Actions.',
      metricValue: '-78% CI Runtime',
      metricSub: '42m → 9m 10s',
      metricColor: 'text-emeraldSolid'
    },
    {
      domain: 'CLOUD SAAS',
      badgeClass: 'bg-blueSurface border-blueBorder text-blueText',
      title: 'Automated OWASP ZAP Security & Regression Gate',
      summary: 'Engineered continuous DAST scanning and RBAC authorization matrix verification across 95+ REST endpoints.',
      metricValue: '100% Auth Coverage',
      metricSub: '24 Critical Bugs Blocked',
      metricColor: 'text-blueSolid'
    },
    {
      domain: 'E-COMMERCE SCALE',
      badgeClass: 'bg-amberSurface border-amberBorder text-amberText',
      title: 'Distributed Selenium Grid 4 & JMeter Load Matrix',
      summary: 'Simulated 25,000 concurrent checkout sessions and automated cross-browser visual/DOM assertions.',
      metricValue: '99.94% Peak Uptime',
      metricSub: 'Zero Black-Friday Escapes',
      metricColor: 'text-amberSolid'
    }
  ];

  return (
    <section id="systems" className="scroll-mt-24 pt-4 pb-12">
      {/* Anchor alias for #projects */}
      <span id="projects" className="sr-only">Systems</span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Flagship Test Architecture Deliveries (05 // SYSTEMS & TRACK RECORD) */}
        <div className="bg-surface border border-borderLight rounded-lg p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-emeraldSolid uppercase tracking-wider">
                05 // PRODUCTION SYSTEMS &amp; DELIVERIES
              </span>
              <h2 className="font-display font-bold text-xl text-ink mt-1">
                Featured Test Architecture Case Studies
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-nested border border-borderLight text-ink self-start sm:self-auto">
              3 PRODUCTION CASE STUDIES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flagshipDeliveries.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-md bg-canvas border border-borderLight flex flex-col justify-between gap-4 micro-transition hover:border-borderHover"
              >
                <div className="space-y-2">
                  <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border inline-block ${item.badgeClass}`}>
                    {item.domain}
                  </span>
                  <h3 className="font-display font-bold text-sm text-ink leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-borderLight font-mono">
                  <div className={`text-base font-extrabold ${item.metricColor}`}>
                    {item.metricValue}
                  </div>
                  <div className="text-[11px] text-inkSubtle">
                    {item.metricSub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Production Automation Repositories */}
        <div className="bg-surface border border-borderLight rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-inkSubtle uppercase tracking-wider">
                ENGINEERING REPOSITORIES
              </span>
              <h3 className="font-display font-bold text-lg text-ink mt-0.5">
                Automated Framework Repositories &amp; Pipelines
              </h3>
            </div>
            <span className="font-mono text-xs text-inkMuted">
              Showing {filteredProjects.length} of {projectList.length} Repositories
            </span>
          </div>

          {/* Filter Controls & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold micro-transition cursor-pointer ${
                    filter === cat
                      ? 'bg-ink text-white'
                      : 'bg-nested text-inkMuted hover:text-ink hover:bg-surface border border-borderLight'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-inkSubtle" />
              <input
                type="text"
                placeholder="Search tools, locators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-md bg-canvas border border-borderLight focus:border-ink focus:outline-none text-xs text-ink font-medium"
              />
            </div>
          </div>

          {/* Project Repository Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="arch-card rounded-md p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-nested border border-borderLight text-ink">
                      {proj.category || 'QA System'}
                    </span>
                    {proj.stats && (
                      <span className="font-mono text-[10px] text-emeraldSolid font-semibold">
                        {proj.stats}
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-bold text-sm text-ink leading-snug">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-inkMuted leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-borderLight">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {(proj.tags || []).slice(0, 4).map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-canvas text-inkSubtle border border-borderLight"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 font-mono text-xs">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-ink hover:text-emeraldSolid font-semibold"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emeraldSolid hover:underline font-semibold"
                      >
                        <span>Pipeline</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
