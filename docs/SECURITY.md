# Security model

## What protects what

| Risk | Control |
| --- | --- |
| Bots probing for `/admin` | The admin lives at a custom path (default `/kasitamim/admin`, set by `NEXT_PUBLIC_ADMIN_PATH`). The plain `/admin` address returns the normal 404 page, even when you are signed in, and the path is deliberately not listed in `robots.txt`. A hidden path only reduces noise; the password, sessions and rate limits are what actually protect you. |
| Someone guesses the admin password | 8 tries per 15 minutes per IP and 60 per hour overall, stored in the database so every serverless instance shares them. Failed and blocked attempts are logged. The password is compared in constant time. |
| A forged or stolen cookie | The cookie is `sessionId.expiry.HMAC` signed with `ADMIN_SECRET`. A valid signature is **not enough**: the session must also exist, be un-revoked and un-expired in the database. In production the cookie is `__Host-` prefixed, `Secure`, `HttpOnly`, `SameSite=Lax`. |
| A device you no longer trust | Settings lists signed-in devices; each can be signed out, or all at once. Revocation takes effect on the very next request. |
| Cross-site request forgery | `SameSite=Lax` cookie plus a same-origin check on every state-changing request. |
| Cross-site scripting (XSS) | Strict nonce-based Content-Security-Policy (`script-src 'self' 'nonce-…' 'strict-dynamic'`, no `unsafe-inline`, no `unsafe-eval` in production). React escapes all content. Links go through `safeUrl()` so a `javascript:` href cannot render even if bad data reached the database. JSON-LD is escaped. |
| Malicious or oversized input | Every write is validated against zod schemas (types, lengths, link safety, item counts); request bodies are size-limited; contact messages have control characters stripped. |
| SQL injection | Every query uses bound parameters; ids are format-checked first. |
| Clickjacking and sniffing | `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict `Referrer-Policy`, locked-down `Permissions-Policy`, HSTS, COOP. `X-Powered-By` is removed. |
| Analytics abuse | `/api/track` ignores bots, validates every field with a strict schema, caps events per visit, and ignores cross-site posts. It stores no IP address and sets no cookie; visitors are a daily keyed hash. Do Not Track and Global Privacy Control are respected. |
| Third-party tracking | None. Fonts are self-hosted and the Content-Security-Policy allows no outside script, style or font servers, so visitors' browsers only ever talk to your own site. |
| Contact-form spam | Hidden honeypot, minimum fill time, per-visitor and overall rate limits, schema validation. Visitor IPs are stored only as a keyed hash. |
| A compromised website reaching other data | The site connects as `portfolio_app`, a database role that can only read and write the `portfolio` schema. It cannot read other tables in the same database, create or drop tables, or create roles. |
| A database outage | The public site, sitemap and robots keep working from the bundled `data/portfolio.json`. Admin and contact answer with a clean `503`. Nothing sensitive appears in error messages. |
| Lost or mistaken edits | Every save is kept as a revision (50 per section) and can be restored from History. |
| Secrets in the repo | `.env.local` is git-ignored; `.env.example` has placeholders only. The owner database URL is used only by `npm run db:setup` on your machine. |

## Things to do

1. Set `ADMIN_PASSWORD` (12+ characters) and `ADMIN_SECRET` in Vercel.
2. Use only the restricted `DATABASE_URL` (user `portfolio_app`) in Vercel. Never add `DATABASE_ADMIN_URL`.
3. If a database password was ever pasted into a chat, email or ticket, rotate it in the Neon dashboard.
4. Prefer a separate Neon project (or a Neon branch) for the portfolio, so a problem here can never touch another app's data.

## Known limits

- One admin account (a shared password). There is no two-factor sign-in.
- Rate limits are per source IP address; visitors behind one shared IP share a bucket.
- `style-src` still allows inline styles (the layout uses `style=""` attributes).
- Photos are referenced by path or URL; there is no upload feature (and so no upload attack surface).
