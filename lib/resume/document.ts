/**
 * The resume as a plain, ordered document. Both the PDF (lib/resume/pdf.ts) and the admin preview render this
 * same structure, so they cannot disagree about content or order. No Node APIs here: the browser imports it too.
 */
import { safeUrl } from '@/lib/safeUrl';
import { RESUME_SECTION_KEYS, type Resume, type ResumeSectionKey } from '@/lib/schemas';

export const RESUME_PDF_PATH = '/resume.pdf';

export const ACCENTS: Record<string, string> = {
  Navy: '#1F3A5F',
  Charcoal: '#222222',
  Teal: '#0F5C63',
  Burgundy: '#7A1F2B',
};

/** Standard headings: applicant tracking systems look for these exact words to split a resume into fields. */
export const SECTION_HEADINGS: Record<ResumeSectionKey, string> = {
  summary: 'Professional Summary',
  skills: 'Skills',
  experience: 'Professional Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  awards: 'Awards',
};

export interface ContactItem {
  text: string;
  href?: string;
}

export type ResumeItem =
  | { kind: 'text'; text: string }
  | { kind: 'skill'; label: string; text: string }
  | { kind: 'entry'; title: string; right?: string; meta?: string; link?: ContactItem; text?: string; bullets: string[] };

export interface ResumeSection {
  key: ResumeSectionKey;
  heading: string;
  items: ResumeItem[];
}

export interface ResumeDocument {
  name: string;
  headline: string;
  /** Printed as separate lines; each line is a list of items. */
  contact: ContactItem[][];
  sections: ResumeSection[];
  accent: string;
  pageSize: 'A4' | 'LETTER';
  keywords: string[];
}

/** True when there is a resume worth offering for download. */
export function hasResume(resume: Resume | null | undefined): boolean {
  return !!resume && resume.enabled !== false && !!resume.name?.trim();
}

