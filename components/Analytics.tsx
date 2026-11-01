'use client';

import { useEffect } from 'react';

/**
 * Cookie-free, first-party analytics for the public site. Sends small events to /api/track.
 *
 *  - one "visit" per page load; the id lives only in memory (no cookies, no localStorage)
 *  - session time: a heartbeat every 15 s while the tab is visible and the visitor is active
 *  - section views: which parts of the page were scrolled into view
 *  - clicks: anything marked with data-track="name" (and optionally data-track-label="...")
 *  - respects Do Not Track and Global Privacy Control
 */

// Survive React StrictMode's double-mount in development, so a visit is counted once.
let visit: { sid: string; pageviewSent: boolean } | null = null;

function newSessionId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 20);
}

function refererHost(): string | undefined {
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    return host && host !== location.hostname.replace(/^www\./, '') ? host : undefined;
  } catch {
    return undefined;
  }
}

export default function Analytics() {
  useEffect(() => {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === '1' || nav.globalPrivacyControl === true) return;

    visit ??= { sid: newSessionId(), pageviewSent: false };
    const { sid } = visit;

    const send = (payload: Record<string, unknown>, beacon = false) => {
      const body = JSON.stringify({ sid, ...payload });
      try {
        if (beacon && nav.sendBeacon) nav.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
        else fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
      } catch {
        /* analytics must never break the page */
      }
    };

    if (!visit.pageviewSent) {
      visit.pageviewSent = true;
      const utm = new URLSearchParams(location.search).get('utm_source') || undefined;
      send({ type: 'pageview', path: location.pathname, ref: refererHost(), utm });
    }

    // ---- which sections were scrolled into view (the top 55% of the screen counts as "seen")
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            observer.unobserve(entry.target);
            send({ type: 'section', name: id });
          }
        }
      },
      { rootMargin: '0px 0px -45% 0px', threshold: 0 }
    );
    document.querySelectorAll<HTMLElement>('main section[id]').forEach((el) => el.id !== 'top' && observer.observe(el));

    // ---- clicks on anything marked data-track
    let lastClick = '';
    let lastClickAt = 0;
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest?.('[data-track]');
      const name = el?.getAttribute('data-track');
      if (!el || !name) return;
      const label = el.getAttribute('data-track-label') || undefined;
      const key = `${name}|${label}`;
      if (key === lastClick && Date.now() - lastClickAt < 600) return; // ignore double clicks
      lastClick = key;
      lastClickAt = Date.now();
      send({ type: 'click', name, label });
    };
    document.addEventListener('click', onClick, true);

    // ---- contact form: started / sent
    let formStarted = false;
    const onFocusIn = (event: FocusEvent) => {
      if (!formStarted && (event.target as Element | null)?.closest?.('#contact form')) {
        formStarted = true;
        send({ type: 'form_start' });
      }
    };
    const onMessageSent = () => send({ type: 'message_sent' });
    document.addEventListener('focusin', onFocusIn);
    window.addEventListener('portfolio:message-sent', onMessageSent);

    // ---- session time: heartbeat only while visible and recently active
    let lastActive = Date.now();
    const markActive = () => (lastActive = Date.now());
    const activity = ['pointermove', 'keydown', 'scroll', 'touchstart', 'click'] as const;
    activity.forEach((name) => window.addEventListener(name, markActive, { passive: true }));
    const heartbeat = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastActive < 60_000) send({ type: 'ping' });
    }, 15_000);
    const onHide = () => document.visibilityState === 'hidden' && send({ type: 'ping' }, true);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', () => send({ type: 'ping' }, true));

    return () => {
      observer.disconnect();
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('portfolio:message-sent', onMessageSent);
      activity.forEach((name) => window.removeEventListener(name, markActive));
      window.clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);

  return null;
}
