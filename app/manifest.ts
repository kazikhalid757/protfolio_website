import { MetadataRoute } from 'next';
import { getPortfolioData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const p = (await getPortfolioData()).profile;
  return {
    name: `${p.name}: ${p.title || 'Portfolio'}`,
    short_name: p.shortName || p.name,
    description: p.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F2EA',
    theme_color: '#121212',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
