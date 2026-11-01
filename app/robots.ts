import { MetadataRoute } from 'next';
import { getPortfolioData } from '@/lib/data';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { profile } = await getPortfolioData();
  return {
    // The admin path is deliberately NOT listed here: robots.txt is public. Admin pages send `X-Robots-Tag: noindex` instead.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${getSiteUrl(profile)}/sitemap.xml`,
  };
}
