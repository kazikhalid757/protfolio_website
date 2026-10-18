'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  Github, 
  Linkedin, 
  ExternalLink,
  Lock,
  ShieldCheck,
  Terminal
} from 'lucide-react';

interface ContactFooterProps {
  profile?: any;
}

export default function ContactFooter({ profile }: ContactFooterProps) {
  const p = profile || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer id="contact" className="bg-zinc-950 pt-16 pb-12 border-t border-zinc-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-850">
          {/* Left: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
                Direct Communication
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                Get In Touch
              </h2>
              <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2">
                Available for Senior SDET / QA Architect roles, distributed framework contracts, and CI/CD quality engineering consultations.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Email */}
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate">
                  <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                  <a href={`mailto:${p.email || 'kazikhalid757@gmail.com'}`} className="text-zinc-200 hover:text-emerald-400 truncate">
                    {p.email || 'kazikhalid757@gmail.com'}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(p.email || 'kazikhalid757@gmail.com', 'email')}
                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  title="Copy Email"
                >
                  {copiedType === 'email' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Phone */}
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                  <a href={`tel:${p.phone || '+8801580338155'}`} className="text-zinc-200 hover:text-emerald-400">
                    {p.phone || '+8801580338155'}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(p.phone || '+8801580338155', 'phone')}
                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  title="Copy Phone"
                >
                  {copiedType === 'phone' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Location */}
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-2.5 text-zinc-300">
                <MapPin size={15} className="text-emerald-400 flex-shrink-0" />
                <span>{p.location || 'Mirpur-2, Dhaka - 1216, Bangladesh'}</span>
              </div>
            </div>

            {/* Social Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {p.socials?.github && (
                <a
                  href={p.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-zinc-700"
                >
                  <Github size={13} />
                  <span>GitHub</span>
                </a>
              )}
              {p.socials?.linkedin && (
                <a
                  href={p.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-zinc-700"
                >
                  <Linkedin size={13} />
                  <span>LinkedIn</span>
                </a>
              )}
              {p.socials?.upwork && (
                <a
                  href={p.socials.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 hover:border-zinc-700"
                >
                  <span>Upwork Profile</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>

          {/* Right: Clean Inquiry Form */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded p-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-1">Send Technical Inquiry</h3>
            <p className="text-xs font-mono text-zinc-400 mb-5">
              Messages are stored securely in Kazi&apos;s admin portal inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase">Sender Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="elena@enterprise.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase">Subject / Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Lead SDET Architecture / Playwright Framework Migration"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase">Message / Requirements *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your current CI bottlenecks, test suite flakiness, or open role requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 px-4 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span>TRANSMITTING...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>TRANSMIT MESSAGE DIRECTLY</span>
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded flex items-center gap-2">
                  <Check size={14} />
                  <span>Message delivered to Kazi&apos;s verified inbox. Response expected within 24 hours.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded">
                  Transmission failed. Please email directly to kazikhalid757@gmail.com.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {p.name || 'Kazi Khalid Hasan Tamim'}. All systems deterministic.
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <Lock size={12} />
              <span>Admin Control Panel (CMS)</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