/** A filename recruiters can recognise once it lands in their downloads folder. */
export function resumeFileName(resume: Resume): string {
  const base = (resume.name || 'Resume').normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || 'Candidate'}-Resume.pdf`;
}

/** "https://www.github.com/me/" -> "github.com/me". Parsers read the printed text, so the address itself must be visible. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');
}

const linkItem = (url: unknown): ContactItem | undefined => {
  const href = safeUrl(url);
  return /^https?:\/\//i.test(href) ? { text: displayUrl(href), href } : undefined;
};

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const compact = <T,>(values: (T | undefined | null | false | '')[]) => values.filter(Boolean) as T[];

/** The section order to print: saved order first, then any section the saved layout does not mention. */
export function resolveLayout(resume: Resume): { key: ResumeSectionKey; visible: boolean }[] {
  const saved = (resume.layout || []).filter((l) => RESUME_SECTION_KEYS.includes(l.key));
  const missing = RESUME_SECTION_KEYS.filter((key) => !saved.some((l) => l.key === key));
  return [...saved.map((l) => ({ key: l.key, visible: l.visible !== false })), ...missing.map((key) => ({ key, visible: true }))];
}

function buildItems(key: ResumeSectionKey, r: Resume): ResumeItem[] {
  switch (key) {
    case 'summary':
      return clean(r.summary) ? [{ kind: 'text', text: clean(r.summary) }] : [];
    case 'skills':
      return (r.skills || [])
        .filter((s) => s.items?.length)
        .map((s) => ({ kind: 'skill', label: s.category, text: (s.items || []).join(', ') }));
    case 'experience':
      return (r.experience || []).map((e) => ({
        kind: 'entry',
        title: e.role,
        right: clean(e.period),
        meta: compact([e.company, clean(e.location)]).join(' | '),
        bullets: e.bullets || [],
      }));
    case 'projects':
      return (r.projects || []).map((p) => ({
        kind: 'entry',
        title: p.name,
        meta: p.tech?.length ? p.tech.join(', ') : undefined,
        link: linkItem(p.url),
        text: clean(p.description),
        bullets: [],
      }));
    case 'education':
      return (r.education || []).map((e) => ({
        kind: 'entry',
        title: e.degree,
        right: clean(e.period),
        meta: compact([e.institution, clean(e.location)]).join(' | '),
        text: clean(e.details),
        bullets: [],
      }));
    case 'certifications':
      return (r.certifications || []).map((c) => ({
        kind: 'entry',
        title: compact([c.title, clean(c.issuer)]).join(' | '),
        right: clean(c.date),
        link: linkItem(c.url),
        bullets: [],
      }));
    case 'awards':
      return (r.awards || []).map((a) => ({
        kind: 'entry',
        title: compact([a.title, clean(a.issuer)]).join(' | '),
        right: clean(a.date),
        link: linkItem(a.url),
        text: clean(a.description),
        bullets: [],
      }));
  }
}

export function buildResumeDocument(r: Resume): ResumeDocument {
  const digits = clean(r.phone).replace(/[^\d+]/g, '');
  const firstLine = compact<ContactItem>([
    clean(r.location) && { text: clean(r.location) },
    clean(r.phone) && { text: clean(r.phone), href: `tel:${digits}` },
    clean(r.email) && { text: clean(r.email), href: `mailto:${clean(r.email)}` },
  ]);
  const secondLine = compact<ContactItem>([linkItem(r.linkedin), linkItem(r.github), linkItem(r.website)]);

  return {
    name: clean(r.name),
    headline: clean(r.headline),
    contact: [firstLine, secondLine].filter((line) => line.length),
    sections: resolveLayout(r)
      .filter((l) => l.visible)
      .map(({ key }) => ({ key, heading: SECTION_HEADINGS[key], items: buildItems(key, r) }))
      .filter((s) => s.items.length),
    accent: ACCENTS[r.accent || 'Navy'] || ACCENTS.Navy,
    pageSize: r.pageSize === 'US Letter' ? 'LETTER' : 'A4',
    keywords: (r.skills || []).flatMap((s) => s.items || []).slice(0, 60),
  };
}

/** All printed text, in reading order. */
export function resumePlainText(doc: ResumeDocument): string {
  const parts: string[] = [doc.name, doc.headline, ...doc.contact.flat().map((c) => c.text)];
  for (const section of doc.sections) {
    parts.push(section.heading);
    for (const item of section.items) {
      if (item.kind === 'text') parts.push(item.text);
      else if (item.kind === 'skill') parts.push(`${item.label}: ${item.text}`);
      else parts.push(item.title, item.right || '', item.meta || '', item.link?.text || '', item.text || '', ...item.bullets);
    }
  }
  return parts.filter(Boolean).join('\n');
}

// ------------------------------------------------------------------ printable characters

/**
 * The PDF uses Helvetica, a built-in font every parser can read, and it only has Western European characters.
 * Anything else (arrows, emoji, non-Latin scripts) would print as a blank, so the admin check warns about it.
 */
const PRINTABLE = /[\x20-\x7E\xA0-\xFFŒœŠšŸŽžƒˆ˜–—‘-‚“-„†-•…‰‹›€™\n]/;

export function unprintableChars(text: string): string[] {
  return Array.from(new Set(Array.from(text).filter((ch) => !PRINTABLE.test(ch))));
}

export function toPrintable(text: string): string {
  return Array.from(text)
    .map((ch) => (ch === '→' ? '->' : PRINTABLE.test(ch) ? ch : ''))
    .join('');
}

// ------------------------------------------------------------------ ATS check

export interface ResumeCheck {
  ok: boolean;
  label: string;
  /** What to do about it. Shown only when the check fails. */
  fix?: string;
}

const DATE_RANGE = /^[A-Z][a-z]{2,8} \d{4} [–-] (Present|[A-Z][a-z]{2,8} \d{4})$/;
const HAS_NUMBER = /\d/;

export function checkResume(r: Resume): ResumeCheck[] {
  const doc = buildResumeDocument(r);
  const text = resumePlainText(doc);
  const lower = text.toLowerCase();
  const jobs = r.experience || [];
  const bullets = jobs.flatMap((j) => j.bullets || []);
  const summaryWords = clean(r.summary).split(/\s+/).filter(Boolean).length;
  const skillCount = (r.skills || []).reduce((n, s) => n + (s.items?.length || 0), 0);
  const badDates = jobs.filter((j) => !DATE_RANGE.test(clean(j.period)));
  const thinJobs = jobs.filter((j) => (j.bullets?.length || 0) < 2);
  const longBullets = bullets.filter((b) => b.split(/\s+/).length > 35);
  const quantified = bullets.filter((b) => HAS_NUMBER.test(b)).length;
  const unprintable = unprintableChars(text);
  const keywords = r.targetKeywords || [];
  const missingKeywords = keywords.filter((k) => !lower.includes(k.toLowerCase()));

  const checks: ResumeCheck[] = [
    {
      ok: !!(clean(r.name) && clean(r.email) && clean(r.phone) && clean(r.location)),
      label: 'Name, email, phone and location are filled in',
      fix: 'Parsers fill the candidate record from these. Add whichever is missing in Basics.',
    },
    { ok: !!clean(r.headline), label: 'Job title under your name', fix: 'Add the title you are applying for in Basics.' },
    { ok: !!clean(r.linkedin), label: 'LinkedIn address is printed', fix: 'Recruiters look for it. Add it in Basics.' },
    {
      ok: summaryWords >= 30 && summaryWords <= 100,
      label: 'Summary is 30 to 100 words',
      fix: `It is ${summaryWords} words now.`,
    },
    { ok: skillCount >= 10, label: 'At least 10 skills listed', fix: `You have ${skillCount}. Skills are the main keyword source.` },
    { ok: jobs.length > 0, label: 'At least one job listed', fix: 'Add your work history under Experience.' },
    {
      ok: jobs.length > 0 && badDates.length === 0,
      label: 'Job dates use one clear format',
      fix: `Write them like "Sep 2024 – Jul 2025". Check: ${badDates.map((j) => j.company).join(', ') || 'your jobs'}.`,
    },
    { ok: jobs.length > 0 && thinJobs.length === 0, label: 'Every job has at least 2 bullets', fix: `Add more to: ${thinJobs.map((j) => j.company).join(', ')}.` },
    { ok: longBullets.length === 0, label: 'Bullets are 35 words or fewer', fix: `${longBullets.length} bullet(s) are too long to scan quickly.` },
    { ok: quantified >= 3, label: 'At least 3 bullets include a number', fix: `${quantified} do now. Numbers such as test counts or time saved make impact concrete.` },
    { ok: (r.education || []).length > 0, label: 'Education is listed', fix: 'Many systems filter on it. Add it under Education.' },
    {
      ok: unprintable.length === 0,
      label: 'All characters can be printed',
      fix: `These would be left out of the PDF: ${unprintable.slice(0, 12).join(' ')}`,
    },
  ];
  if (keywords.length) {
    checks.push({
      ok: missingKeywords.length === 0,
      label: `Target keywords found (${keywords.length - missingKeywords.length} of ${keywords.length})`,
      fix: `Missing: ${missingKeywords.join(', ')}. Add the ones that are true for you.`,
    });
  }
  return checks;
}
