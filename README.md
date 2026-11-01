# Kazi Tamim: QA & Automation Engineer portfolio

A Next.js 14 portfolio whose content lives in **Neon Postgres** and is edited from a built-in, password-protected admin panel.
Edits appear on the live site the moment you save. If the database is ever unreachable, the public site keeps working from
the bundled `data/portfolio.json`.

## Run it locally

```bash
npm install
cp .env.example .env.local        # then fill in DATABASE_ADMIN_URL (Neon owner connection string)
npm run db:setup                  # creates tables, seeds your content, creates the restricted database user
npm run dev                       # http://localhost:3000   (admin: /kasitamim/admin)
```

The admin panel is at **`/kasitamim/admin`**; the plain `/admin` address returns 404. Change the path with `NEXT_PUBLIC_ADMIN_PATH`.
If your password contains `#`, `$`, quotes or spaces, put it in double quotes in `.env` (`ADMIN_PASSWORD="my#pass"`), otherwise everything after the `#` is dropped.
In development only, with no `ADMIN_PASSWORD` set, the admin password is `admin123`. That fallback is disabled in production.

## What is where

| Path | What |
| --- | --- |
| `app/page.tsx`, `components/` | The public site |
| `app/admin/`, `components/admin/` | The admin panel (one form schema per section in `components/admin/schemas.ts`) |
| `app/api/` | The API: public content, auth, contact, and everything under `/api/admin` |
| `lib/schemas.ts` | **Types and validation rules** for all content (zod). Every write is checked against these |
| `lib/data.ts` | Content storage: cached reads, versioned writes, history |
| `lib/db.ts`, `lib/migrations.mjs` | Neon client (retry + timeouts) and the database schema |
| `lib/auth.ts`, `lib/session.ts`, `middleware.ts` | Login, sessions, route protection, per-request CSP |
| `data/portfolio.json` | Starter content and outage fallback. `default-portfolio.json` is what Reset restores |
| `lib/analytics.ts`, `components/Analytics.tsx` | Cookie-free analytics: collector, tracker and report ([docs](docs/ANALYTICS.md)) |
| `lib/seo.ts`, `app/opengraph-image.tsx` | SEO: metadata, structured data, share image ([docs](docs/SEO.md)) |
| `docs/` | [API](docs/API.md), [Security](docs/SECURITY.md), [Database](docs/DATABASE.md), [Analytics](docs/ANALYTICS.md), [SEO](docs/SEO.md) |

## Deploy on Vercel

1. Push to GitHub and import the repo in Vercel.
2. Run `npm run db:setup` once on your computer (it prepares the database).
3. In Vercel → Project Settings → Environment Variables add:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | the `portfolio_app` connection string from your `.env.local` |
   | `ADMIN_PASSWORD` | 12+ characters |
   | `ADMIN_SECRET` | a random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `NEXT_PUBLIC_ADMIN_PATH` | optional: your own admin address (default `/kasitamim/admin`) |
   | `GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_SITE_URL` | optional: Search Console verification and your real domain ([SEO](docs/SEO.md)) |
   | `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | optional: also email every contact message to you |

   Do **not** add `DATABASE_ADMIN_URL` to Vercel.
4. Deploy. Content edits never need a redeploy.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run db:setup` · `npm run db:rotate` · `npm run typecheck`

See [docs/SECURITY.md](docs/SECURITY.md) for what is protected and what is not.
