/** The public URL of the site, used for metadata, the sitemap and robots.txt. */
export function getSiteUrl(profile?: { siteUrl?: string } | null): string {
  const candidates = [
    profile?.siteUrl,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    'http://localhost:3000',
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate).origin;
    } catch {}
  }
  return 'http://localhost:3000';
}
