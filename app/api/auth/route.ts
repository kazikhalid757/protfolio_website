/**
 * Sign in / sign out / session status.
 *   POST   { password }  -> sets the session cookie        (rate limited, audited)
 *   GET                  -> { authenticated, configured, devDefault }
 *   DELETE               -> revokes this session and clears the cookie
 */
import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  configuredPassword,
  passwordMatches,
  sessionCookieOptions,
  usingDevDefaultPassword,
} from '@/lib/auth';
import { audit } from '@/lib/audit';
import { dbConfigured } from '@/lib/db';
import { routeError } from '@/lib/errors';
import { clientIp, isSameOrigin, jsonError, readJson, userAgent } from '@/lib/http';
import { rateLimit } from '@/lib/rateLimit';
import { getSession, revokeSession, startSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError('Cross-site request blocked.', 403);
  if (!configuredPassword()) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set the ADMIN_PASSWORD environment variable and redeploy.', code: 'not_configured' },
      { status: 503 }
    );
  }
  if (!dbConfigured()) return jsonError('The database is not configured. Set DATABASE_URL.', 503);

  const ip = clientIp(request);
  try {
    // Per-IP brake, plus a global one so a botnet cannot guess in parallel.
    const [perIp, global] = await Promise.all([rateLimit(`login:${ip}`, 8, 15 * 60), rateLimit('login:all', 60, 60 * 60)]);
    if (!perIp.ok || !global.ok) {
      const retry = Math.max(perIp.retryAfter, global.retryAfter);
      await audit('login_blocked', 'too many attempts', ip);
      return jsonError(`Too many attempts. Try again in ${Math.ceil(retry / 60)} minute(s).`, 429, undefined, { 'Retry-After': String(retry) });
    }

    const body = (await readJson(request, 5_000)) as { password?: unknown } | undefined;
    if (!(await passwordMatches(body?.password))) {
      await audit('login_failed', undefined, ip);
      await new Promise((resolve) => setTimeout(resolve, 400)); // slow down guessing
      return jsonError('Incorrect password.', 401);
    }

    const cookie = await startSession(ip, userAgent(request));
    await audit('login_success', undefined, ip);
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, cookie, sessionCookieOptions());
    return response;
  } catch (error) {
    return routeError(error);
  }
}

export async function GET(request: Request) {
  let authenticated = false;
  let checked = false;
  try {
    authenticated = dbConfigured() && !!(await getSession(request));
    checked = true;
  } catch {}
  const response = NextResponse.json({
    authenticated,
    configured: !!configuredPassword(),
    devDefault: usingDevDefaultPassword(),
    database: dbConfigured(),
  });
  // A leftover cookie for a session that no longer exists is useless; remove it (only when the database really answered).
  if (checked && !authenticated && (request.headers.get('cookie') || '').includes(SESSION_COOKIE + '=')) {
    response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
  }
  return response;
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return jsonError('Cross-site request blocked.', 403);
  try {
    const session = await getSession(request);
    if (session) {
      await revokeSession(session.id);
      await audit('logout', undefined, clientIp(request));
    }
  } catch {}
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
  return response;
}
