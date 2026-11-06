'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Award,
  BarChart3,
  Briefcase,
  ExternalLink,
  FileText,
  FolderGit2,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { AdminProvider, useAdmin } from '@/components/admin/AdminContext';
import { ADMIN_BASE, adminHref, toPublicAdminPath } from '@/lib/adminPath';

const groups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: ADMIN_BASE, icon: LayoutDashboard },
      { name: 'Analytics', href: adminHref('/analytics'), icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Profile & hero', href: adminHref('/profile'), icon: User },
      { name: 'Resume', href: adminHref('/resume'), icon: FileText },
      { name: 'Experience', href: adminHref('/experience'), icon: Briefcase },
      { name: 'Products', href: adminHref('/products'), icon: Package },
      { name: 'Services', href: adminHref('/services'), icon: Layers },
      { name: 'Skills', href: adminHref('/skills'), icon: Sparkles },
      { name: 'Projects', href: adminHref('/projects'), icon: FolderGit2 },
      { name: 'Awards & certs', href: adminHref('/awards'), icon: Award },
    ],
  },
  { label: 'Inbox', items: [{ name: 'Messages', href: adminHref('/messages'), icon: MessageSquare, badge: true }] },
  { label: 'System', items: [{ name: 'Settings', href: adminHref('/settings'), icon: Settings }] },
];
const allItems = groups.flatMap((g) => g.items);

function StoragePill() {
  const { error, data } = useAdmin();
  const offline = !!error && !data;
  return (
    <Link
      href={adminHref('/settings')}
      title={offline ? 'The database cannot be reached' : 'Content is saved in your Neon Postgres database'}
      className="hidden sm:inline-flex items-center gap-2 border border-rule bg-white px-3 h-9 font-mono text-[11px] uppercase tracking-[0.12em] text-charSoft hover:border-char"
    >
      <span className={`w-2 h-2 ${offline ? 'bg-signal' : 'bg-char'}`} aria-hidden />
      {offline ? 'Database offline' : 'Neon database'}
    </Link>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { unread, hasDirty, confirm, data, error, loading, reload } = useAdmin();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // usePathname() may report the internal /admin path or the public one; compare on the public path either way.
  const here = toPublicAdminPath(pathname);
  const current = allItems.find((i) => (i.href === ADMIN_BASE ? here === ADMIN_BASE : here.startsWith(i.href)));

  // Ask before leaving a page with unsaved edits.
  const guard = async (e: React.MouseEvent, href: string) => {
    if (!hasDirty() || href === toPublicAdminPath(pathname)) return;
    e.preventDefault();
    if (await confirm('You have unsaved changes on this page. Leave without saving?', { title: 'Unsaved changes', confirmLabel: 'Leave page', danger: true })) {
      router.push(href);
    }
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
    window.location.href = adminHref('/login');
  };

  const nav = (
    <nav aria-label="Admin" className="px-3 py-4 space-y-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.href === current?.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => guard(e, item.href)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 h-11 px-3 text-sm font-medium border-l-[3px] transition-colors ${
                      active ? 'bg-paperDeep text-char border-signal' : 'text-charSoft border-transparent hover:bg-paperDeep'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} className={active ? 'text-signal' : 'text-mute'} aria-hidden />
                      {item.name}
                    </span>
                    {'badge' in item && unread > 0 && (
                      <span className="bg-signal text-white text-[11px] font-bold leading-none px-1.5 py-1">{unread}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <Link href={ADMIN_BASE} onClick={(e) => guard(e, ADMIN_BASE)} className="flex items-center gap-3">
      <span className="grid place-items-center w-10 h-10 bg-char text-paper font-mono text-sm font-semibold" aria-hidden>
        {(data?.profile?.shortName || 'KT')
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()}
      </span>
      <span className="leading-none">
        <span className="block font-serif text-2xl text-char">Admin</span>
        <span className="block mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">Portfolio CMS</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-paper text-char lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 sticky top-0 h-screen border-r border-rule bg-white">
        <div className="h-16 flex items-center px-5 border-b border-rule">{brand}</div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        <div className="p-3 border-t border-rule space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 h-10 px-3 text-sm font-medium text-charSoft hover:bg-paperDeep">
            <ExternalLink size={16} aria-hidden /> View website
          </a>
          <button onClick={logout} className="flex w-full items-center gap-3 h-10 px-3 text-sm font-medium text-charSoft hover:bg-paperDeep hover:text-signal">
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-char/50" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-[17.5rem] max-w-[85vw] bg-white border-r border-char flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-rule">
              {brand}
              <button onClick={() => setDrawer(false)} aria-label="Close menu" className="grid place-items-center w-11 h-11 -mr-3">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
            <div className="p-3 border-t border-rule">
              <button onClick={logout} className="flex w-full items-center gap-3 h-11 px-3 text-sm font-medium text-charSoft hover:text-signal">
                <LogOut size={16} aria-hidden /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 bg-paper border-b border-rule">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden grid place-items-center w-11 h-11 -ml-3 text-char">
              <Menu size={22} />
            </button>
            <p className="truncate text-sm">
              <span className="text-mute">Admin</span>
              <span className="mx-2 text-rule">/</span>
              <span className="font-semibold text-char">{current?.name || 'Workspace'}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StoragePill />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-3 border border-char text-sm font-medium text-char hover:bg-char hover:text-paper transition-colors"
            >
              <ExternalLink size={14} aria-hidden /> <span className="hidden sm:inline">View site</span>
            </a>
          </div>
        </header>

        {error && !data && (
          <div role="alert" className="border-b border-signal bg-white px-4 sm:px-6 lg:px-8 py-3 text-sm text-charSoft">
            <strong className="text-char">Cannot reach the database.</strong> {error}{' '}
            <button type="button" onClick={reload} disabled={loading} className="font-medium text-char underline underline-offset-2 decoration-signal disabled:opacity-50">
              {loading ? 'Trying…' : 'Try again'}
            </button>
            {' · '}
            <Link href={adminHref('/settings')} className="font-medium text-char underline underline-offset-2 decoration-signal">
              Check the setup
            </Link>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl w-full">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (toPublicAdminPath(pathname) === adminHref('/login')) return <>{children}</>;
  return (
    <AdminProvider>
      <Shell>{children}</Shell>
    </AdminProvider>
  );
}
