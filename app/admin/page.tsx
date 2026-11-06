'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, CircleAlert } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { Badge, Card, PageHeader, Spinner } from '@/components/admin/ui';
import { adminHref } from '@/lib/adminPath';
import { hasResume } from '@/lib/resume/document';

interface Status {
  database: { connected: boolean; latencyMs?: number };
  email: { configured: boolean };
  auth: { passwordSet: boolean; passwordStrong: boolean; devDefault: boolean };
  siteUrlSet: boolean;
}

export default function Dashboard() {
  const { data, loading, unread } = useAdmin();
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch('/api/admin/status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  const checks = useMemo(() => {
    if (!data) return [];
    const p = data.profile;
    const products = data.products || [];
    const list: { ok: boolean; label: string; fix: string; href: string }[] = [
      { ok: !!p.avatar, label: 'Profile photo set', fix: 'Add a photo path or URL', href: adminHref('/profile') },
      { ok: hasResume(data.resume), label: 'Resume ready to download', fix: 'Fill in your resume and turn on the download', href: adminHref('/resume') },
      { ok: (p.bio || '').length >= 80, label: 'Bio is a few sentences long', fix: 'Write a bio of at least two sentences', href: adminHref('/profile') },
      { ok: !!(p.socials?.linkedin && p.socials?.github), label: 'LinkedIn and GitHub linked', fix: 'Add both links', href: adminHref('/profile') },
      {
        ok: (data.experiences || []).some((e) => /present/i.test(e.period || '')),
        label: 'A current job is marked “Present”',
        fix: 'Mark your current job so the hero can mention it',
        href: adminHref('/experience'),
      },
      {
        ok: products.length > 0 && products.every((x) => x.problem && x.built),
        label: 'Every product has a problem and a result',
        fix: 'Fill “The problem” and “What you built” for each product',
        href: adminHref('/products'),
      },
      {
        ok: (data.projects || []).every((x) => x.github || x.liveDemo),
        label: 'Every project links somewhere',
        fix: 'Add a GitHub link to projects that have none',
        href: adminHref('/projects'),
      },
    ];
    if (status) {
      list.push(
        { ok: status.database.connected, label: 'Database connected', fix: 'Check DATABASE_URL (Settings explains how)', href: adminHref('/settings') },
        { ok: !!p.siteUrl || status.siteUrlSet, label: 'Website address known (SEO)', fix: 'Set the Website address in Profile', href: adminHref('/profile') },
        { ok: status.auth.passwordSet, label: 'Admin password set in the environment', fix: 'Set ADMIN_PASSWORD (Settings explains how)', href: adminHref('/settings') },
        { ok: status.auth.passwordStrong, label: 'Admin password is strong (12+ characters)', fix: 'Use a longer password', href: adminHref('/settings') },
        { ok: status.email.configured, label: 'Email alerts for new messages (optional)', fix: 'Add RESEND_API_KEY to get an email for each message', href: adminHref('/settings') }
      );
    }
    return list;
  }, [data, status]);

  if (loading && !data) return <Spinner />;
  if (!data) return null;

  const skillCount = (data.skills || []).reduce((n: number, g) => n + (g.items?.length || 0), 0);
  const stats = [
    { label: 'Jobs', value: (data.experiences || []).length, href: adminHref('/experience') },
    { label: 'Products', value: (data.products || []).length, href: adminHref('/products') },
    { label: 'Services', value: (data.services || []).length, href: adminHref('/services') },
    { label: 'Skills', value: skillCount, href: adminHref('/skills') },
    { label: 'Projects', value: (data.projects || []).length, href: adminHref('/projects') },
    { label: 'Awards & certs', value: (data.awards || []).length + (data.certifications || []).length, href: adminHref('/awards') },
  ];
  const done = checks.filter((c) => c.ok).length;
  const todo = checks.filter((c) => !c.ok);

  return (
    <>
      <PageHeader
        title={`Hello, ${(data.profile?.shortName || 'there').split(' ')[0]}.`}
        description="Everything on your public website is edited here. Pick a section on the left, change it, and save."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-rule border border-rule">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group bg-white p-5 hover:bg-paperDeep transition-colors">
            <p className="font-serif text-5xl leading-none text-char">{s.value}</p>
            <p className="mt-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.12em] text-mute">
              {s.label}
              <ArrowUpRight size={14} className="group-hover:text-signal" aria-hidden />
            </p>
          </Link>
        ))}
      </div>

      {unread > 0 && (
        <Link
          href={adminHref('/messages')}
          className="mt-6 flex items-center justify-between gap-4 border border-signal bg-white px-5 py-4 hover:bg-paperDeep transition-colors"
        >
          <span className="font-semibold text-char">
            {unread} unread message{unread > 1 ? 's' : ''} in your inbox
          </span>
          <ArrowUpRight size={18} className="text-signal" aria-hidden />
        </Link>
      )}

      <Card className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-4">
          <h2 className="font-serif text-3xl font-normal text-char">Site health</h2>
          <Badge tone={todo.length ? 'neutral' : 'dark'}>
            {done}/{checks.length} ready
          </Badge>
        </div>
        {!status && <p className="px-5 py-4 text-sm text-mute">Checking server setup…</p>}
        <ul>
          {[...todo, ...checks.filter((c) => c.ok)].map((c) => (
            <li key={c.label} className="border-b border-rule last:border-0">
              <Link href={c.href} className="flex items-center gap-4 px-5 py-3.5 hover:bg-paper transition-colors">
                <span
                  className={`grid place-items-center w-6 h-6 shrink-0 ${c.ok ? 'bg-char text-paper' : 'bg-signal text-white'}`}
                  aria-hidden
                >
                  {c.ok ? <Check size={14} /> : <CircleAlert size={14} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-medium ${c.ok ? 'text-mute' : 'text-char'}`}>{c.label}</span>
                  {!c.ok && <span className="block text-xs text-mute mt-0.5">{c.fix}</span>}
                </span>
                {!c.ok && <ArrowUpRight size={16} className="shrink-0 text-mute" aria-hidden />}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
