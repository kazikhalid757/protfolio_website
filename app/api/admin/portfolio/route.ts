/**
 * Admin content API (needs a signed-in session).
 *   GET    -> { data, versions, updatedAt }                       latest content straight from the database
 *   PATCH  { section, value, expectedVersion? }  -> { section, value, version }
 *            expectedVersion makes the save fail with 409 if someone else changed the section meanwhile
 *   PUT    <whole document>                       -> replaces everything (Import), all-or-nothing
 */
import { NextResponse } from 'next/server';
import { loadForAdmin, saveAll, saveSection } from '@/lib/data';
import { routeError } from '@/lib/errors';
import { clientIp, jsonError, readJson } from '@/lib/http';
import { isSectionName } from '@/lib/schemas';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    return NextResponse.json({ ...(await loadForAdmin()), storage: { mode: 'database' } });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const body = (await readJson(request)) as { section?: unknown; value?: unknown; expectedVersion?: unknown } | undefined;
  if (!body || !isSectionName(body.section)) return jsonError('Unknown or missing "section".', 400);
  const expected = typeof body.expectedVersion === 'number' ? body.expectedVersion : null;

  try {
    const saved = await saveSection(body.section, body.value, { actor: 'admin', ip: clientIp(request), expectedVersion: expected });
    return NextResponse.json({ section: body.section, value: saved.data, version: saved.version });
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const body = await readJson(request);
  if (body === undefined) return jsonError('Body must be valid JSON (and not too large).', 400);
  try {
    await saveAll(body, { actor: 'admin', ip: clientIp(request), kind: 'content_imported' });
    return NextResponse.json({ ...(await loadForAdmin()), storage: { mode: 'database' } });
  } catch (error) {
    return routeError(error);
  }
}
