'use client';

import React from 'react';
import { 
  Cpu, 
  Server, 
  Box, 
  Activity, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Code2,
  GitBranch
} from 'lucide-react';

interface TechnicalSkillsProps {
  skillsMatrix?: any[];
}

export default function TechnicalSkills({ skillsMatrix }: TechnicalSkillsProps) {
  const defaultMatrix = [
    {
      category: 'Automation Toolchains',
      icon: Terminal,
      skills: [
        { name: 'Playwright (TS/JS)', status: 'Primary Engine', highlight: true },
        { name: 'Cypress', status: 'Enterprise' },
        { name: 'Selenium WebDriver 4', status: 'Grid / Parallel' },
        { name: 'Appium', status: 'Mobile iOS/Android' },
        { name: 'Robot Framework', status: 'Keyword Driven' },
        { name: 'Cucumber BDD', status: 'Gherkin' }
      ]
    },
    {
      category: 'Backend & Performance',
      icon: Server,
      skills: [
        { name: 'k6 Load Testing', status: 'Peak Concurrency', highlight: true },
        { name: 'REST Assured', status: 'Java Microservices', highlight: true },
        { name: 'Postman / Newman CLI', status: 'CI Automation' },
        { name: 'Pact', status: 'Consumer Contracts' },
        { name: 'Supertest', status: 'Express / Fastify' },
        { name: 'Apache JMeter', status: 'Distributed Stress' }
      ]
    },
    {
      category: 'DevOps & Infrastructure',
      icon: Box,
      skills: [
        { name: 'GitHub Actions', status: 'Sharded Matrix CI', highlight: true },
        { name: 'Docker & Compose', status: 'Containerized Runners', highlight: true },
        { name: 'Testcontainers', status: 'Ephemeral DBs' },
        { name: 'Jenkins Pipelines', status: 'Declarative' },
        { name: 'AWS Cloud & LocalStack', status: 'Infrastructure' },
        { name: 'Kubernetes / Helm', status: 'Cluster Orchestration' }
      ]
    },
    {
      category: 'Observability & Languages',
      icon: Activity,
      skills: [
        { name: 'TypeScript / JavaScript', status: 'Daily Driver', highlight: true },
        { name: 'Python', status: 'Scripts & AI Eval', highlight: true },
        { name: 'Java 17', status: 'Enterprise Backend' },
        { name: 'SQL & PostgreSQL', status: 'Data State Validation' },
        { name: 'Prometheus & Grafana', status: 'Real-time Latency' },
        { name: 'Allure Reporting', status: 'Artifact Telemetry' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Toolchains & Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Technical Competence Matrix
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 md:mt-0 max-w-md">
            Production-grade competencies mapped across end-to-end automation, microservices contract testing, and distributed DevOps.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {defaultMatrix.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-zinc-800">
                    <div className="w-7 h-7 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400">
                      <Icon size={14} />
                    </div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
                      {cat.category}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {cat.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className={`p-2.5 rounded border text-xs font-mono flex items-center justify-between ${
                          skill.highlight
                            ? 'bg-zinc-950 border-emerald-500/30 text-zinc-100'
                            : 'bg-zinc-950/60 border-zinc-850 text-zinc-400'
                        }`}
                      >
                        <span className="font-medium text-zinc-200">{skill.name}</span>
                        <span className={`text-[10px] ${skill.highlight ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {skill.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-850 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Production Tested</span>
                  <CheckCircle2 size={13} className="text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
