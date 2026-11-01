/** Public content API (read-only).   GET /api/content/experiences  ->  { section, data } */
import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/data';
import { jsonError } from '@/lib/http';
import { SECTION_NAMES, isSectionName } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { section: string } }) {
  if (!isSectionName(params.section)) {
    return jsonError(`Unknown section. Use one of: ${SECTION_NAMES.join(', ')}.`, 404);
  }
  const data = await getPortfolioData();
  return NextResponse.json(
    { section: params.section, data: data[params.section] },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' } }
  );
}
