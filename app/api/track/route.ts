/**
 * Analytics collector.   POST { sid, type, name?, label?, path?, ref?, utm? }   ->  204
 *
 * Always answers 204 for traffic it chooses not to count (bots, your own signed-in visits, cross-site posts), so it
 * reveals nothing. No cookies are read or set for visitors, and the IP address is only used to build a daily
 * anonymous hash; it is never stored.
 */
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { recordEvent, trackSchema } from '@/lib/analytics';
import { dbConfigured } from '@/lib/db';
import { clientIp, isSameOrigin, readJson, userAgent } from '@/lib/http';
import { hasAdminCookie } from '@/lib/session';
import { parseUa } from '@/lib/ua';

export const dynamic = 'force-dynamic';

const done = () => new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

/** Same person, same day -> same hash. Different day -> different hash, so nobody can be followed over time. */
function dailyVisitorId(ip: string, ua: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const key = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'portfolio';
  return crypto.createHmac('sha256', key).update(`${day}|${ip}|${ua}`).digest('hex').slice(0, 24);
}

export async function POST(request: Request) {
  if (!dbConfigured() || !isSameOrigin(request)) return done();

  const ua = userAgent(request);
  const info = parseUa(ua);
  if (info.bot) return done();

  const parsed = trackSchema.safeParse(await readJson(request, 2_000));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 });

  try {
    // Never count the site owner's own visits.
    if (await hasAdminCookie(request)) return done();

    const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
    await recordEvent(parsed.data, {
      visitorId: dailyVisitorId(clientIp(request), ua),
      country: /^[A-Z]{2}$/.test(country) ? country : null,
      device: info.device,
      browser: info.browser,
      os: info.os,
    });
  } catch (error) {
    // Analytics must never break the site. Log and move on.
    console.error('track:', (error as Error).message);
  }
  return done();
}
