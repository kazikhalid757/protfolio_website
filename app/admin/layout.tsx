'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  CheckCircle, 
  Briefcase, 
  Layers, 
  Award, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Bug,
  ShieldCheck,
  Database
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/auth')
        .then(res => res.json())
        .then(data => {
          if (!data.authenticated) {
            router.push('/admin/login');
          }
        })
        .catch(() => router.push('/admin/login'));

      fetch('/api/portfolio')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.messages)) {
            const unread = data.messages.filter((m: any) => !m.read).length;
            setUnreadCount(unread);
          }
        })
        .catch(() => {});
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Profile & Hero', href: '/admin/profile', icon: User },
    { name: 'Projects Systems', href: '/admin/projects', icon: FolderGit2 },
    { name: 'Technical Skills', href: '/admin/skills', icon: CheckCircle },
    { name: 'Experience Log', href: '/admin/experience', icon: Briefcase },
    { name: 'Engineering Services', href: '/admin/services', icon: Layers },
    { name: 'Awards & Certs', href: '/admin/awards', icon: Award },
    { 
      name: 'Inquiry Inbox', 
      href: '/admin/messages', 
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { name: 'Data & Backup', href: '/admin/settings', icon: Settings },
  ];

  const currentSectionName = navItems.find(i => i.href === pathname)?.name || 'Admin Workspace';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '270px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
        }}
        className="admin-sidebar-desktop"
      >
        <div>
          {/* Brand header */}
          <div 
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Link 
              href="/admin" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
            >
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Bug size={19} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', lineHeight: 1.1 }}>
                  KAZI.SDET
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  CMS CONTROL
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isActive ? '#0f172a' : '#475569',
                    backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                    borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={17} color={isActive ? '#059669' : '#64748b'} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span 
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        lineHeight: 1
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.72rem',
              color: '#64748b',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Database size={13} color="#059669" />
            <span>data/portfolio.json [SYNCED]</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ExternalLink size={13} />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#dc2626' }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-ghost btn-sm admin-mobile-toggle"
              style={{ display: 'none' }}
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Admin</span>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>/</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                {currentSectionName}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="tech-stamp tech-stamp-emerald" style={{ display: 'none' }} id="top-status-pill">
              ● CMS LIVE
            </span>

            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              <ExternalLink size={13} />
              <span>Live Website</span>
            </Link>

            <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Log Out">
              <LogOut size={15} color="#dc2626" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          #top-status-pill {
            display: inline-flex !important;
          }
        }
        @media (max-width: 991px) {
          .admin-sidebar-desktop {
            display: none !important;
          }
          .admin-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
