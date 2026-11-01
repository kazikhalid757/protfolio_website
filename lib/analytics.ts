/**
 * First-party, cookie-free analytics stored in Neon.
 *
 * Privacy by design: no cookies, no localStorage, no IP address stored. A "visitor" is a daily keyed hash of
 * IP + user-agent (it rotates every day, so it cannot follow anyone across days). A "session" is one page load.
 * Visitors who send Do Not Track / Global Privacy Control, bots, and you (while signed in to the admin) are not counted.
 */
import { z } from 'zod';
import { sql } from './db';

// ------------------------------------------------------------------ what the browser may send

export const TRACK_TYPES = ['pageview', 'ping', 'click', 'section', 'form_start', 'message_sent'] as const;
const MAX_EVENTS_PER_SESSION = 250;

export const trackSchema = z.object({
  sid: z.string().regex(/^[a-z0-9]{12,40}$/i),
  type: z.enum(TRACK_TYPES),
  name: z.string().regex(/^[a-z0-9_:-]{1,60}$/i).optional(),
  label: z.string().max(80).optional(),
  path: z.string().max(200).regex(/^\//).optional(),
  ref: z.string().max(120).optional(),
  utm: z.string().max(60).optional(),
});
export type TrackInput = z.infer<typeof trackSchema>;

/** Clicks that mean "this person is interested in hiring me". */
export const INTENT_CLICKS = ['hire_me', 'hire_service', 'cv_download', 'contact_email', 'contact_phone'] as const;
/** Clicks that are specifically the "Hire me" buttons. */
export const HIRE_CLICKS = ['hire_me', 'hire_service'] as const;

const clean = (v: string | undefined, max: number) => (v ? v.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, max) || null : null);

export interface TrackContext {
  visitorId: string;
  country: string | null;
  device: string;
  browser: string;
  os: string;
}

export async function recordEvent(input: TrackInput, ctx: TrackContext): Promise<void> {
  const q = sql();

  // A heartbeat only refreshes "last seen" (that is how session time is measured), at most once per 8 seconds.
  if (input.type === 'ping') {
    await q`UPDATE portfolio.analytics_sessions SET last_seen_at = now()
             WHERE id = ${input.sid} AND last_seen_at < now() - interval '8 seconds'`;
    return;
  }

  const pageview = input.type === 'pageview' ? 1 : 0;
  const ref = clean(input.ref, 120);
  const utm = clean(input.utm, 60)?.toLowerCase() ?? null;
  const landing = clean(input.path, 200);
  const name = clean(input.name, 60);
  const label = clean(input.label, 80);

  // One atomic statement: create or touch the session (capped so nobody can flood it), then store the event.
  await q`
    WITH s AS (
      INSERT INTO portfolio.analytics_sessions AS s
        (id, visitor_id, country, device, browser, os, referrer, utm_source, landing_path, pageviews, events)
      VALUES (${input.sid}, ${ctx.visitorId}, ${ctx.country}, ${ctx.device}, ${ctx.browser}, ${ctx.os}, ${ref}, ${utm}, ${landing}, ${pageview}::int, 1)
      ON CONFLICT (id) DO UPDATE
         SET last_seen_at = now(), events = s.events + 1, pageviews = s.pageviews + ${pageview}::int
       WHERE s.events < ${MAX_EVENTS_PER_SESSION}::int
      RETURNING s.id
    )
    INSERT INTO portfolio.analytics_events (session_id, type, name, label, path)
    SELECT id, ${input.type}, ${name}, ${label}, ${landing} FROM s`;

  // Housekeeping: keep about 14 months.
  if (Math.random() < 0.01) {
    await q`DELETE FROM portfolio.analytics_events WHERE at < now() - interval '400 days'`;
    await q`DELETE FROM portfolio.analytics_sessions WHERE started_at < now() - interval '400 days'`;
  }
}

export async function clearAnalytics(): Promise<{ sessions: number; events: number }> {
  const [events, sessions] = await sql().transaction((t: any) => [
    t`DELETE FROM portfolio.analytics_events RETURNING id`,
    t`DELETE FROM portfolio.analytics_sessions RETURNING id`,
  ]);
  return { sessions: sessions.length, events: events.length };
}

