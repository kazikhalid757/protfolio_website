/**
 * Admin sessions. A request is signed in only if BOTH are true:
 *   1. its cookie carries a valid signature that has not expired        (cheap; also done in the edge middleware), and
 *   2. the matching row in portfolio.admin_sessions exists, is not revoked and has not expired   (this file).
 * The second check is what makes "sign out" and "revoke this device" real.
 */
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionCookieOptions, signSession, verifySignedSession } from './auth';
import { sql, toDatabaseError } from './db';
import { isSameOrigin, jsonError } from './http';

export interface AdminSession {
  id: string;
}

export interface SessionInfo {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  ip: string | null;
  userAgent: string | null;
  current: boolean;
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return undefined;
}

/** True when the request carries a correctly signed admin cookie. Cheap (no database); used to keep your own visits out of analytics. */
export async function hasAdminCookie(request: Request): Promise<boolean> {
  return !!(await verifySignedSession(readCookie(request, SESSION_COOKIE)));
}

/** Create the session row and return the cookie value to set. */
export async function startSession(ip: string, userAgent: string): Promise<string> {
  const id = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  await sql()`
    INSERT INTO portfolio.admin_sessions (id, expires_at, ip, user_agent)
    VALUES (${id}, ${new Date(expiresAt).toISOString()}, ${ip}, ${userAgent})`;
  // Remove sessions that are long gone.
  if (Math.random() < 0.05) {
    sql()`DELETE FROM portfolio.admin_sessions WHERE expires_at < now() - interval '7 days'`.catch(() => {});
  }
  return signSession(id, expiresAt);
}

/** The signed-in session for this request, or null. Never throws on bad input. */
export async function getSession(request: Request): Promise<AdminSession | null> {
  const signed = await verifySignedSession(readCookie(request, SESSION_COOKIE));
  if (!signed) return null;
  const rows = await sql()`
    UPDATE portfolio.admin_sessions
       SET last_seen_at = CASE WHEN last_seen_at < now() - interval '5 minutes' THEN now() ELSE last_seen_at END
     WHERE id = ${signed.sessionId} AND revoked_at IS NULL AND expires_at > now()
 RETURNING id`;
  return rows.length ? { id: signed.sessionId } : null;
}

/**
 * Guard for admin API handlers:
 *   const auth = await requireAdmin(request);
 *   if (auth instanceof Response) return auth;
 */
export async function requireAdmin(request: Request): Promise<AdminSession | Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD' && !isSameOrigin(request)) {
    return jsonError('Cross-site request blocked.', 403);
  }
  try {
    const session = await getSession(request);
    if (session) return session;
    // The browser may hold a cookie that is still correctly signed but whose session was revoked or erased.
    // Clear it now, so the next page load goes to the login page instead of bouncing around.
    const refused = jsonError('Unauthorized', 401) as NextResponse;
    if (readCookie(request, SESSION_COOKIE)) refused.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
    return refused;
  } catch (error) {
    // Fail closed, with a clear 503 instead of an unhandled 500, when the session store cannot be reached.
    const db = toDatabaseError(error);
    return jsonError(db.message, db.status);
  }
}

export async function revokeSession(id: string): Promise<boolean> {
  const rows = await sql()`UPDATE portfolio.admin_sessions SET revoked_at = now() WHERE id = ${id} AND revoked_at IS NULL RETURNING id`;
  return rows.length > 0;
}

/** Revoke every session (including this one). Returns how many were active. */
export async function revokeAllSessions(): Promise<number> {
  const rows = await sql()`UPDATE portfolio.admin_sessions SET revoked_at = now() WHERE revoked_at IS NULL AND expires_at > now() RETURNING id`;
  return rows.length;
}

export async function listSessions(currentId: string): Promise<SessionInfo[]> {
  const rows = await sql()`
    SELECT id, created_at, last_seen_at, expires_at, ip, user_agent
      FROM portfolio.admin_sessions
     WHERE revoked_at IS NULL AND expires_at > now()
  ORDER BY last_seen_at DESC LIMIT 25`;
  return rows.map((r) => ({
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    lastSeenAt: new Date(r.last_seen_at).toISOString(),
    expiresAt: new Date(r.expires_at).toISOString(),
    ip: r.ip,
    userAgent: r.user_agent,
    current: r.id === currentId,
  }));
}
