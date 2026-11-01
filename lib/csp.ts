/**
 * Content-Security-Policy, built per request with a fresh nonce.
 *
 * Only scripts that carry the nonce may run (and anything those scripts load: 'strict-dynamic'),
 * so an injected <script> tag is inert. Everything else is limited to this site, except Google Fonts and https images.
 */
export function buildCsp(nonce: string, dev = false): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    // Inline style attributes are used by the layout. Fonts are self-hosted, so no third-party font servers are allowed.
    `style-src 'self' 'unsafe-inline'`,
    `font-src 'self' data:`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(dev ? [] : [`upgrade-insecure-requests`]),
  ].join('; ');
}