// ------------------------------------------------------------------ the report

export interface Metric {
  value: number;
  previous: number;
  /** Percent change versus the previous period, or null when there is nothing to compare with. */
  change: number | null;
}
export interface Counted {
  name: string;
  count: number;
}
export interface AnalyticsReport {
  range: { days: number; from: string; to: string; tz: string };
  generatedAt: string;
  activeNow: number;
  kpis: {
    visitors: Metric;
    sessions: Metric;
    pageviews: Metric;
    avgSessionSeconds: Metric;
    medianSessionSeconds: number;
    engagedRate: number;
    hireClicks: Metric;
    cvDownloads: Metric;
    messages: Metric;
    intentRate: Metric;
  };
  daily: { date: string; visitors: number; sessions: number; hireClicks: number; messages: number }[];
  clicks: (Counted & { sessions: number })[];
  sections: { name: string; sessions: number; share: number }[];
  form: { started: number; sent: number };
  sources: { referrers: Counted[]; countries: Counted[]; devices: Counted[]; browsers: Counted[]; systems: Counted[]; campaigns: Counted[] };
  durations: { label: string; count: number }[];
  recent: { at: string; type: string; name: string | null; label: string | null; country: string | null; device: string | null }[];
}

/** `enough` is false when the earlier period had too few visits for a percentage to mean anything. */
const metric = (value: number, previous: number, enough = true): Metric => ({
  value,
  previous,
  change: enough && previous > 0 ? Math.round(((value - previous) / previous) * 1000) / 10 : null,
});

/** IANA time zone names only; anything else falls back to UTC. */
async function usableTimeZone(tz: string): Promise<string> {
  if (!/^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+){0,2}$/.test(tz)) return 'UTC';
  try {
    await sql()`SELECT now() AT TIME ZONE ${tz} AS t`;
    return tz;
  } catch {
    return 'UTC';
  }
}

function eachDay(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = new Date(from + 'T00:00:00Z'); d.toISOString().slice(0, 10) <= to; d = new Date(d.getTime() + 86400000)) out.push(d.toISOString().slice(0, 10));
  return out;
}

