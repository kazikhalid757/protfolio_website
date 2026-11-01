/**
 * Search-engine and social-sharing data, built from the same content the site renders (and you edit in the admin),
 * so it can never drift from what visitors see.
 */
import { safeUrl } from './safeUrl';
import type { PortfolioData } from './schemas';

const unique = <T,>(items: (T | undefined | null | '')[]): T[] => Array.from(new Set(items.filter(Boolean) as T[]));

function shorten(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export function skillNames(data: PortfolioData): string[] {
  return unique((data.skills || []).flatMap((g) => (g.items || []).map((i) => i.name)));
}

export function seoText(data: PortfolioData) {
  const p = data.profile;
  const title = p.seo?.title?.trim() || `${p.name} | ${p.title || 'Portfolio'}`;
  const description = shorten(p.seo?.description?.trim() || p.bio || p.tagline || `Portfolio of ${p.name}.`, 160);
  const keywords = unique([...(p.seo?.keywords || []), p.name, p.shortName, p.title, ...skillNames(data)]).slice(0, 60);
  return { title, description, keywords };
}

/** "Mirpur-2, Dhaka - 1216, Bangladesh" -> { locality: "Dhaka", country: "Bangladesh" } */
function place(location?: string) {
  const parts = (location || '').split(',').map((s) => s.trim()).filter(Boolean);
  return { country: parts.length > 1 ? parts[parts.length - 1] : undefined, locality: (parts[parts.length - 2] || parts[0] || '').replace(/\s*-\s*\d+$/, '') || undefined };
}

/** One JSON-LD @graph: the person, the website, the profile page, services and the products they built. */
export function buildJsonLd(data: PortfolioData, siteUrl: string, modifiedIso?: string | null) {
  const p = data.profile;
  const { description, keywords } = seoText(data);
  const personId = `${siteUrl}/#person`;
  const absolute = (u?: string) => (safeUrl(u) ? new URL(safeUrl(u), siteUrl).toString() : undefined);
  const { locality, country } = place(p.location);
  const current = (data.experiences || []).find((e) => /present/i.test(e.period || ''));
  const topSkills = skillNames(data).slice(0, 12);

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': personId,
    name: p.name,
    alternateName: unique([p.shortName && p.shortName !== p.name ? p.shortName : undefined]),
    jobTitle: p.title,
    description: p.bio,
    url: siteUrl,
    image: absolute(p.avatar) ? { '@type': 'ImageObject', url: absolute(p.avatar), caption: `${p.name}, ${p.title || ''}`.trim() } : undefined,
    email: p.email ? `mailto:${p.email}` : undefined,
    telephone: p.phone || undefined,
    address: locality || country ? { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country } : undefined,
    sameAs: unique(Object.values(p.socials || {}).map((u) => safeUrl(u))),
    knowsAbout: unique([...topSkills, ...keywords]).slice(0, 40),
    hasOccupation: p.title
      ? { '@type': 'Occupation', name: p.title, skills: topSkills.join(', '), occupationLocation: country ? { '@type': 'Country', name: country } : undefined }
      : undefined,
    worksFor: current ? { '@type': 'Organization', name: current.company } : undefined,
    award: unique((data.awards || []).map((a) => a.title)),
    hasCredential: (data.certifications || []).map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.title,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      url: absolute(c.verifyUrl),
    })),
  };

  const graph: Record<string, unknown>[] = [
    person,
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: p.name,
      description,
      inLanguage: 'en',
      publisher: { '@id': personId },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: `${p.name}: ${p.title || 'Portfolio'}`,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': `${siteUrl}/#website` },
      mainEntity: { '@id': personId },
      dateModified: modifiedIso || undefined,
    },
    ...(data.services || []).map((s) => ({
      '@type': 'Service',
      name: s.title,
      description: s.summary,
      serviceType: s.title,
      areaServed: 'Worldwide',
      provider: { '@id': personId },
      url: absolute(s.hireUrl),
    })),
    // Products that are the person's own work are "software applications"; products they only tested are not claimed.
    ...(data.products || [])
      .filter((x) => x.kind === 'Built by me' && safeUrl(x.url))
      .map((x) => ({
        '@type': 'SoftwareApplication',
        name: x.name,
        description: x.tagline || x.built,
        url: absolute(x.url),
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        author: { '@id': personId },
      })),
  ];

  return { '@context': 'https://schema.org', '@graph': graph };
}
