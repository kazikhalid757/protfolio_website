import { ImageResponse } from 'next/og';
import { getPortfolioData } from '@/lib/data';

// Browser-tab icon: your initials on charcoal with the orange accent.
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function Icon() {
  const p = (await getPortfolioData()).profile;
  const initials = (p.shortName || p.name || 'KT').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121212', color: '#F5F2EA', fontSize: 30, fontWeight: 700, position: 'relative' }}>
        {initials}
        <div style={{ position: 'absolute', right: 6, bottom: 6, width: 10, height: 10, background: '#FF4F1F' }} />
      </div>
    ),
    { ...size, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } }
  );
}