export async function getAnalytics(days: number, timeZone: string): Promise<AnalyticsReport> {
  const tz = await usableTimeZone(timeZone);
  const q = sql();

  const [win] = await q`
    SELECT (now() AT TIME ZONE ${tz})::date::text AS today,
           ((now() AT TIME ZONE ${tz})::date - ${days - 1}::int)::text AS from_local,
           to_char((((now() AT TIME ZONE ${tz})::date - ${days - 1}::int)::timestamp AT TIME ZONE ${tz}) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS from_ts,
           to_char((((now() AT TIME ZONE ${tz})::date - ${2 * days - 1}::int)::timestamp AT TIME ZONE ${tz}) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS prev_ts`;
  const from = win.from_ts as string;
  const prev = win.prev_ts as string;

  const [kpiNow, kpiPrev, evNow, evPrev, sessDay, clickDay, msgDay, msgPrev, breakdown, buckets, intentNow, intentPrev, recent, active] = await q.transaction((t: any) => [
    t`SELECT count(*)::int AS sessions, count(DISTINCT visitor_id)::int AS visitors, COALESCE(sum(pageviews),0)::int AS pageviews,
             COALESCE(avg(dur),0)::float AS avg_s, COALESCE(percentile_cont(0.5) WITHIN GROUP (ORDER BY dur),0)::float AS median_s,
             count(*) FILTER (WHERE dur >= 10)::int AS engaged
        FROM (SELECT visitor_id, pageviews, EXTRACT(EPOCH FROM (last_seen_at - started_at)) AS dur
                FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz) x`,
    t`SELECT count(*)::int AS sessions, count(DISTINCT visitor_id)::int AS visitors, COALESCE(sum(pageviews),0)::int AS pageviews,
             COALESCE(avg(dur),0)::float AS avg_s
        FROM (SELECT visitor_id, pageviews, EXTRACT(EPOCH FROM (last_seen_at - started_at)) AS dur
                FROM portfolio.analytics_sessions WHERE started_at >= ${prev}::timestamptz AND started_at < ${from}::timestamptz) x`,
    t`SELECT type, COALESCE(name,'') AS name, count(*)::int AS n, count(DISTINCT session_id)::int AS sessions
        FROM portfolio.analytics_events WHERE at >= ${from}::timestamptz AND type <> 'pageview' GROUP BY 1,2`,
    t`SELECT type, COALESCE(name,'') AS name, count(*)::int AS n
        FROM portfolio.analytics_events WHERE at >= ${prev}::timestamptz AND at < ${from}::timestamptz AND type <> 'pageview' GROUP BY 1,2`,
    t`SELECT (started_at AT TIME ZONE ${tz})::date::text AS d, count(*)::int AS sessions, count(DISTINCT visitor_id)::int AS visitors
        FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz GROUP BY 1`,
    t`SELECT (at AT TIME ZONE ${tz})::date::text AS d, name, count(*)::int AS n
        FROM portfolio.analytics_events WHERE type = 'click' AND at >= ${from}::timestamptz GROUP BY 1,2`,
    t`SELECT (created_at AT TIME ZONE ${tz})::date::text AS d, count(*)::int AS n
        FROM portfolio.messages WHERE created_at >= ${from}::timestamptz GROUP BY 1`,
    t`SELECT count(*)::int AS n FROM portfolio.messages WHERE created_at >= ${prev}::timestamptz AND created_at < ${from}::timestamptz`,
    t`(SELECT 'referrer' AS k, COALESCE(referrer,'Direct') AS v, count(*)::int AS n FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz GROUP BY 2 ORDER BY n DESC LIMIT 8)
      UNION ALL (SELECT 'country', COALESCE(country,'Unknown'), count(*)::int FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz GROUP BY 2 ORDER BY 3 DESC LIMIT 8)
      UNION ALL (SELECT 'device', COALESCE(device,'Unknown'), count(*)::int FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz GROUP BY 2 ORDER BY 3 DESC LIMIT 5)
      UNION ALL (SELECT 'browser', COALESCE(browser,'Unknown'), count(*)::int FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz GROUP BY 2 ORDER BY 3 DESC LIMIT 6)
      UNION ALL (SELECT 'os', COALESCE(os,'Unknown'), count(*)::int FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz GROUP BY 2 ORDER BY 3 DESC LIMIT 6)
      UNION ALL (SELECT 'campaign', utm_source, count(*)::int FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz AND utm_source IS NOT NULL GROUP BY 2 ORDER BY 3 DESC LIMIT 6)`,
    t`SELECT CASE WHEN dur < 10 THEN 0 WHEN dur < 30 THEN 1 WHEN dur < 60 THEN 2 WHEN dur < 180 THEN 3 ELSE 4 END AS b, count(*)::int AS n
        FROM (SELECT EXTRACT(EPOCH FROM (last_seen_at - started_at)) AS dur FROM portfolio.analytics_sessions WHERE started_at >= ${from}::timestamptz) x GROUP BY 1`,
    t`SELECT count(DISTINCT session_id)::int AS n FROM portfolio.analytics_events
       WHERE at >= ${from}::timestamptz AND ((type = 'click' AND name IN ('hire_me','hire_service','cv_download','contact_email','contact_phone')) OR type = 'message_sent')`,
    t`SELECT count(DISTINCT session_id)::int AS n FROM portfolio.analytics_events
       WHERE at >= ${prev}::timestamptz AND at < ${from}::timestamptz AND ((type = 'click' AND name IN ('hire_me','hire_service','cv_download','contact_email','contact_phone')) OR type = 'message_sent')`,
    t`SELECT e.at, e.type, e.name, e.label, s.country, s.device FROM portfolio.analytics_events e JOIN portfolio.analytics_sessions s ON s.id = e.session_id
       WHERE e.type <> 'section' ORDER BY e.id DESC LIMIT 12`,
    t`SELECT count(*)::int AS n FROM portfolio.analytics_sessions WHERE last_seen_at > now() - interval '2 minutes'`,
  ]);

  const sumClicks = (rows: any[], names: readonly string[]) => rows.filter((r) => r.type === 'click' && names.includes(r.name)).reduce((n, r) => n + r.n, 0);
  const typeCount = (rows: any[], type: string) => rows.filter((r) => r.type === type).reduce((n, r) => n + r.n, 0);

  // Messages are counted from the inbox itself (the source of truth), not from browser events.
  const messagesNow = msgDay.reduce((n: number, r: any) => n + r.n, 0);
  const sessions = kpiNow[0].sessions as number;
  // A +32,000% jump from 1 visit to 327 is noise, not insight: only compare against a period with at least 5 visits.
  const enough = (kpiPrev[0].sessions as number) >= 5;

  const daysList = eachDay(win.from_local, win.today);
  const sessByDay = new Map(sessDay.map((r: any) => [r.d, r]));
  const msgByDay = new Map(msgDay.map((r: any) => [r.d, r.n]));
  const hireByDay = new Map<string, number>();
  for (const r of clickDay as any[]) if ((HIRE_CLICKS as readonly string[]).includes(r.name)) hireByDay.set(r.d, (hireByDay.get(r.d) ?? 0) + r.n);

  const bucketLabels = ['Under 10 s', '10–30 s', '30–60 s', '1–3 min', 'Over 3 min'];
  const bucketCount = new Map(buckets.map((r: any) => [r.b, r.n]));
  const group = (k: string): Counted[] => (breakdown as any[]).filter((r) => r.k === k).map((r) => ({ name: r.v, count: r.n }));

  return {
    range: { days, from: win.from_local, to: win.today, tz },
    generatedAt: new Date().toISOString(),
    activeNow: active[0].n,
    kpis: {
      visitors: metric(kpiNow[0].visitors, kpiPrev[0].visitors, enough),
      sessions: metric(sessions, kpiPrev[0].sessions, enough),
      pageviews: metric(kpiNow[0].pageviews, kpiPrev[0].pageviews, enough),
      avgSessionSeconds: metric(Math.round(kpiNow[0].avg_s), Math.round(kpiPrev[0].avg_s), enough),
      medianSessionSeconds: Math.round(kpiNow[0].median_s),
      engagedRate: sessions ? Math.round((kpiNow[0].engaged / sessions) * 1000) / 10 : 0,
      hireClicks: metric(sumClicks(evNow as any[], HIRE_CLICKS), sumClicks(evPrev as any[], HIRE_CLICKS), enough),
      cvDownloads: metric(sumClicks(evNow as any[], ['cv_download']), sumClicks(evPrev as any[], ['cv_download']), enough),
      messages: metric(messagesNow, msgPrev[0].n, enough),
      intentRate: metric(sessions ? Math.round((intentNow[0].n / sessions) * 1000) / 10 : 0, kpiPrev[0].sessions ? Math.round((intentPrev[0].n / kpiPrev[0].sessions) * 1000) / 10 : 0, enough),
    },
    daily: daysList.map((date) => ({
      date,
      visitors: (sessByDay.get(date) as any)?.visitors ?? 0,
      sessions: (sessByDay.get(date) as any)?.sessions ?? 0,
      hireClicks: hireByDay.get(date) ?? 0,
      messages: (msgByDay.get(date) as number) ?? 0,
    })),
    clicks: (evNow as any[])
      .filter((r) => r.type === 'click')
      .map((r) => ({ name: r.name, count: r.n, sessions: r.sessions }))
      .sort((a, b) => b.count - a.count),
    sections: (evNow as any[])
      .filter((r) => r.type === 'section')
      .map((r) => ({ name: r.name, sessions: r.sessions, share: sessions ? Math.round((r.sessions / sessions) * 1000) / 10 : 0 })),
    form: { started: typeCount(evNow as any[], 'form_start'), sent: typeCount(evNow as any[], 'message_sent') },
    sources: { referrers: group('referrer'), countries: group('country'), devices: group('device'), browsers: group('browser'), systems: group('os'), campaigns: group('campaign') },
    durations: bucketLabels.map((label, i) => ({ label, count: (bucketCount.get(i) as number) ?? 0 })),
    recent: (recent as any[]).map((r) => ({ at: new Date(r.at).toISOString(), type: r.type, name: r.name, label: r.label, country: r.country, device: r.device })),
  };
}
