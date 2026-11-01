'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ADMIN_LOGIN_EXPIRED } from '@/lib/adminPath';
import type { AnalyticsReport } from '@/lib/analytics';
import { ChartCard, CHART, ColumnChart, RankedBars, StatTile, TimeSeriesChart, fmtDay, fmtDuration, fmtNumber } from '@/components/admin/charts';
import { Button, Card, Notice, PageHeader, Spinner } from '@/components/admin/ui';

const RANGES = [7, 30, 90] as const;

/** Friendly names for the data-track markers on the public site. */
const CLICK_NAMES: Record<string, string> = {
  hire_me: 'Hire me (nav button)',
  hire_service: 'Hire me for this (Services)',
  see_work: 'See my work',
  cv_download: 'Download CV',
  social_github: 'GitHub',
  social_linkedin: 'LinkedIn',
  social_upwork: 'Upwork',
  social_bughunters: 'Google Bug Hunters',
  contact_email: 'Email address',
  contact_phone: 'Phone number',
  product_visit: 'Product website',
  project_open: 'Project on GitHub',
  cert_verify: 'Verify certificate',
  award_verify: 'Verify award',
};
const SECTION_NAMES: Record<string, string> = {
  work: 'Work',
  products: 'Products',
  services: 'Services',
  skills: 'Toolbox',
  projects: 'Open source',
  recognition: 'Recognition',
  contact: 'Contact',
};
const SECTION_ORDER = Object.keys(SECTION_NAMES);
const FEED_TEXT: Record<string, string> = { pageview: 'Visited the site', form_start: 'Started the contact form', message_sent: 'Sent a message' };

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '0%');
const ago = (iso: string) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : `${Math.floor(s / 86400)}d ago`;
};
const countryName = (code: string) => {
  try {
    return code.length === 2 ? new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code : code;
  } catch {
    return code;
  }
};

