/**
 * Public content API (read-only).   GET /api/content  ->  the whole portfolio as JSON.
 * Served from the same cache as the website, so it updates the moment the admin saves.
 */
import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getPortfolioData(), {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
  });
}
