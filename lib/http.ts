/** Small request/response helpers shared by the API routes. */
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

/** JSON error body: { error: string, details?: string[] } */
export function jsonError(message: string, status: number, details?: string[], headers?: Record<string, string>) {
  return NextResponse.json({ error: message, ...(details?.length ? { details } : {}) }, { status, headers });
}

/** Best-effort client IP behind Vercel / proxies. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown').trim().slice(0, 64);
}

export function userAgent(request: Request): string {
  return (request.headers.get('user-agent') || 'unknown').slice(0, 200);
}

/** One-way hash of an IP, so abuse can be spotted without storing the address. */
export function hashIp(ip: string): string {
  const salt = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'portfolio';
  return crypto.createHmac('sha256', salt).update(ip).digest('hex').slice(0, 32);
}

/**
 * CSRF guard for state-changing requests: if the browser says which site sent the request,
 * it must be this one. (Cookies are also SameSite=Lax, so this is a second layer.)
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients do not send Origin; they also have no ambient cookie
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Read a JSON body safely: size-limited and never throws. Returns undefined when invalid. */
export async function readJson(request: Request, maxBytes = 700_000): Promise<unknown> {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > maxBytes) return undefined;
  try {
    const raw = await request.text();
    if (raw.length > maxBytes) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
