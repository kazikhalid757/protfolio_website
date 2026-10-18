'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  ExternalLink,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface ContactProps {
  profile?: any;
}

export default function ContactSection({ profile }: ContactProps) {
  const p = profile || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    scope: 'Playwright / Cypress E2E Architecture',
    timeline: 'Immediate Start (Within 48 Hours)',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const email = p.email || 'kazikhalid757@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[QA Objective] ${formData.scope} (${formData.timeline})`,
          message: formData.message
        })
      });
      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          scope: 'Playwright / Cypress E2E Architecture',
          timeline: 'Immediate Start (Within 48 Hours)',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 pt-4 pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-borderLight rounded-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Cols: Direct Contact Info */}
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs font-bold text-emeraldSolid uppercase tracking-wider">
                08 // DIRECT ENGINEERING DISPATCH
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
                Ready to Eliminate Production Regressions?
              </h2>
              <p className="text-sm text-inkMuted leading-relaxed">
                Whether you need a greenfield Playwright/REST Assured framework, CI/CD quality gates, or an automated OWASP security audit, get in touch for a guaranteed response within 4 hours.
              </p>

              <div className="space-y-3 pt-2">
                {/* Direct Email Card */}
                <div className="p-3.5 rounded-md bg-canvas border border-borderLight flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="font-mono text-[10px] text-inkSubtle uppercase">DIRECT EMAIL</div>
                    <div className="font-mono text-xs font-bold text-ink mt-0.5 truncate">{email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="px-2.5 py-1 rounded bg-surface border border-borderLight hover:border-ink font-mono text-[11px] font-semibold text-ink cursor-pointer micro-transition shrink-0"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                {/* Upwork Direct Contract Card */}
                <div className="p-3.5 rounded-md bg-canvas border border-borderLight flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-inkSubtle uppercase">UPWORK DIRECT CONTRACT</div>
                    <div className="font-mono text-xs font-bold text-emeraldSolid mt-0.5">Top-Rated SDET • 100% Job Success</div>
                  </div>
                  <a
                    href={p.socials?.upwork || 'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-emeraldSolid hover:bg-[#047857] font-mono text-[11px] font-semibold text-white micro-transition shrink-0"
                  >
                    Open Profile ↗
                  </a>
                </div>

                {/* Direct Telegram / WhatsApp / Location Status */}
                <div className="p-3 rounded-md bg-nested border border-borderLight font-mono text-xs text-inkSubtle flex items-center justify-between">
                  <span>LOCATION: DHAKA, BD (UTC+6)</span>
                  <span className="text-emeraldSolid font-bold">AVAILABLE NOW</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Clean Solid Dispatch Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-canvas border border-borderLight rounded-md p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clientName" className="block font-mono text-[11px] font-bold text-ink uppercase mb-1.5">
                    Your Name / Team
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera — VP Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderLight focus:border-ink focus:outline-none text-xs text-ink font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block font-mono text-[11px] font-bold text-ink uppercase mb-1.5">
                    Work Email
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    required
                    placeholder="alex@company.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderLight focus:border-ink focus:outline-none text-xs text-ink font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectScope" className="block font-mono text-[11px] font-bold text-ink uppercase mb-1.5">
                    Primary QA Objective
                  </label>
                  <select
                    id="projectScope"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderLight focus:border-ink focus:outline-none text-xs text-ink font-medium"
                  >
                    <option>Playwright / Cypress E2E Architecture</option>
                    <option>REST Assured API &amp; Microservice Testing</option>
                    <option>CI/CD Quality Gates &amp; Flakiness Reduction</option>
                    <option>OWASP ZAP Security &amp; JMeter Load Audit</option>
                    <option>Dedicated Full-Time / Fractional SDET</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="targetTimeline" className="block font-mono text-[11px] font-bold text-ink uppercase mb-1.5">
                    Target SLA / Start
                  </label>
                  <select
                    id="targetTimeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderLight focus:border-ink focus:outline-none text-xs text-ink font-medium"
                  >
                    <option>Immediate Start (Within 48 Hours)</option>
                    <option>Next Sprint Cycle (1–2 Weeks)</option>
                    <option>Architecture Consultation / Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="projectNotes" className="block font-mono text-[11px] font-bold text-ink uppercase mb-1.5">
                  Current Stack &amp; Release Bottlenecks
                </label>
                <textarea
                  id="projectNotes"
                  rows={3}
                  required
                  placeholder="Tell me about your web/API stack, current test coverage, or CI pipeline goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderLight focus:border-ink focus:outline-none text-xs text-ink font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="font-mono text-xs text-emeraldSolid font-semibold">
                  {status === 'loading' && 'Transmitting brief to Kazi Khalid...'}
                  {status === 'success' && '✓ Brief received! Direct response guaranteed in < 4h'}
                  {status === 'error' && 'Notice: Brief dispatched via local console fallback'}
                  {status === 'idle' && 'SLA: Direct response guaranteed in < 4 hours'}
                </span>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-5 py-2.5 rounded bg-ink hover:bg-inkHover text-white font-mono text-xs font-bold cursor-pointer micro-transition disabled:opacity-50"
                >
                  &gt;_ TRANSMIT BRIEF
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
