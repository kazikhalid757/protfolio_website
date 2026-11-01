/** GET -> { entries } the latest security events (sign-ins, saves, revokes). */
import { NextResponse } from 'next/server';
import { listAudit } from '@/lib/audit';
import { routeError } from '@/lib/errors';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    return NextResponse.json({ entries: await listAudit(40) });
  } catch (error) {
    return routeError(error);
  }
}
