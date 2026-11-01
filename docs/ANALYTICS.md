# Analytics

Your own analytics, stored in your Neon database. No third party, no cookies, no IP addresses stored.
Open **Admin → Analytics**.

## What you see

| Panel | Meaning |
| --- | --- |
| Visitors | People counted once per day (see "How visitors are counted"). |
| Visits | One per page load. |
| Avg. time on site / Engaged visits | Measured while the page is visible and the visitor is active. Engaged = 10 seconds or more. |
| Hire me clicks | The nav "Hire me" button (desktop and phone menu) and "Hire me for this" in Services. |
| CV downloads, Messages received | Messages are counted from your inbox itself, so the number is always exact. |
| Hire-intent rate | Visits that clicked Hire me, downloaded the CV, used the email or phone link, or sent a message. |
| Visitors and visits, Hire me clicks, Messages | Charts per day, with hover tooltips, keyboard arrows and a table view. |
| What visitors clicked | Every tracked button and link, most clicked first. |
| How far people scroll | Share of visits that reached each section. |
| Time on site | How long visits lasted (five buckets). |
| Contact form | Started, sent, and completion rate. |
| Sources, countries, devices, browsers, campaigns | Where visitors come from. Countries need the Vercel deployment. |

Each tile compares with the previous period of the same length, but only when that period had at least 5 visits.

## How visitors are counted

- A **visit** is one page load. Its id exists only in the page's memory.
- A **visitor** is a keyed hash of IP address + browser + the date. It changes every day, so nobody can be followed across days, and the same person returning tomorrow counts again.
- **Time on site**: a tiny heartbeat every 15 seconds while the tab is visible and the visitor moved, scrolled or typed in the last minute.
- **Not counted**: bots and crawlers, anyone sending Do Not Track or Global Privacy Control, and you while you are signed in to the admin.

## Privacy

No cookies, no localStorage or sessionStorage, no fingerprinting, and no IP address is ever written to the database. The
visitor's browser only talks to your own site. Data is kept for about 14 months and you can erase all of it in
**Settings → Analytics data**. The footer tells visitors the analytics are anonymous and cookie-free.

## Tracking something new

Add `data-track="my_event"` (and optionally `data-track-label="Something"`) to any link or button on the public site.
Then add a friendly name for it in `CLICK_NAMES` in `app/admin/analytics/page.tsx`.

## Data model

`portfolio.analytics_sessions` (one row per visit) and `portfolio.analytics_events` (clicks, section views, form events).
See [DATABASE.md](DATABASE.md). The collector is `POST /api/track` and the report is `GET /api/admin/analytics`
([API.md](API.md)).
