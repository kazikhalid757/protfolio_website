import { ImageResponse } from 'next/og';
import { getPortfolioData } from '@/lib/data';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function AppleIcon() {
  const p = (await getPortfolioData()).profile;
  const initials = (p.shortName || p.name || 'KT').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121212', color: '#F5F2EA', fontSize: 84, fontWeight: 700, position: 'relative' }}>
        {initials}
        <div style={{ position: 'absolute', right: 18, bottom: 18, width: 26, height: 26, background: '#FF4F1F' }} />
      </div>
    ),
    { ...size, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } }
  );
}
