import { MetadataRoute } from 'next';
import { getContentUpdatedAt, getPortfolioData } from '@/lib/data';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { profile } = await getPortfolioData();
  const updated = await getContentUpdatedAt();
  return [
    {
      url: getSiteUrl(profile),
      lastModified: updated ? new Date(updated) : undefined,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
