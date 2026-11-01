import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import './globals.css';
import { getContentUpdatedAt, getPortfolioData } from '@/lib/data';
import { buildJsonLd, seoText } from '@/lib/seo';
import { jsonForScript } from '@/lib/safeUrl';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

// The fonts live in app/fonts and are served from this site: no request to Google (faster, private), and a build never
// needs the internet to fetch them. All three are open-source (SIL OFL); see app/fonts/README.md.
const serif = localFont({
  src: [
    { path: './fonts/instrument-serif.woff2', weight: '400', style: 'normal' },
    { path: './fonts/instrument-serif-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--nf-serif',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});
const sans = localFont({ src: './fonts/plus-jakarta-sans.woff2', weight: '200 800', variable: '--nf-sans', display: 'swap', adjustFontFallback: 'Arial' });
const mono = localFont({ src: './fonts/fira-code.woff2', weight: '300 700', variable: '--nf-mono', display: 'swap', adjustFontFallback: 'Arial' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F2EA',
  colorScheme: 'light',
};

/** Everything search engines and social networks read, built from the profile you edit in the admin. */
export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const p = data.profile;
  const site = getSiteUrl(p);
  const { title, description, keywords } = seoText(data);

  return {
    metadataBase: new URL(site),
    title,
    description,
    keywords,
    applicationName: p.name,
    authors: [{ name: p.name, url: site }],
    creator: p.name,
    publisher: p.name,
    category: 'technology',
    alternates: { canonical: '/' },
    formatDetection: { email: false, telephone: false, address: false },
    openGraph: { type: 'website', url: site, siteName: p.name, title, description, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    // Optional: paste the codes from Google Search Console / Bing Webmaster into these environment variables.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await getPortfolioData();
  const site = getSiteUrl(data.profile);
  const jsonLd = buildJsonLd(data, site, await getContentUpdatedAt());
  // Set by the middleware; lets our one inline script run under the strict Content-Security-Policy.
  const nonce = headers().get('x-nonce') ?? undefined;

  return (
    <html lang="en" className={`scroll-smooth ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: jsonForScript(jsonLd) }} />
      </head>
      <body className="bg-white text-slate-800 antialiased selection:bg-signal selection:text-white font-sans">{children}</body>
    </html>
  );
}
