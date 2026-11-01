'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { safeUrl } from '@/lib/safeUrl';
import type { Profile } from '@/lib/schemas';

interface ContactSectionProps {
  profile: Profile;
}

const socialLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  upwork: 'Upwork',
  bughunters: 'Google Bug Hunters',
};

const topics = ['Full-time role', 'Freelance', 'Test my product', 'Other'];

const labelClass = 'block mb-1 font-mono text-xs uppercase tracking-[0.14em] text-mute';

const fieldClass =
  'w-full bg-transparent border-0 border-b-2 border-char/25 rounded-none px-0 py-2 text-base text-char placeholder:text-mute/60 focus:outline-none focus:border-signal transition-colors';

export default function ContactSection({ profile }: ContactSectionProps) {
  const p = profile;
  const socials = Object.entries(p.socials || {}).filter(([k, v]) => socialLabels[k] && v);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [sentName, setSentName] = useState('');
  // When the form appeared: a human needs a few seconds to write a message, a bot does not.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: form.subject.trim() || topic, elapsed: Date.now() - shownAt.current }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setSentName(form.name.split(' ')[0]);
      setStatus('success');
      window.dispatchEvent(new CustomEvent('portfolio:message-sent'));
      setForm({ name: '', email: '', subject: '', message: '', website: '' });
      setTopic('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mute mb-5">
              <span className="text-signal">07</span>
              <span className="mx-3 inline-block w-8 h-px bg-rule align-middle" />
              Contact
            </p>
            <h2 className="font-serif font-normal text-5xl md:text-6xl leading-[1.05] tracking-tight text-char">
              Got a build that <span className="italic text-signal">keeps breaking</span>?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-mute">
              I&apos;m open to full-time QA and automation roles and to contract work. Tell me what you ship and I&apos;ll tell
              you where I&apos;d look first.
            </p>

            <div className="mt-8 space-y-3">
              {p.email && (
                <a href={`mailto:${p.email}`} data-track="contact_email" className="flex items-center gap-3 min-h-11 break-all text-char font-medium hover:text-signal">
                  <Mail size={18} /> {p.email}
                </a>
              )}
              {p.phone && (
                <a data-track="contact_phone" href={`tel:${String(p.phone).replace(/[^+\d]/g, '')}`} className="flex items-center gap-3 min-h-11 text-char font-medium hover:text-signal">
                  <Phone size={18} /> {p.phone}
                </a>
              )}
              {p.location && (
                <p className="flex items-center gap-3 text-mute">
                  <MapPin size={18} /> {p.location}
                </p>
              )}
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {socials.map(([k, v]) => (
                <li key={k}>
                  <a
                    href={safeUrl(v)}
                    data-track={`social_${k}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-10 px-4 border border-char text-sm font-medium text-char hover:bg-char hover:text-paper transition-colors"
                  >
                    {socialLabels[k]} <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-char shadow-[6px_6px_0_0_#121212]">
              <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 border-b border-char font-mono text-xs uppercase tracking-[0.14em]">
                <span className="flex items-center gap-2.5 text-char">
                  <span className="w-2 h-2 bg-signal" aria-hidden />
                  New message
                </span>
                <span className="text-mute">To: {p.shortName || 'Kazi Tamim'}</span>
              </div>

              {status === 'success' ? (
                <div role="status" aria-live="polite" className="px-5 md:px-8 py-12">
                  <CheckCircle2 size={36} className="text-signal" aria-hidden />
                  <h3 className="mt-6 font-serif font-normal text-4xl md:text-5xl leading-tight text-char">
                    Message sent{sentName ? `, thanks ${sentName}` : ''}.
                  </h3>
                  <p className="mt-4 text-mute leading-relaxed max-w-md">
                    I read every message myself and will reply to the email you gave.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 h-11 px-5 border border-char text-char font-medium hover:bg-char hover:text-paper transition-colors"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-5 md:px-8 py-6 space-y-6">
                  <fieldset>
                    <legend className="mb-2.5 font-mono text-xs uppercase tracking-[0.14em] text-mute">
                      What&apos;s this about?
                    </legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup">
                      {topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={topic === t}
                          onClick={() => setTopic(topic === t ? '' : t)}
                          className={`h-10 sm:h-9 px-3.5 text-[13px] font-medium border transition-colors ${
                            topic === t
                              ? 'bg-char text-paper border-char'
                              : 'bg-white text-char border-char/30 hover:border-char'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <label className="block">
                      <span className={labelClass}>
                        <span className="text-signal">01</span> Name
                      </span>
                      <input
                        required
                        autoComplete="name"
                        className={fieldClass}
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>
                        <span className="text-signal">02</span> Email
                      </span>
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        className={fieldClass}
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@company.com"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className={labelClass}>
                      <span className="text-signal">03</span> Message
                    </span>
                    <textarea
                      required
                      rows={3}
                      className={`${fieldClass} resize-y min-h-[5.5rem]`}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell me about your product and what keeps breaking."
                    />
                  </label>

                  {/* Honeypot: hidden from people, filled in by bots. */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                    </label>
                  </div>

                  {status === 'error' && (
                    <p role="alert" className="border border-signal bg-signal/10 px-4 py-3 text-sm font-medium text-char">
                      {error}. You can also email me at{' '}
                      <a href={`mailto:${p.email}`} className="underline underline-offset-2 decoration-signal">
                        {p.email}
                      </a>
                      .
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center gap-2 h-11 px-6 bg-char text-paper font-medium hover:bg-signal transition-colors disabled:opacity-60 disabled:cursor-wait"
                    >
                      {status === 'loading' ? 'Sending…' : 'Send message'}
                      <Send size={16} aria-hidden />
                    </button>
                    <p className="text-xs text-mute">Your email is only used to reply to you.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
