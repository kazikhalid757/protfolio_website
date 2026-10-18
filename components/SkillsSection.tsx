'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Terminal, 
  Code2, 
  Globe, 
  Bot, 
  Smartphone, 
  FileText, 
  Send, 
  Server, 
  Activity, 
  Box, 
  GitFork, 
  Sliders, 
  CheckSquare, 
  Bug, 
  Trello, 
  Binary, 
  Coffee, 
  Braces, 
  Database,
  Search,
  FileCode,
  ShieldAlert,
  GitPullRequest,
  Cloud,
  TerminalSquare,
  CheckCircle2
} from 'lucide-react';

interface SkillsProps {
  skills?: any[];
}

export default function SkillsSection({ skills }: SkillsProps) {
  const iconMap: Record<string, any> = {
    Terminal, Code2, Globe, Bot, Smartphone, FileText, Send, Server, Activity,
    Box, GitFork, Sliders, CheckSquare, Bug, Trello, Binary, Coffee, Braces,
    Database, Search, FileCode, ShieldAlert, GitPullRequest, Cloud, TerminalSquare, CheckCircle2
  };

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...(skills?.map(s => s.category) || [])];

  const filteredCategories = activeCategory === 'All' 
    ? (skills || [])
    : (skills || []).filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="scroll-mt-24 pt-4 pb-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="bg-surface border border-borderLight rounded-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-emeraldSolid uppercase tracking-wider">
                TECHNICAL ARSENAL &amp; TOOLCHAIN
              </span>
              <h2 className="font-display font-extrabold text-2xl text-ink mt-0.5">
                Skills &amp; Automation Proficiencies
              </h2>
            </div>
            <span className="font-mono text-xs text-inkMuted">
              Verified Production Toolsets &amp; Methodologies
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold micro-transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-ink text-white'
                    : 'bg-nested text-inkMuted hover:text-ink hover:bg-surface border border-borderLight'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="space-y-4">
            {filteredCategories.map((group, groupIdx) => (
              <div 
                key={groupIdx} 
                className="p-5 rounded-md bg-canvas border border-borderLight space-y-3"
              >
                <div className="flex items-center justify-between border-b border-borderLight pb-2.5">
                  <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                    <span className="font-mono text-[11px] text-emeraldSolid font-bold">0{groupIdx + 1} //</span>
                    <span>{group.category}</span>
                  </h3>
                  <span className="font-mono text-[10px] font-semibold text-inkSubtle">
                    {group.items?.length || 0} PROVEN TOOLS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {(group.items || []).map((skill: any, idx: number) => {
                    const Icon = iconMap[skill.icon] || CheckCircle2;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-surface border border-borderLight flex items-center gap-2.5 micro-transition hover:border-borderHover"
                      >
                        <div className="w-7 h-7 rounded bg-nested flex items-center justify-center text-ink shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-xs font-bold text-ink truncate">{skill.name}</div>
                          {skill.level && (
                            <div className="font-mono text-[10px] text-emeraldSolid font-semibold">{skill.level}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
