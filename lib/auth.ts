/**
 * Admin authentication primitives. Web Crypto only, so this runs in both the Node runtime and the Edge middleware.
 *
 *  - The password comes from ADMIN_PASSWORD (environment), never from a data file or the database.
 *  - A login creates a server-side session row AND a signed cookie. The cookie proves the session id was issued by us;
 *    the database row lets us revoke it. Both must be valid.
 *  - Cookie format: <sessionId>.<expiresAtMs>.<hmac>
 */

const encoder = new TextEncoder();

/** `__Host-` pins the cookie to this exact host over HTTPS in production. */
export const SESSION_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-admin_session' : 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function configuredPassword(): string {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV !== 'production' ? 'admin123' : '';
}

export function usingDevDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production';
}

/** Signing key: ADMIN_SECRET, else the password (so changing it signs everyone out). */
function signingKey(): string {
  return process.env.ADMIN_SECRET || configuredPassword() || 'unconfigured';
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(signingKey()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
  return Array.from(signature, (b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Constant-time password check (both sides are hashed first so lengths never leak). */
export async function passwordMatches(input: unknown): Promise<boolean> {
  const expected = configuredPassword();
  if (!expected || typeof input !== 'string' || input.length > 500) return false;
  const [a, b] = await Promise.all([hmac('pw:' + input), hmac('pw:' + expected)]);
  return safeEqual(a, b);
}

export async function signSession(sessionId: string, expiresAt: number): Promise<string> {
  return `${sessionId}.${expiresAt}.${await hmac(`session:${sessionId}.${expiresAt}`)}`;
}

/** Check the signature and expiry of a cookie value. Does NOT check the database (see lib/session.ts). */
export async function verifySignedSession(token?: string | null): Promise<{ sessionId: string; expiresAt: number } | null> {
  if (!token || token.length > 200) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [sessionId, expires, signature] = parts;
  const expiresAt = Number(expires);
  if (!/^[0-9a-f-]{36}$/.test(sessionId) || !expiresAt || expiresAt < Date.now()) return null;
  return safeEqual(signature, await hmac(`session:${sessionId}.${expiresAt}`)) ? { sessionId, expiresAt } : null;
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}
