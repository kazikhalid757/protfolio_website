/**
 * Analytics report (needs a signed-in session).
 *   GET ?days=7|30|90&tz=Asia/Dhaka   -> AnalyticsReport (see lib/analytics.ts)
 *   DELETE                            -> erase all analytics data
 */
import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { clearAnalytics, getAnalytics } from '@/lib/analytics';
import { routeError } from '@/lib/errors';
import { clientIp } from '@/lib/http';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const params = new URL(request.url).searchParams;
  const asked = Number(params.get('days'));
  const days = [7, 30, 90].includes(asked) ? asked : 30;
  try {
    return NextResponse.json(await getAnalytics(days, params.get('tz') || 'UTC'));
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const removed = await clearAnalytics();
    await audit('content_reset', `analytics erased: ${removed.sessions} sessions, ${removed.events} events`, clientIp(request));
    return NextResponse.json({ success: true, ...removed });
  } catch (error) {
    return routeError(error);
  }
}
