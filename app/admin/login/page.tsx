'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { ADMIN_BASE } from '@/lib/adminPath';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<{ configured: boolean; devDefault: boolean } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setExpired(new URLSearchParams(window.location.search).has('expired'));
    fetch('/api/auth')
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Sign-in failed.');
        setBusy(false);
        return;
      }
      // Only ever send people to another admin page.
      const next = new URLSearchParams(window.location.search).get('next');
      window.location.href = next && (next === ADMIN_BASE || next.startsWith(ADMIN_BASE + '/')) ? next : ADMIN_BASE;
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-char grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 bg-char text-paper" aria-hidden>
            <Lock size={20} />
          </span>
          <div className="leading-none">
            <p className="font-serif text-3xl">Admin</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">Portfolio CMS</p>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white border border-char shadow-[8px_8px_0_0_#121212] p-6 md:p-8">
          <h1 className="font-serif font-normal text-4xl leading-tight text-char">Sign in</h1>
          <p className="mt-2 text-sm text-mute">Enter the admin password to edit your portfolio.</p>
          {expired && (
            <p role="status" className="mt-4 border-l-4 border-char bg-paperDeep px-3 py-2 text-sm text-charSoft">
              Your session ended, so please sign in again.
            </p>
          )}

          <label htmlFor="password" className="mt-6 block text-sm font-semibold text-char">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoFocus
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              className="w-full h-12 pl-3 pr-12 bg-white border border-char/40 text-char focus:outline-none focus:border-signal focus:ring-2 focus:ring-signal/25"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 w-12 grid place-items-center text-mute hover:text-char"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p id="login-error" role="alert" className="mt-3 border-l-4 border-signal bg-paper px-3 py-2 text-sm font-medium text-char">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !password}
            className="mt-6 w-full h-12 inline-flex items-center justify-center gap-2 bg-char text-paper font-medium hover:bg-signal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Signing in…' : 'Sign in'} {!busy && <ArrowRight size={16} aria-hidden />}
          </button>
        </form>

        {info && !info.configured && (
          <p className="mt-6 border-l-4 border-signal bg-white px-4 py-3 text-sm text-charSoft">
            <strong className="text-char">Login is not set up.</strong> Add an <code className="font-mono text-xs">ADMIN_PASSWORD</code>{' '}
            environment variable (Vercel: Project Settings, Environment Variables), then redeploy.
          </p>
        )}
        {info?.devDefault && (
          <p className="mt-6 border-l-4 border-char bg-paperDeep px-4 py-3 text-sm text-charSoft">
            Development mode: no <code className="font-mono text-xs">ADMIN_PASSWORD</code> is set, so the temporary password{' '}
            <code className="font-mono text-xs">admin123</code> works. This fallback is disabled in production.
          </p>
        )}

        <p className="mt-8 text-center text-sm">
          <a href="/" className="text-mute underline underline-offset-4 decoration-rule hover:text-char">
            ← Back to the website
          </a>
        </p>
      </div>
    </main>
  );
}
