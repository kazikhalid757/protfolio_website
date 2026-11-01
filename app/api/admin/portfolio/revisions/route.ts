/**
 * Version history.
 *   GET ?section=experiences            -> { revisions: [{ id, version, actor, createdAt }] }
 *   GET ?section=experiences&id=12      -> { data }   (the saved content of that revision)
 */
import { NextResponse } from 'next/server';
import { getRevision, listRevisions } from '@/lib/data';
import { routeError } from '@/lib/errors';
import { jsonError } from '@/lib/http';
import { isSectionName } from '@/lib/schemas';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const params = new URL(request.url).searchParams;
  const section = params.get('section');
  if (!isSectionName(section)) return jsonError('Unknown or missing "section".', 400);

  try {
    const id = params.get('id');
    if (id !== null) {
      const numeric = Number(id);
      if (!Number.isInteger(numeric) || numeric < 1) return jsonError('Invalid revision id.', 400);
      const data = await getRevision(section, numeric);
      return data === null ? jsonError('Revision not found.', 404) : NextResponse.json({ data });
    }
    return NextResponse.json({ revisions: await listRevisions(section) });
  } catch (error) {
    return routeError(error);
  }
}
