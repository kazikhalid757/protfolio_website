/**
 * Signed-in devices (needs a signed-in session).
 *   GET                     -> { sessions }
 *   DELETE ?id=<uuid>       -> revoke one session
 *   DELETE ?all=1           -> revoke every session, including this one ("sign out everywhere")
 */
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { audit } from '@/lib/audit';
import { routeError } from '@/lib/errors';
import { clientIp, jsonError } from '@/lib/http';
import { listSessions, requireAdmin, revokeAllSessions, revokeSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    return NextResponse.json({ sessions: await listSessions(auth.id) });
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const params = new URL(request.url).searchParams;

  try {
    if (params.get('all') === '1') {
      const count = await revokeAllSessions();
      await audit('sessions_revoked_all', `${count} session(s)`, clientIp(request));
      const response = NextResponse.json({ success: true, revoked: count });
      response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
      return response;
    }
    const id = params.get('id');
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return jsonError('A valid session id is required.', 400);
    if (!(await revokeSession(id))) return jsonError('Session not found.', 404);
    await audit('session_revoked', id.slice(0, 8), clientIp(request));
    const response = NextResponse.json({ success: true, revokedCurrent: id === auth.id });
    if (id === auth.id) response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
    return response;
  } catch (error) {
    return routeError(error);
  }
}
