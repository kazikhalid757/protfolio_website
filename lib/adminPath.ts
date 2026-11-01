/**
 * Where the admin panel lives in the browser.
 *
 * The pages stay in app/admin internally; the middleware maps this public path onto them and answers a plain 404 for
 * the internal /admin address, so only the configured path works. Change it with NEXT_PUBLIC_ADMIN_PATH (needs a rebuild).
 *
 * This file is shared by the edge middleware and the browser, so it must stay free of Node-only imports.
 */
const DEFAULT_ADMIN_PATH = '/kasitamim/admin';

/** The folder the admin pages really live in. Never shown to visitors when ADMIN_BASE differs. */
export const INTERNAL_ADMIN = '/admin';

/** Turn a setting into a safe absolute path: lowercase letters, digits, "-" and "_" in 1 to 4 segments. */
export function normalizeAdminPath(raw?: string): string {
  const cleaned = '/' + (raw || '').trim().replace(/^\/+|\/+$/g, '');
  const segments = cleaned.split('/').filter(Boolean);
  const valid =
    segments.length >= 1 &&
    segments.length <= 4 &&
    segments.every((s) => /^[a-z0-9][a-z0-9_-]*$/i.test(s)) &&
    !['api', '_next'].includes(segments[0].toLowerCase());
  return valid ? '/' + segments.join('/').toLowerCase() : DEFAULT_ADMIN_PATH;
}

/** Public admin base, e.g. "/kasitamim/admin". */
export const ADMIN_BASE = normalizeAdminPath(process.env.NEXT_PUBLIC_ADMIN_PATH);

/** adminHref('/profile') -> "/kasitamim/admin/profile"; adminHref() -> the base itself. */
export function adminHref(sub = ''): string {
  return ADMIN_BASE + sub;
}

/**
 * Where to send someone whose session ended (revoked, expired, or erased from the database).
 * The ?expired=1 marker tells the middleware not to bounce them back to the dashboard, which makes a redirect loop
 * impossible even if a stale cookie is still in the browser.
 */
export const ADMIN_LOGIN_EXPIRED = ADMIN_BASE + '/login?expired=1';

/** Make a pathname comparable with adminHref(): maps an internal /admin/... path onto the public base. */
export function toPublicAdminPath(pathname: string): string {
  if (ADMIN_BASE !== INTERNAL_ADMIN && (pathname === INTERNAL_ADMIN || pathname.startsWith(INTERNAL_ADMIN + '/'))) {
    return ADMIN_BASE + pathname.slice(INTERNAL_ADMIN.length);
  }
  return pathname;
}
