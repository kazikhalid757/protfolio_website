/**
 * Defence in depth for links rendered from editable content.
 * The admin API already refuses unsafe links; this guarantees the page can never emit a
 * javascript:, data: or protocol-relative (//host) href even if bad data got into the database some other way.
 */
export function safeUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  return /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(url) ? url : '';
}

/** Escape a value for embedding inside a <script type="application/ld+json"> block. */
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
