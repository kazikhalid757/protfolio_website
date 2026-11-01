# SEO

Everything search engines and social networks read is built from the same content you edit in the admin, so it never drifts from the page.

## What is in place

- **Title and description** with your full name, role and city. Edit them in **Admin → Profile → Search & social (SEO)**; leave empty to use your name, title and bio.
- **Keywords**: roles and tools people search for (QA engineer, SDET, Playwright, Cypress, API testing, ...). They also feed the structured data.
- **Canonical URL**, `lang="en"`, viewport, theme colour, robots rules (index, follow, large image previews).
- **Open Graph and Twitter cards** with a generated 1200 x 630 share image (`/opengraph-image`) showing your name, role, tagline and main tools.
- **Structured data (JSON-LD)**: `Person` (name and short name, job title, address, skills, credentials, awards, current employer, profile links), `WebSite`, `ProfilePage`, one `Service` per service you offer, and `SoftwareApplication` for products you built yourself.
- **Icons and manifest**: generated browser-tab and phone icons (`/icon`, `/apple-icon`) and `/manifest.webmanifest`.
- **sitemap.xml** with a real last-modified date taken from your last save, and **robots.txt**.
- **Fast pages**: fonts are self-hosted (no request to Google), one `<h1>`, descriptive alt text, semantic sections, and the page is a few tens of KB compressed.
- A branded **404** page that is never indexed.

## To do on your side

1. Set `NEXT_PUBLIC_SITE_URL` (or the Website address in Profile) to your real domain.
2. Add the site in Google Search Console and Bing Webmaster Tools, then put the verification codes in `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`. Submit `/sitemap.xml`.
3. Link to your site from LinkedIn, GitHub, Upwork and BugViso / RoleRival. Inbound links matter most.
4. Check the preview with the LinkedIn Post Inspector and Google's Rich Results Test.

Nothing here can guarantee a ranking; it makes sure the site is easy for search engines to understand and for people to share.
