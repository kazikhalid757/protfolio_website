# Database (Neon Postgres)

All tables live in their own schema, `portfolio`. Nothing here touches the `public` schema, so the portfolio can share a
database with another application.

| Table | Purpose |
| --- | --- |
| `site_content` | One JSONB row per section (`profile`, `experiences`, …) with a `version` that increases on every save. |
| `content_revisions` | Every saved version of every section (50 kept per section). Powers History / restore. |
| `messages` | Contact-form inbox. Visitor IP is stored only as a keyed hash. |
| `admin_sessions` | Server-side sessions so a device can be listed and revoked. |
| `rate_limits` | Fixed-window counters shared by all serverless instances. |
| `audit_log` | Sign-ins, failed attempts, saves, revokes (kept 90 days). |
| `analytics_sessions` | One row per visit: anonymous daily visitor hash, country, device, browser, OS, referrer, utm source, last-seen time. No IP address. |
| `analytics_events` | Clicks, section views, form start and message sent, per visit. Both analytics tables are kept about 14 months. |

The schema is defined once in [`lib/migrations.mjs`](../lib/migrations.mjs) and is safe to run repeatedly.

## Set up

```bash
# .env.local needs DATABASE_ADMIN_URL (the Neon owner connection string)
npm run db:setup
```

This creates the schema and tables, fills empty sections from `data/portfolio.json` (it never overwrites existing content),
creates the restricted role `portfolio_app`, and writes its connection string into `.env.local` as `DATABASE_URL`.
Use `npm run db:rotate` to generate a new password for that role.

## Two connection strings

| Variable | User | Used by | Put on Vercel? |
| --- | --- | --- | --- |
| `DATABASE_URL` | `portfolio_app` (restricted) | the running site | **Yes** |
| `DATABASE_ADMIN_URL` | owner | `npm run db:setup` only | **No** |

## Reliability

- The driver talks to Neon over HTTPS (works on Vercel serverless, no connection pool to manage).
- Each attempt times out after 5 s and network errors are retried up to 3 times; SQL errors are never retried.
- Queries opt out of the Next.js fetch cache, so a read always reaches Postgres.
- The Vercel function region is pinned to `iad1` (`vercel.json`) to sit next to a Neon `us-east-1` database.

## Backups

Neon keeps point-in-time history for your plan's retention window. For your own copy, use Settings → Export JSON; restoring
is validated and all-or-nothing.

## Removing the portfolio

`DROP SCHEMA portfolio CASCADE; DROP ROLE portfolio_app;` (run as the owner). Nothing else is affected.
