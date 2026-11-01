'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

import type { PortfolioData, SectionName } from '@/lib/schemas';
import { ADMIN_LOGIN_EXPIRED } from '@/lib/adminPath';

export type Versions = Partial<Record<SectionName, number>>;

export interface SaveResult {
  ok: boolean;
  error?: string;
  /** Someone else saved this section since it was loaded. */
  conflict?: boolean;
  /** Field-level problems reported by the server. */
  details?: string[];
}
interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface AdminContextValue {
  data: PortfolioData | null;
  versions: Versions;
  loading: boolean;
  error: string | null;
  unread: number;
  reload: () => Promise<void>;
  refreshUnread: () => Promise<void>;
  saveSection: (section: SectionName, value: unknown) => Promise<SaveResult>;
  replaceAll: (next: unknown) => Promise<SaveResult>;
  resetAll: () => Promise<SaveResult>;
  toast: (message: string, kind?: 'ok' | 'error') => void;
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
  setDirty: (key: string, dirty: boolean) => void;
  hasDirty: () => boolean;
}

const Ctx = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useAdmin must be used inside <AdminProvider>');
  return value;
}

class ApiError extends Error {
  status: number;
  details?: string[];
  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(url: string, init?: RequestInit) {
  const res = await fetch(url, { cache: 'no-store', ...init });
  if (res.status === 401) {
    window.location.href = ADMIN_LOGIN_EXPIRED;
    throw new ApiError('Your session has ended. Please sign in again.', 401);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.error || `Request failed (${res.status})`, res.status, json.details);
  return json;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [versions, setVersions] = useState<Versions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; message: string; kind: 'ok' | 'error' }[]>([]);
  const [dialog, setDialog] = useState<null | (ConfirmOptions & { message: string; resolve: (v: boolean) => void })>(null);
  const dirty = useRef(new Set<string>());

  const toast = useCallback((message: string, kind: 'ok' | 'error' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 4500);
  }, []);

  const confirm = useCallback(
    (message: string, options: ConfirmOptions = {}) =>
      new Promise<boolean>((resolve) => setDialog({ message, resolve, ...options })),
    []
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await request('/api/admin/portfolio');
      setData(json.data);
      setVersions(json.versions || {});
    } catch (e: any) {
      // A 401 is already redirecting to the login page; it is not a database problem, so show no banner.
      if (e?.status !== 401) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUnread = useCallback(async () => {
    try {
      const json = await request('/api/admin/messages');
      setUnread((json.messages || []).filter((m: any) => !m.read).length);
    } catch {}
  }, []);

  useEffect(() => {
    reload();
    refreshUnread();
  }, [reload, refreshUnread]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const failure = (e: unknown): SaveResult => {
    const err = e as ApiError;
    return { ok: false, error: err.message, conflict: err.status === 409, details: err.details };
  };

  const saveSection = useCallback(
    async (section: SectionName, value: unknown): Promise<SaveResult> => {
      try {
        const json = await request('/api/admin/portfolio', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, value, expectedVersion: versions[section] ?? null }),
        });
        setData((d) => (d ? { ...d, [section]: json.value } : d));
        setVersions((v) => ({ ...v, [section]: json.version }));
        return { ok: true };
      } catch (e) {
        return failure(e);
      }
    },
    [versions]
  );

  const applyAll = (json: any): SaveResult => {
    setData(json.data);
    setVersions(json.versions || {});
    return { ok: true };
  };

  const replaceAll = useCallback(async (next: unknown): Promise<SaveResult> => {
    try {
      return applyAll(
        await request('/api/admin/portfolio', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        })
      );
    } catch (e) {
      return failure(e);
    }
  }, []);

  const resetAll = useCallback(async (): Promise<SaveResult> => {
    try {
      return applyAll(await request('/api/admin/portfolio/reset', { method: 'POST' }));
    } catch (e) {
      return failure(e);
    }
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      data,
      versions,
      loading,
      error,
      unread,
      reload,
      refreshUnread,
      saveSection,
      replaceAll,
      resetAll,
      toast,
      confirm,
      setDirty: (key, isDirty) => {
        if (isDirty) dirty.current.add(key);
        else dirty.current.delete(key);
      },
      hasDirty: () => dirty.current.size > 0,
    }),
    [data, versions, loading, error, unread, reload, refreshUnread, saveSection, replaceAll, resetAll, toast, confirm]
  );

  const close = (answer: boolean) => {
    dialog?.resolve(answer);
    setDialog(null);
  };

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[min(24rem,calc(100vw-2rem))]" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={`flex items-start gap-3 border px-4 py-3 text-sm shadow-[4px_4px_0_0_#121212] ${
              t.kind === 'error' ? 'bg-white border-signal text-char' : 'bg-char border-char text-paper'
            }`}
          >
            {t.kind === 'error' ? (
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-signal" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-signal" />
            )}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              aria-label="Dismiss"
              className="shrink-0 opacity-60 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {dialog && (
        <div
          className="fixed inset-0 z-[110] grid place-items-center bg-char/50 p-4"
          onClick={() => close(false)}
          onKeyDown={(e) => e.key === 'Escape' && close(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label={dialog.title || 'Please confirm'}
            className="w-full max-w-md bg-white border border-char shadow-[8px_8px_0_0_#121212] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-3xl font-normal text-char">{dialog.title || 'Are you sure?'}</h2>
            <p className="mt-3 text-mute leading-relaxed">{dialog.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                autoFocus
                onClick={() => close(false)}
                className="h-10 px-4 border border-char text-char text-sm font-medium hover:bg-char hover:text-paper transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => close(true)}
                className={`h-10 px-4 text-sm font-medium text-white transition-colors ${
                  dialog.danger ? 'bg-signal hover:bg-char' : 'bg-char hover:bg-signal'
                }`}
              >
                {dialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
