/** POST -> replaces all content with the starter data (data/default-portfolio.json). */
import { NextResponse } from 'next/server';
import { loadForAdmin, resetToDefaults } from '@/lib/data';
import { routeError } from '@/lib/errors';
import { clientIp } from '@/lib/http';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    await resetToDefaults({ actor: 'admin', ip: clientIp(request) });
    return NextResponse.json({ ...(await loadForAdmin()), storage: { mode: 'database' } });
  } catch (error) {
    return routeError(error);
  }
}
