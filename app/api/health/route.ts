/** Health check.   GET /api/health  ->  { status, database, latencyMs }. Reveals nothing sensitive. */
import { NextResponse } from 'next/server';
import { dbConfigured, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  let database: 'ok' | 'down' | 'not_configured' = 'not_configured';
  if (dbConfigured()) {
    try {
      await sql()`SELECT 1`;
      database = 'ok';
    } catch {
      database = 'down';
    }
  }
  return NextResponse.json(
    { status: database === 'ok' ? 'ok' : 'degraded', database, latencyMs: Date.now() - started },
    { status: database === 'ok' ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
