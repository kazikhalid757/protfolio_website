import { ImageResponse } from 'next/og';
import { getPortfolioData } from '@/lib/data';

// The picture shown when the site is shared on LinkedIn, X, WhatsApp, Slack and so on. Built from your profile.
export const alt = 'Portfolio preview: name, role and main skills';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function OpenGraphImage() {
  const data = await getPortfolioData();
  const p = data.profile;
  // Short tool names, at most two per skill group, so the card stays readable and shows the searchable tools.
  const chips = (data.skills || [])
    .flatMap((g) => (g.items || []).map((i) => i.name).filter((n) => n.length <= 20).slice(0, 2))
    .slice(0, 8);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#F5F2EA', padding: 72, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 20, height: 20, background: '#FF4F1F' }} />
          <div style={{ fontSize: 26, color: '#6B675E', letterSpacing: 4, textTransform: 'uppercase' }}>{p.location?.split(',').slice(-2).join(',').replace(/\s*-\s*\d+/, '').trim() || 'Portfolio'}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, lineHeight: 1.04, color: '#121212', fontWeight: 700, letterSpacing: -2 }}>{p.name}</div>
          <div style={{ marginTop: 20, fontSize: 48, color: '#FF4F1F', fontWeight: 600 }}>{p.title || 'Portfolio'}</div>
          <div style={{ marginTop: 18, fontSize: 28, color: '#2B2A27', lineHeight: 1.35, maxWidth: 940 }}>{(p.tagline || '').slice(0, 120)}</div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {chips.map((c) => (
            <div key={c} style={{ display: 'flex', padding: '10px 18px', border: '2px solid #121212', fontSize: 24, color: '#121212' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
