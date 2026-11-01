'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Download, LogOut, MonitorSmartphone, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { Badge, Button, Card, Notice, PageHeader } from '@/components/admin/ui';
import { adminHref } from '@/lib/adminPath';

interface Status {
  database: { connected: boolean; latencyMs?: number; counts?: Record<string, number>; error?: string };
  onVercel: boolean;
  email: { configured: boolean };
  auth: { passwordSet: boolean; passwordStrong: boolean; secretSet: boolean; devDefault: boolean };
  siteUrlSet: boolean;
}
interface SessionRow {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  ip: string | null;
  userAgent: string | null;
  current: boolean;
}
interface AuditRow {
  id: number;
  at: string;
  action: string;
  detail: string | null;
  ip: string | null;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** "Chrome on Windows" from a user-agent string, good enough for a device list. */
function deviceName(ua: string | null): string {
  if (!ua) return 'Unknown device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
  return os ? `${browser} on ${os}` : browser;
}

const actionLabel: Record<string, string> = {
  login_success: 'Signed in',
  login_failed: 'Wrong password',
  login_blocked: 'Sign-in blocked (too many tries)',
  logout: 'Signed out',
  content_saved: 'Saved content',
  content_imported: 'Imported a backup',
  content_reset: 'Reset to starter content',
  session_revoked: 'Signed a device out',
  sessions_revoked_all: 'Signed out everywhere',
  message_deleted: 'Deleted a message',
};

function Row({ ok, label, hint }: { ok: boolean; label: string; hint?: string }) {
  return (
    <li className="flex items-start gap-3 border-b border-rule py-3 last:border-0">
      <span className={`mt-0.5 grid place-items-center w-5 h-5 shrink-0 ${ok ? 'bg-char text-paper' : 'bg-white text-signal border border-signal'}`} aria-hidden>
        {ok ? <Check size={12} /> : <X size={12} />}
      </span>
      <span className="text-sm">
        <span className="font-medium text-char">{label}</span>
        {hint && <span className="block text-mute mt-0.5">{hint}</span>}
      </span>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-xs bg-paperDeep border border-rule px-1.5 py-0.5">{children}</code>;
}

export default function SettingsPage() {
  const { data, replaceAll, resetAll, toast, confirm, hasDirty } = useAdmin();
  const [status, setStatus] = useState<Status | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [busy, setBusy] = useState<'import' | 'reset' | 'revoke' | 'analytics' | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadSecurity = useCallback(async () => {
    const [s, a] = await Promise.all([
      fetch('/api/admin/sessions', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/audit', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
    ]);
    setSessions(s.sessions || []);
    setAudit(a.entries || []);
  }, []);

  useEffect(() => {
    fetch('/api/admin/status', { cache: 'no-store' }).then((r) => r.json()).then(setStatus).catch(() => {});
    loadSecurity();
  }, [loadSecurity]);

  const exportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      return toast('That file is not valid JSON.', 'error');
    }
    if (!(await confirm(`Replace ALL current content with the contents of “${file.name}”?`, { title: 'Restore backup', confirmLabel: 'Replace everything', danger: true }))) return;
    setBusy('import');
    const result = await replaceAll(parsed);
    setBusy(null);
    toast(result.ok ? 'Backup restored.' : [result.error, ...(result.details ?? []).slice(0, 2)].join(' '), result.ok ? 'ok' : 'error');
    loadSecurity();
  };

  const reset = async () => {
    if (hasDirty() && !(await confirm('You have unsaved edits that will be lost.', { title: 'Unsaved changes', confirmLabel: 'Continue', danger: true }))) return;
    if (!(await confirm('Replace ALL content with the original starter data? Every earlier version stays available in History, but export a backup first if unsure.', { title: 'Reset to starter content', confirmLabel: 'Reset everything', danger: true }))) return;
    setBusy('reset');
    const result = await resetAll();
    setBusy(null);
    toast(result.ok ? 'Reset to the starter content.' : result.error || 'Reset failed.', result.ok ? 'ok' : 'error');
    loadSecurity();
  };

  const revoke = async (s: SessionRow) => {
    if (!(await confirm(s.current ? 'This will sign you out on this device.' : `Sign out ${deviceName(s.userAgent)}?`, { title: 'Sign out device', confirmLabel: 'Sign out', danger: true }))) return;
    setBusy('revoke');
    const res = await fetch(`/api/admin/sessions?id=${s.id}`, { method: 'DELETE' });
    setBusy(null);
    if (!res.ok) return toast('Could not sign that device out.', 'error');
    if (s.current) return void (window.location.href = adminHref('/login'));
    toast('Device signed out.');
    loadSecurity();
  };

  const eraseAnalytics = async () => {
    if (!(await confirm('Delete every recorded visit, click and session? Your messages and content are not affected. This cannot be undone.', { title: 'Erase analytics', confirmLabel: 'Erase analytics', danger: true }))) return;
    setBusy('analytics');
    const res = await fetch('/api/admin/analytics', { method: 'DELETE' });
    setBusy(null);
    if (!res.ok) return toast('Could not erase analytics.', 'error');
    toast('Analytics erased.');
    fetch('/api/admin/status', { cache: 'no-store' }).then((r) => r.json()).then(setStatus).catch(() => {});
    loadSecurity();
  };

  const revokeAll = async () => {
    if (!(await confirm('Every device, including this one, will be signed out. Use this if you think someone else has access.', { title: 'Sign out everywhere', confirmLabel: 'Sign out everywhere', danger: true }))) return;
    await fetch('/api/admin/sessions?all=1', { method: 'DELETE' });
    window.location.href = adminHref('/login');
  };

  return (
    <>
      <PageHeader title="Settings" description="The database, how the server is set up, who is signed in, and backups." />

      <div className="space-y-8">
        {/* Database */}
        <Card className="p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-3xl font-normal text-char">Database</h2>
            {status && <Badge tone={status.database.connected ? 'dark' : 'signal'}>{status.database.connected ? 'Connected' : 'Offline'}</Badge>}
          </div>
          {!status ? (
            <p className="mt-3 text-sm text-mute">Checking…</p>
          ) : status.database.connected ? (
            <>
              <p className="mt-3 text-sm text-charSoft leading-relaxed">
                Everything you edit is saved in your Neon Postgres database, in its own <Code>portfolio</Code> schema, and the website updates the moment you
                save. Round trip: {status.database.latencyMs} ms.
              </p>
              <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-rule border border-rule">
                {[
                  ['Sections', status.database.counts?.sections],
                  ['Saved versions', status.database.counts?.revisions],
                  ['Messages', status.database.counts?.messages],
                  ['Active sessions', status.database.counts?.sessions],
                  ['Recorded visits', status.database.counts?.visits],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-white p-4">
                    <dd className="font-serif text-4xl leading-none text-char">{value ?? 0}</dd>
                    <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">{label}</dt>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <div className="mt-3">
              <Notice tone="warn" title="The database cannot be reached">
                {status.database.error || 'Check DATABASE_URL in your environment, then run "npm run db:setup".'}
              </Notice>
            </div>
          )}
        </Card>

        {/* Server setup */}
        {status && (
          <Card className="p-5 md:p-7">
            <h2 className="font-serif text-3xl font-normal text-char">Server setup</h2>
            <p className="mt-1 text-sm text-mute">Environment variables are read by the server; their values are never shown here.</p>
            <ul className="mt-4">
              <Row ok={status.database.connected} label="DATABASE_URL points at a working database" />
              <Row
                ok={status.auth.passwordSet}
                label="ADMIN_PASSWORD is set"
                hint={status.auth.devDefault ? 'Not set. A development-only password is active; it is disabled in production.' : !status.auth.passwordSet ? 'Required in production, or nobody can sign in.' : undefined}
              />
              <Row ok={status.auth.passwordStrong} label="The password is at least 12 characters" />
              <Row ok={status.auth.secretSet} label="ADMIN_SECRET is set" hint="A random string that signs login cookies. Without it, the password is used." />
              <Row ok={status.email.configured} label="RESEND_API_KEY is set (optional)" hint="Emails you a copy of every contact-form message." />
              <Row ok={status.siteUrlSet} label="Site URL known" hint="Set “Website address” in Profile, or NEXT_PUBLIC_SITE_URL, for correct SEO links." />
            </ul>
          </Card>
        )}

        {/* Security */}
        <Card className="p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-3xl font-normal text-char">Security</h2>
            <Button variant="danger" size="sm" onClick={revokeAll} disabled={busy === 'revoke'}>
              <LogOut size={14} aria-hidden /> Sign out everywhere
            </Button>
          </div>

          <h3 className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-signal">Signed-in devices</h3>
          <ul className="mt-2 border-t border-char">
            {sessions.length === 0 && <li className="py-4 text-sm text-mute">Loading…</li>}
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 border-b border-rule py-3">
                <MonitorSmartphone size={18} className="shrink-0 text-mute" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-char">
                    {deviceName(s.userAgent)} {s.current && <Badge tone="dark">This device</Badge>}
                  </p>
                  <p className="truncate text-xs text-mute">
                    {s.ip} · signed in {when(s.createdAt)} · last active {when(s.lastSeenAt)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => revoke(s)}>
                  Sign out
                </Button>
              </li>
            ))}
          </ul>

          <h3 className="mt-7 font-mono text-xs uppercase tracking-[0.14em] text-signal">Recent activity</h3>
          <ul className="mt-2 border-t border-char">
            {audit.length === 0 && <li className="py-4 text-sm text-mute">No activity yet.</li>}
            {audit.map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5 text-sm">
                <span className={e.action === 'login_failed' || e.action === 'login_blocked' ? 'font-semibold text-signal' : 'text-char'}>
                  {actionLabel[e.action] || e.action}
                  {e.detail && <span className="text-mute font-normal"> · {e.detail}</span>}
                </span>
                <span className="font-mono text-xs text-mute">
                  {when(e.at)} {e.ip && `· ${e.ip}`}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Deploy guide */}
        <Card className="p-5 md:p-7">
          <h2 className="font-serif text-3xl font-normal text-char">Deploying on Vercel</h2>
          <ol className="mt-4 space-y-4 text-sm text-charSoft leading-relaxed list-decimal pl-5 marker:font-mono marker:text-signal">
            <li>
              <strong className="text-char">Create the tables once</strong> from your computer: <Code>npm run db:setup</Code>. It also makes a restricted database user,
              <Code>portfolio_app</Code>, that can only touch the portfolio's own tables.
            </li>
            <li>
              <strong className="text-char">Add environment variables</strong> in Vercel → Project Settings → Environment Variables: <Code>DATABASE_URL</Code> (the
              <Code>portfolio_app</Code> connection string from your <Code>.env.local</Code>), <Code>ADMIN_PASSWORD</Code>, and <Code>ADMIN_SECRET</Code>. Never add the
              owner URL (<Code>DATABASE_ADMIN_URL</Code>) to Vercel.
            </li>
            <li>
              <strong className="text-char">Optional:</strong> <Code>RESEND_API_KEY</Code> and <Code>CONTACT_TO_EMAIL</Code> to also get each message by email.
            </li>
            <li>
              <strong className="text-char">Redeploy</strong>. Edits made here show on the live site immediately; no redeploy needed for content.
            </li>
          </ol>
        </Card>

        {/* Backup */}
        <Card className="p-5 md:p-7">
          <h2 className="font-serif text-3xl font-normal text-char">Backup & restore</h2>
          <p className="mt-1 text-sm text-mute">Your whole site content as one JSON file. Restoring is all-or-nothing and checked before anything is written.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={exportJson} disabled={!data}>
              <Download size={16} aria-hidden /> Export JSON
            </Button>
            <Button variant="outline" onClick={() => fileInput.current?.click()} busy={busy === 'import'}>
              <Upload size={16} aria-hidden /> Import JSON
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) importJson(file);
              }}
            />
          </div>
        </Card>

        {/* Analytics data */}
        <Card className="p-5 md:p-7">
          <h2 className="font-serif text-3xl font-normal text-char">Analytics data</h2>
          <p className="mt-1 text-sm text-mute">
            Visits are stored anonymously in your database (no IP addresses, no cookies) and kept for about 14 months. You can erase everything at any time.
          </p>
          <div className="mt-5">
            <Button variant="danger" onClick={eraseAnalytics} busy={busy === 'analytics'}>
              <Trash2 size={16} aria-hidden /> Erase all analytics
            </Button>
          </div>
        </Card>

        {/* Danger */}
        <Card tone="danger" className="p-5 md:p-7">
          <h2 className="font-serif text-3xl font-normal text-char">Reset</h2>
          <p className="mt-1 text-sm text-mute">Replace everything with the original starter content that shipped with the project. Earlier versions remain in History.</p>
          <div className="mt-5">
            <Button variant="danger" onClick={reset} busy={busy === 'reset'}>
              <RotateCcw size={16} aria-hidden /> Reset to starter content
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