export default function AnalyticsPage() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const latest = useRef(0);

  const load = useCallback(async () => {
    const mine = ++latest.current; // a slow earlier response must never overwrite a newer one
    setLoading(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const res = await fetch(`/api/admin/analytics?days=${days}&tz=${encodeURIComponent(tz)}`, { cache: 'no-store' });
      if (res.status === 401) return void (window.location.href = ADMIN_LOGIN_EXPIRED);
      const json = await res.json();
      if (mine !== latest.current) return;
      if (!res.ok) throw new Error(json.error || 'Could not load analytics.');
      setReport(json);
      setError('');
    } catch (e) {
      if (mine === latest.current) setError((e as Error).message);
    } finally {
      if (mine === latest.current) setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const derived = useMemo(() => {
    if (!report) return null;
    const d = report.daily;
    const sections = SECTION_ORDER.map((name) => report.sections.find((s) => s.name === name)).filter(Boolean) as AnalyticsReport['sections'];
    return {
      dates: d.map((x) => x.date),
      visitors: d.map((x) => x.visitors),
      sessions: d.map((x) => x.sessions),
      hire: d.map((x) => x.hireClicks),
      messages: d.map((x) => x.messages),
      sections,
      clicks: report.clicks.map((c) => ({ name: CLICK_NAMES[c.name] || c.name, count: c.count, note: c.sessions !== c.count ? `${c.sessions} visit${c.sessions === 1 ? '' : 's'}` : undefined })),
    };
  }, [report]);

  if (!report && loading) return <Spinner label="Loading analytics" />;
  if (!report || !derived) {
    return (
      <>
        <PageHeader title="Analytics" />
        <Notice tone="warn" title="Analytics could not be loaded">
          {error || 'Try again in a moment.'}
        </Notice>
      </>
    );
  }

  const k = report.kpis;
  const periodLabel = `${report.range.days} days`;
  const formStarted = report.form.started;
  const noData = k.sessions.value === 0;
  const total = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Who visits, how long they stay, and what they do. Anonymous and cookie-free: no IP addresses are stored, and your own visits while signed in are not counted."
        actions={
          <span className="inline-flex items-center gap-2 border border-char bg-white px-3 h-9 text-sm font-medium text-char" aria-live="polite">
            <span className={`w-2 h-2 ${report.activeNow > 0 ? 'bg-signal' : 'bg-rule'}`} aria-hidden />
            {report.activeNow} active now
          </span>
        }
      />

      {/* One filter row above everything it scopes */}
      <div className="mb-6 flex flex-wrap items-center gap-3" role="group" aria-label="Date range">
        <div className="flex border border-char">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={`h-9 px-4 text-sm font-medium ${days === r ? 'bg-char text-paper' : 'bg-white text-char hover:bg-paperDeep'}`}
            >
              Last {r} days
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={load} busy={loading} aria-label="Refresh">
          {!loading && <RefreshCw size={14} aria-hidden />} Refresh
        </Button>
        <span className="text-xs text-mute">
          {fmtDay(report.range.from)} to {fmtDay(report.range.to)} · {report.range.tz}
        </span>
      </div>

      {noData && (
        <div className="mb-6">
          <Notice title="No visits recorded in this period yet">
            Open your public website in a normal (signed-out) browser window and scroll around. Visits appear here within a few seconds. Visits from bots, from people
            who send Do Not Track, and from you while signed in to this admin are not counted.
          </Notice>
        </div>
      )}

      <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          <StatTile label="Visitors" value={fmtNumber(k.visitors.value)} change={k.visitors.change} spark={derived.visitors} periodLabel={periodLabel} />
          <StatTile label="Visits" value={fmtNumber(k.sessions.value)} change={k.sessions.change} spark={derived.sessions} periodLabel={periodLabel} />
          <StatTile label="Avg. time on site" value={fmtDuration(k.avgSessionSeconds.value)} change={k.avgSessionSeconds.change} periodLabel={periodLabel} />
          <StatTile label="Engaged visits (10 s +)" value={`${k.sessions.value ? k.engagedRate : 0}%`} note={`Median visit ${fmtDuration(k.medianSessionSeconds)}`} periodLabel={periodLabel} />
          <StatTile label="Hire me clicks" value={fmtNumber(k.hireClicks.value)} change={k.hireClicks.change} spark={derived.hire} periodLabel={periodLabel} />
          <StatTile label="CV downloads" value={fmtNumber(k.cvDownloads.value)} change={k.cvDownloads.change} periodLabel={periodLabel} />
          <StatTile label="Messages received" value={fmtNumber(k.messages.value)} change={k.messages.change} spark={derived.messages} periodLabel={periodLabel} />
          <StatTile label="Hire-intent rate" value={`${k.intentRate.value}%`} change={k.intentRate.change} periodLabel={periodLabel} />
        </div>
        <p className="mt-2 text-xs text-mute">
          Hire-intent = a visit that clicked Hire me, downloaded the CV, used the email or phone link, or sent a message.
          {k.sessions.change === null && ` Comparisons with the previous ${periodLabel} appear once that period has at least 5 visits.`}
        </p>

        <div className="mt-8 space-y-6">
          <ChartCard
            title="Visitors and visits"
            subtitle="Unique visitors per day, and total visits (page loads)."
            legend={[
              { name: 'Visitors', color: CHART.s1 },
              { name: 'Visits', color: CHART.s2 },
            ]}
            busy={loading}
            table={{ columns: ['Day', 'Visitors', 'Visits'], rows: report.daily.map((d) => [fmtDay(d.date), d.visitors, d.sessions]) }}
          >
            <TimeSeriesChart
              label="Visitors and visits per day"
              dates={derived.dates}
              series={[
                { name: 'Visitors', color: CHART.s1, values: derived.visitors, area: true },
                { name: 'Visits', color: CHART.s2, values: derived.sessions },
              ]}
            />
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Hire me clicks"
              subtitle={`${fmtNumber(total(derived.hire))} in ${periodLabel}. The nav button and “Hire me for this”.`}
              busy={loading}
              table={{ columns: ['Day', 'Hire me clicks'], rows: report.daily.map((d) => [fmtDay(d.date), d.hireClicks]) }}
            >
              <ColumnChart label="Hire me clicks per day" categories={derived.dates} values={derived.hire} name="Hire me clicks" color={CHART.s1} formatCategory={fmtDay} />
            </ChartCard>
            <ChartCard
              title="Messages received"
              subtitle={`${fmtNumber(total(derived.messages))} in ${periodLabel}, straight from your inbox.`}
              busy={loading}
              table={{ columns: ['Day', 'Messages'], rows: report.daily.map((d) => [fmtDay(d.date), d.messages]) }}
            >
              <ColumnChart label="Messages per day" categories={derived.dates} values={derived.messages} name="Messages" color={CHART.s2} formatCategory={fmtDay} />
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="What visitors clicked" subtitle="Buttons and links, most clicked first." busy={loading} table={{ columns: ['Link', 'Clicks', 'Visits'], rows: report.clicks.map((c) => [CLICK_NAMES[c.name] || c.name, c.count, c.sessions]) }}>
              <RankedBars rows={derived.clicks} empty="No clicks recorded yet" />
            </ChartCard>
            <ChartCard
              title="How far people scroll"
              subtitle="Share of visits that reached each section."
              busy={loading}
              table={{ columns: ['Section', 'Visits', 'Share'], rows: derived.sections.map((s) => [SECTION_NAMES[s.name], s.sessions, `${s.share}%`]) }}
            >
              <RankedBars rows={derived.sections.map((s) => ({ name: SECTION_NAMES[s.name], count: s.share }))} suffix="%" empty="No scrolling recorded yet" />
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Time on site"
              subtitle="How long each visit lasted."
              busy={loading}
              table={{ columns: ['Length', 'Visits', 'Share'], rows: report.durations.map((d) => [d.label, d.count, pct(d.count, k.sessions.value)]) }}
            >
              <ColumnChart
                label="Visits by length"
                categories={report.durations.map((d) => d.label)}
                values={report.durations.map((d) => d.count)}
                name="Visits"
                color={CHART.ordinal[2]}
                colors={CHART.ordinal}
                valueOnCap
                everyLabel={1}
              />
            </ChartCard>
            <Card className="p-5 md:p-6">
              <h2 className="font-serif text-2xl font-normal text-char leading-tight">Contact form</h2>
              <p className="mt-1 text-sm text-mute">From first click in the form to a sent message.</p>
              <dl className="mt-5 grid grid-cols-3 gap-px bg-rule border border-rule">
                {[
                  ['Started', formStarted],
                  ['Sent', report.form.sent],
                  ['Completed', formStarted ? `${Math.min(100, Math.round((report.form.sent / formStarted) * 100))}%` : '–'],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-white p-4">
                    <dd className="font-sans text-3xl font-semibold leading-none text-char">{value}</dd>
                    <dt className="mt-2 text-xs text-mute">{label}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-mute leading-relaxed">
                {formStarted === 0
                  ? 'Nobody has started the form in this period.'
                  : report.form.sent < formStarted
                  ? `${formStarted - report.form.sent} visitor${formStarted - report.form.sent === 1 ? '' : 's'} started a message but did not send it.`
                  : 'Everyone who started the form sent a message.'}
              </p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Where visitors come from" subtitle="Referring websites. “Direct” means typed in, bookmarked, or an app." busy={loading} table={{ columns: ['Source', 'Visits'], rows: report.sources.referrers.map((r) => [r.name, r.count]) }}>
              <RankedBars rows={report.sources.referrers.map((r) => ({ name: r.name, count: r.count, note: pct(r.count, k.sessions.value) }))} />
            </ChartCard>
            <ChartCard title="Countries" subtitle="Needs the Vercel deployment; shows Unknown on your own computer." busy={loading} table={{ columns: ['Country', 'Visits'], rows: report.sources.countries.map((r) => [countryName(r.name), r.count]) }}>
              <RankedBars rows={report.sources.countries.map((r) => ({ name: countryName(r.name), count: r.count, note: pct(r.count, k.sessions.value) }))} />
            </ChartCard>
            <ChartCard title="Devices" busy={loading} table={{ columns: ['Device', 'Visits'], rows: report.sources.devices.map((r) => [r.name, r.count]) }}>
              <RankedBars rows={report.sources.devices.map((r) => ({ name: r.name[0].toUpperCase() + r.name.slice(1), count: r.count, note: pct(r.count, k.sessions.value) }))} />
            </ChartCard>
            <ChartCard title="Browsers and systems" busy={loading} table={{ columns: ['Browser or system', 'Visits'], rows: [...report.sources.browsers, ...report.sources.systems].map((r) => [r.name, r.count]) }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">Browsers</p>
              <RankedBars rows={report.sources.browsers.map((r) => ({ name: r.name, count: r.count }))} />
              <p className="mb-1 mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">Systems</p>
              <RankedBars rows={report.sources.systems.map((r) => ({ name: r.name, count: r.count }))} />
            </ChartCard>
          </div>

          {report.sources.campaigns.length > 0 && (
            <ChartCard title="Campaigns" subtitle="Visits that arrived with ?utm_source=… in the link." busy={loading} table={{ columns: ['Campaign', 'Visits'], rows: report.sources.campaigns.map((r) => [r.name, r.count]) }}>
              <RankedBars rows={report.sources.campaigns} />
            </ChartCard>
          )}

          <Card className="p-5 md:p-6">
            <h2 className="font-serif text-2xl font-normal text-char leading-tight">Latest activity</h2>
            {report.recent.length === 0 ? (
              <p className="mt-3 text-sm text-mute">Nothing yet.</p>
            ) : (
              <ul className="mt-3 border-t border-char">
                {report.recent.map((e, i) => (
                  <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5 text-sm">
                    <span className="text-char">
                      {FEED_TEXT[e.type] || (e.name ? `Clicked “${CLICK_NAMES[e.name] || e.name}”` : e.type)}
                      {e.label && e.type === 'click' && <span className="text-mute"> · {e.label}</span>}
                    </span>
                    <span className="font-mono text-xs text-mute">
                      {[e.country ? countryName(e.country) : null, e.device, ago(e.at)].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Notice title="How this is measured">
            A <strong>visit</strong> is one page load. A <strong>visitor</strong> is counted once per day from an anonymous, daily-changing hash, so the same person returning on
            a later day counts again. Time on site is measured while the page is visible and you are active, so very short visits show as 0 s. No cookies or browser storage are
            used, and visitors who send Do Not Track are not counted.
          </Notice>
        </div>
      </div>
    </>
  );
}
