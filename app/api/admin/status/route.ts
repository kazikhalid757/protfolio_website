/** GET -> setup and health information for the Settings page. Booleans and counts only; no secret values. */
import { NextResponse } from 'next/server';
import { configuredPassword, usingDevDefaultPassword } from '@/lib/auth';
import { dbConfigured, sql } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  let database: { connected: boolean; latencyMs?: number; counts?: Record<string, number>; error?: string } = { connected: false };
  if (dbConfigured()) {
    const started = Date.now();
    try {
      const rows = await sql()`
        SELECT (SELECT count(*)::int FROM portfolio.site_content)      AS sections,
               (SELECT count(*)::int FROM portfolio.content_revisions) AS revisions,
               (SELECT count(*)::int FROM portfolio.messages)          AS messages,
               (SELECT count(*)::int FROM portfolio.admin_sessions WHERE revoked_at IS NULL AND expires_at > now()) AS sessions,
               (SELECT count(*)::int FROM portfolio.analytics_sessions) AS visits,
               (SELECT count(*)::int FROM portfolio.analytics_events)  AS events`;
      database = { connected: true, latencyMs: Date.now() - started, counts: rows[0] as Record<string, number> };
    } catch (error) {
      console.error('status: database check failed:', (error as { code?: string }).code, (error as Error).message);
      database = { connected: false, error: (error as { code?: string }).code === '42P01' ? 'Tables are missing. Run "npm run db:setup".' : 'Could not query the database.' };
    }
  }

  const password = configuredPassword();
  return NextResponse.json({
    database,
    onVercel: !!process.env.VERCEL,
    email: { configured: !!process.env.RESEND_API_KEY },
    auth: {
      passwordSet: !!process.env.ADMIN_PASSWORD,
      passwordStrong: !!process.env.ADMIN_PASSWORD && password.length >= 12,
      secretSet: !!process.env.ADMIN_SECRET,
      devDefault: usingDevDefaultPassword(),
    },
    siteUrlSet: !!(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL),
  });
}
