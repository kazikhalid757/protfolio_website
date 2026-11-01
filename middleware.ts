import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_BASE, INTERNAL_ADMIN } from '@/lib/adminPath';
import { SESSION_COOKIE, verifySignedSession } from '@/lib/auth';
import { buildCsp } from '@/lib/csp';

/**
 * Runs on every page and API request:
 *  1. attaches a per-request nonce + Content-Security-Policy,
 *  2. serves the admin panel only at ADMIN_BASE (e.g. /kasitamim/admin) and answers 404 for the internal /admin address,
 *  3. keeps the admin pages and /api/admin behind a signed session (the database is checked again inside each handler,
 *     so a revoked session stops working immediately),
 *  4. marks admin responses noindex + no-store.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const remap = ADMIN_BASE !== INTERNAL_ADMIN;

  const isAdminPage = pathname === ADMIN_BASE || pathname.startsWith(ADMIN_BASE + '/');
  const isInternalAdmin = remap && (pathname === INTERNAL_ADMIN || pathname.startsWith(INTERNAL_ADMIN + '/'));
  const isAdminApi = pathname.startsWith('/api/admin');

  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, process.env.NODE_ENV === 'development');

  const secured = (response: NextResponse, sensitive = false) => {
    response.headers.set('Content-Security-Policy', csp);
    if (sensitive) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      response.headers.set('Cache-Control', 'no-store');
    }
    return response;
  };

  // The internal address must not work, or the secret path would protect nothing. Show the normal 404 page.
  if (isInternalAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/__not-found__';
    return secured(NextResponse.rewrite(url, { status: 404 }), true);
  }

  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp); // Next.js reads the nonce from here and stamps it on its own scripts

  if (isAdminPage || isAdminApi) {
    const signedIn = !!(await verifySignedSession(request.cookies.get(SESSION_COOKIE)?.value));

    if (isAdminApi && !signedIn) return secured(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), true);

    if (isAdminPage) {
      const loginPath = ADMIN_BASE + '/login';
      if (pathname === loginPath) {
        // ?expired=1 means the browser was just told its session ended, so never bounce it back to the dashboard.
        if (signedIn && !request.nextUrl.searchParams.has('expired')) return secured(NextResponse.redirect(new URL(ADMIN_BASE, request.url)), true);
      } else if (!signedIn) {
        const login = new URL(loginPath, request.url);
        if (pathname !== ADMIN_BASE) login.searchParams.set('next', pathname);
        return secured(NextResponse.redirect(login), true);
      }

      if (remap) {
        const url = request.nextUrl.clone();
        url.pathname = INTERNAL_ADMIN + pathname.slice(ADMIN_BASE.length);
        return secured(NextResponse.rewrite(url, { request: { headers } }), true);
      }
    }
  }

  return secured(NextResponse.next({ request: { headers } }), isAdminPage || isAdminApi);
}

export const config = {
  matcher: [{ source: '/((?!_next/static|_next/image|favicon.ico|images/).*)' }],
};
