/**
 * Contact inbox (needs a signed-in session).
 *   GET                       -> { messages, emailDelivery }
 *   PATCH { id, read }        -> mark read / unread
 *   DELETE ?id=<uuid>         -> delete
 */
import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { routeError } from '@/lib/errors';
import { clientIp, jsonError, readJson } from '@/lib/http';
import { listMessages, removeMessage, setRead } from '@/lib/messages';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    return NextResponse.json({ messages: await listMessages(), available: true, emailDelivery: !!process.env.RESEND_API_KEY });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const body = (await readJson(request, 2_000)) as { id?: unknown; read?: unknown } | undefined;
  if (typeof body?.id !== 'string' || typeof body.read !== 'boolean') return jsonError('id and read are required.', 400);
  try {
    return (await setRead(body.id, body.read)) ? NextResponse.json({ success: true }) : jsonError('Message not found.', 404);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return jsonError('id is required.', 400);
  try {
    if (!(await removeMessage(id))) return jsonError('Message not found.', 404);
    await audit('message_deleted', id, clientIp(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return routeError(error);
  }
}
