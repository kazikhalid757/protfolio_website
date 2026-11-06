# API reference

All endpoints are same-origin JSON. Errors always look like `{ "error": "message", "details": ["optional", "list"] }`.

Types come from [`lib/schemas.ts`](../lib/schemas.ts): `Profile`, `Experience`, `Product`, `Service`, `SkillCategory`,
`Project`, `Award`, `Certification`, `PortfolioData`, `ContactInput`. The same schemas validate every write.

Sections: `profile`, `experiences`, `products`, `services`, `skills`, `projects`, `awards`, `certifications`, `resume`.

## Public (no sign-in)

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/content` | The whole portfolio (`PortfolioData`). Cached, refreshed the moment the admin saves. |
| GET | `/resume.pdf` | The resume as a PDF download, built from the saved `resume` section. `404` when the download is turned off or no name is set. |
| GET | `/api/content/{section}` | `{ section, data }`. `404` for an unknown section. |
| GET | `/api/health` | `{ status: "ok" \| "degraded", database: "ok" \| "down" \| "not_configured", latencyMs }`. `503` when degraded. |
| POST | `/api/contact` | Body `{ name, email, subject?, message, website?, elapsed? }` → `{ success: true }`. `400` invalid, `429` too many, `503` could not be delivered. |

`website` is a hidden honeypot and `elapsed` is the milliseconds the form was open; both exist only to catch bots.

## Analytics collector (public)

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/track` | Body `{ sid, type, name?, label?, path?, ref?, utm? }`, `type` one of `pageview`, `ping`, `click`, `section`, `form_start`, `message_sent`. Always `204` for traffic it ignores (bots, signed-in admin, cross-site). `400` for a malformed event. Capped at 250 events per visit. |

## Sign in

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth` | Body `{ password }`. Sets the session cookie. `401` wrong password, `429` locked out (8 tries / 15 min per IP), `503` not configured. |
| GET | `/api/auth` | `{ authenticated, configured, devDefault, database }`. |
| DELETE | `/api/auth` | Revokes this session and clears the cookie. |

## Admin (needs a signed-in session; `401` otherwise)

The admin *pages* are served at `NEXT_PUBLIC_ADMIN_PATH` (default `/kasitamim/admin`). The API paths below are fixed.

Mutating requests (`POST/PUT/PATCH/DELETE`) from another origin are rejected with `403`.

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/admin/portfolio` | `{ data, versions, updatedAt }`. Fresh from the database (never cached). |
| PATCH | `/api/admin/portfolio` | Body `{ section, value, expectedVersion? }` → `{ section, value, version }`. `400` validation (see `details`), `409` if `expectedVersion` is stale. |
| PUT | `/api/admin/portfolio` | Replace everything (Import). Validated first and written in one transaction. |
| POST | `/api/admin/portfolio/reset` | Replace everything with `data/default-portfolio.json`. |
| POST | `/api/admin/resume/pdf` | Body `{ value }` → a PDF of the unsaved draft, with the page count in `X-Resume-Pages`. Stores nothing. `400` validation (see `details`). |
| GET | `/api/admin/portfolio/revisions?section=X` | `{ revisions: [{ id, version, actor, createdAt }] }` (latest 30; 50 are kept). |
| GET | `/api/admin/portfolio/revisions?section=X&id=N` | `{ data }`, the saved content of that version. |
| GET | `/api/admin/messages` | `{ messages, available, emailDelivery }`. |
| PATCH | `/api/admin/messages` | Body `{ id, read }`. |
| DELETE | `/api/admin/messages?id=UUID` | Delete one message. |
| GET | `/api/admin/sessions` | Signed-in devices (`current` marks yours). |
| DELETE | `/api/admin/sessions?id=UUID` | Revoke one device. `?all=1` revokes every device, including this one. |
| GET | `/api/admin/analytics?days=7\|30\|90&tz=Asia/Dhaka` | The analytics report (`AnalyticsReport` in `lib/analytics.ts`): KPIs with previous-period change, daily series, clicks, scroll depth, sources, durations, recent activity. |
| DELETE | `/api/admin/analytics` | Erase all analytics data. |
| GET | `/api/admin/audit` | The last 40 security events. |
| GET | `/api/admin/status` | Setup health: database, password/secret/email flags. Never returns secret values. |

### Conflict detection

`GET /api/admin/portfolio` returns a `version` per section. Send it back as `expectedVersion` when saving.
If someone saved that section in the meantime the server answers `409` instead of silently overwriting their work.

### Validation rules (summary)

- Text has length limits; lists have item limits; unknown extra keys are kept.
- Links must be `https://`, `http://`, `mailto:`, `tel:`, `/path` or `#anchor`. `javascript:`, `data:`, `vbscript:` and `//host` are rejected.
- `profile.name`, `experience.role/company/period`, `product.name`, and similar identifying fields are required.
- A document over about 600 KB is rejected.
