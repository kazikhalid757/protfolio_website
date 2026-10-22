'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Check, 
  Copy, 
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Github,
  Linkedin,
  ShieldCheck,
  User,
  Layers,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface ContactProps {
  profile?: any;
}

export default function ContactSection({ profile }: ContactProps) {
  const p = profile || {};
  const socials = p.socials || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    scope: 'Playwright / Cypress E2E Automation',
    timeline: 'Immediate (Within 48 Hours)',
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[QA Inquiry] ${formData.scope} (${formData.timeline})`,
          message: formData.message
        })
      });
      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          scope: 'Playwright / Cypress E2E Automation',
          timeline: 'Immediate (Within 48 Hours)',
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
    <section id="contact" className="scroll-mt-24 pt-6 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Elevated Container */}
        <div className="bg-surface border border-borderLight rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-borderLight">
            
            {/* Left Column (5 Cols): Personal Dispatch & Direct Channels */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-8 bg-gradient-to-b from-surface via-surface to-nested/40">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emeraldSurface border border-emeraldBorder text-emeraldText font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>GET IN TOUCH</span>
                </div>

                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight leading-tight">
                  Let's Build Something{' '}
                  <span className="text-emeraldSolid underline decoration-emeraldBorder underline-offset-4">
                    Zero-Defect.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
                  Looking for resilient test automation frameworks, continuous CI/CD quality gates, or SDET consulting? I respond promptly within 4 hours.
                </p>

                {/* Direct Action Cards */}
                <div className="space-y-3 pt-3">
                  
                  {/* Email Card */}
                  <div className="p-4 rounded-xl bg-canvas border border-borderLight hover:border-borderHover transition-all flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-emeraldSurface border border-emeraldBorder flex items-center justify-center text-emeraldSolid shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono text-inkSubtle uppercase font-semibold">Direct Email</div>
                        <div className="font-mono text-xs sm:text-sm font-bold text-ink truncate mt-0.5">{email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="px-3 py-1.5 rounded-md bg-surface hover:bg-nested border border-borderLight text-xs font-mono font-semibold text-ink cursor-pointer transition-colors shrink-0 shadow-sm"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Upwork Direct Card */}
                  {socials.upwork && (
                    <a
                      href={socials.upwork}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-canvas border border-borderLight hover:border-emeraldBorder transition-all flex items-center justify-between gap-3 group block"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-blueSurface border border-blueBorder flex items-center justify-center text-blueSolid shrink-0">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-inkSubtle uppercase font-semibold">Upwork Profile</div>
                          <div className="text-xs sm:text-sm font-bold text-ink truncate mt-0.5 group-hover:text-emeraldSolid transition-colors">
                            Hire via Upwork Contract
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-emeraldSolid group-hover:translate-x-0.5 transition-transform shrink-0">
                        Open ↗
                      </span>
                    </a>
                  )}

                  {/* Location & Response Badge */}
                  <div className="p-3.5 rounded-xl bg-nested border border-borderLight flex items-center justify-between font-mono text-xs text-inkMuted">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emeraldSolid" />
                      <span className="font-semibold text-ink">Dhaka, Bangladesh</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emeraldSolid font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>&lt; 4h Response SLA</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Social Channels Cluster */}
              <div className="pt-4 border-t border-borderLight flex items-center gap-2">
                <span className="font-mono text-[11px] text-inkSubtle uppercase font-semibold mr-2">Profiles:</span>
                {socials.github && (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-canvas border border-borderLight hover:border-ink text-ink transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-canvas border border-borderLight hover:border-blueBorder text-ink hover:text-blueSolid transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socials.bughunters && (
                  <a
                    href={socials.bughunters}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-canvas border border-borderLight hover:border-blueBorder text-ink hover:text-blueSolid transition-colors"
                    title="Google Bug Hunters VRP"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column (7 Cols): Elegant Modern Dispatch Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-canvas">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="border-b border-borderLight pb-4">
                  <h3 className="font-display font-bold text-lg text-ink">
                    Send a Direct Project Brief
                  </h3>
                  <p className="text-xs text-inkMuted mt-0.5">
                    Fill out the scope below to get an estimated architecture plan and timeline.
                  </p>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="clientName" className="block text-xs font-bold text-ink mb-1.5">
                      Your Name / Company <span className="text-emeraldSolid">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="clientName"
                        type="text"
                        required
                        placeholder="Alex Rivera"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderLight focus:border-emeraldSolid focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-xs text-ink placeholder:text-inkSubtle transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clientEmail" className="block text-xs font-bold text-ink mb-1.5">
                      Email Address <span className="text-emeraldSolid">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="clientEmail"
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderLight focus:border-emeraldSolid focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-xs text-ink placeholder:text-inkSubtle transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope & Timeline Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="projectScope" className="block text-xs font-bold text-ink mb-1.5">
                      Project Scope
                    </label>
                    <select
                      id="projectScope"
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderLight focus:border-emeraldSolid focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-xs text-ink transition-all cursor-pointer"
                    >
                      <option>Playwright / Cypress E2E Automation</option>
                      <option>REST Assured API &amp; Microservices</option>
                      <option>CI/CD Quality Gates &amp; Sharding</option>
                      <option>OWASP ZAP &amp; Security Audits</option>
                      <option>Full-Time / Fractional SDET</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="targetTimeline" className="block text-xs font-bold text-ink mb-1.5">
                      Timeline / Urgency
                    </label>
                    <select
                      id="targetTimeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderLight focus:border-emeraldSolid focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-xs text-ink transition-all cursor-pointer"
                    >
                      <option>Immediate (Within 48 Hours)</option>
                      <option>Next Sprint (1–2 Weeks)</option>
                      <option>Next Month / Long-Term</option>
                      <option>Consultation &amp; Code Review</option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="projectNotes" className="block text-xs font-bold text-ink mb-1.5">
                    Project Details &amp; Current Bottlenecks <span className="text-emeraldSolid">*</span>
                  </label>
                  <textarea
                    id="projectNotes"
                    rows={4}
                    required
                    placeholder="Briefly describe your test suite status, frameworks in use, or immediate automation goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderLight focus:border-emeraldSolid focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-xs text-ink placeholder:text-inkSubtle transition-all resize-y"
                  />
                </div>

                {/* Status Alerts */}
                {status === 'success' && (
                  <div className="p-3.5 rounded-lg bg-emeraldSurface border border-emeraldBorder text-emeraldText text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emeraldSolid shrink-0" />
                    <span>Thank you! Your message has been sent. I will get back to you within 4 hours.</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    Something went wrong sending the message. Please email me directly at {email}.
                  </div>
                )}

                {/* Submit Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-inkSubtle flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emeraldSolid" />
                    <span>Guaranteed reply within 4 hours • Direct engineer response</span>
                  </span>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-ink hover:bg-inkHover text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{status === 'loading' ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
