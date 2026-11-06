/**
 * Single source of truth for the shape of the portfolio content.
 *
 * Each schema is used three ways:
 *  1. the server validates every write against it (nothing unchecked reaches the database),
 *  2. the TypeScript types below are inferred from it (so the code and the rules cannot drift apart),
 *  3. text limits stop oversized or malicious input.
 *
 * Objects are "loose": unknown keys (for example old icon/level fields) are kept untouched.
 */
import { z } from 'zod';

// ------------------------------------------------------------------ building blocks

/** A short, trimmed string. */
const text = (max = 300) => z.string().trim().max(max, `Keep this under ${max} characters`);

/** A longer paragraph. */
const paragraph = (max = 3000) => z.string().trim().max(max, `Keep this under ${max} characters`);

/**
 * A link that is safe to put in an href: https://, http://, mailto:, tel:, a /path or a #anchor.
 * Rejects javascript:, data:, vbscript: and protocol-relative //host links.
 */
const link = z
  .string()
  .trim()
  .max(2000, 'Link is too long')
  .refine((v) => v === '' || /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(v), {
    message: 'Must be an https:// link, a /path or a #anchor',
  });

/** An absolute website address. */
const webUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === '' || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v), { message: 'Must start with https://' });

const list = (maxItems = 40, maxLength = 500) => z.array(text(maxLength)).max(maxItems, `At most ${maxItems} items`);

const emailOrEmpty = z.union([z.literal(''), z.email('Enter a valid email address').max(200)]);

// ------------------------------------------------------------------ sections

export const profileSchema = z.looseObject({
  name: text(100).min(1, 'Name is required'),
  shortName: text(60).optional(),
  title: text(120).optional(),
  tagline: text(300).optional(),
  bio: paragraph(2000).optional(),
  email: emailOrEmpty.optional(),
  phone: text(40).optional(),
  location: text(150).optional(),
  avatar: link.optional(),
  resumeUrl: link.optional(),
  siteUrl: webUrl.optional(),
  availableForHire: z.boolean().optional(),
  availabilityStatus: text(150).optional(),
  /** Search and social-sharing text. Everything has a sensible default when left empty. */
  seo: z
    .looseObject({
      title: text(70).optional(),
      description: text(200).optional(),
      keywords: list(60, 60).optional(),
    })
    .optional(),
  metrics: z.record(z.string(), text(30)).optional(),
  socials: z.record(z.string(), link).optional(),
});

export const experienceSchema = z.looseObject({
  id: text(80).optional(),
  role: text(150).min(1, 'Role is required'),
  company: text(150).min(1, 'Company is required'),
  location: text(150).optional(),
  period: text(80).min(1, 'Period is required'),
  type: text(80).optional(),
  product: text(120).optional(),
  summary: paragraph(600).optional(),
  highlights: list(12, 600).optional(),
  techStack: list(30, 60).optional(),
});

export const productSchema = z.looseObject({
  id: text(80).optional(),
  kind: z.enum(['Built by me', 'QA on the team']).optional(),
  name: text(120).min(1, 'Name is required'),
  tagline: text(300).optional(),
  role: text(200).optional(),
  url: link.optional(),
  problem: paragraph(1200).optional(),
  built: paragraph(1200).optional(),
  stats: list(10, 150).optional(),
  stack: list(30, 60).optional(),
});

export const serviceSchema = z.looseObject({
  id: text(80).optional(),
  title: text(150).min(1, 'Title is required'),
  summary: paragraph(600).optional(),
  deliverables: list(12, 300).optional(),
  hireUrl: link.optional(),
});

export const skillItemSchema = z.looseObject({
  name: text(100).min(1, 'Skill name is required'),
  experience: text(40).optional(),
});

export const skillCategorySchema = z.looseObject({
  category: text(100).min(1, 'Group name is required'),
  items: z.array(skillItemSchema).max(40).optional(),
});

export const projectSchema = z.looseObject({
  id: text(80).optional(),
  title: text(200).min(1, 'Title is required'),
  description: paragraph(1000).optional(),
  metrics: text(300).optional(),
  tags: list(15, 60).optional(),
  github: link.optional(),
  liveDemo: link.optional(),
});

export const awardSchema = z.looseObject({
  id: text(80).optional(),
  title: text(200).min(1, 'Title is required'),
  issuer: text(150).min(1, 'Issuer is required'),
  date: text(60).optional(),
  description: paragraph(800).optional(),
  verifyUrl: link.optional(),
});

export const certificationSchema = z.looseObject({
  id: text(80).optional(),
  title: text(200).min(1, 'Title is required'),
  issuer: text(150).min(1, 'Issuer is required'),
  date: text(60).optional(),
  skills: list(12, 80).optional(),
  verifyUrl: link.optional(),
});

// ------------------------------------------------------------------ resume (the downloadable PDF)

export const RESUME_SECTION_KEYS = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'awards'] as const;
export type ResumeSectionKey = (typeof RESUME_SECTION_KEYS)[number];

export const resumeSchema = z.looseObject({
  /** false hides the Download button and makes /resume.pdf answer 404. */
  enabled: z.boolean().optional(),
  name: text(100).optional(),
  headline: text(120).optional(),
  email: emailOrEmpty.optional(),
  phone: text(40).optional(),
  location: text(150).optional(),
  website: link.optional(),
  linkedin: link.optional(),
  github: link.optional(),
  summary: paragraph(1500).optional(),
  accent: z.enum(['Navy', 'Charcoal', 'Teal', 'Burgundy']).optional(),
  pageSize: z.enum(['A4', 'US Letter']).optional(),
  /** Keywords from the jobs being targeted. Only used by the admin check, never printed. */
  targetKeywords: list(60, 60).optional(),
  /** Order and visibility of the printed sections. */
  layout: z.array(z.looseObject({ key: z.enum(RESUME_SECTION_KEYS), visible: z.boolean().optional() })).max(RESUME_SECTION_KEYS.length).optional(),
  skills: z.array(z.looseObject({ category: text(100).min(1, 'Group name is required'), items: list(40, 80).optional() })).max(20).optional(),
  experience: z
    .array(
      z.looseObject({
        id: text(80).optional(),
        role: text(150).min(1, 'Role is required'),
        company: text(150).min(1, 'Company is required'),
        location: text(150).optional(),
        period: text(80).optional(),
        bullets: list(12, 600).optional(),
      })
    )
    .max(30)
    .optional(),
  projects: z
    .array(
      z.looseObject({
        id: text(80).optional(),
        name: text(150).min(1, 'Project name is required'),
        description: paragraph(600).optional(),
        tech: list(20, 60).optional(),
        url: link.optional(),
      })
    )
    .max(30)
    .optional(),
  education: z
    .array(
      z.looseObject({
        id: text(80).optional(),
        degree: text(150).min(1, 'Degree is required'),
        institution: text(150).min(1, 'Institution is required'),
        location: text(150).optional(),
        period: text(80).optional(),
        details: text(300).optional(),
      })
    )
    .max(10)
    .optional(),
  certifications: z
    .array(
      z.looseObject({
        id: text(80).optional(),
        title: text(200).min(1, 'Certificate name is required'),
        issuer: text(150).optional(),
        date: text(60).optional(),
        url: link.optional(),
      })
    )
    .max(30)
    .optional(),
  awards: z
    .array(
      z.looseObject({
        id: text(80).optional(),
        title: text(200).min(1, 'Award name is required'),
        issuer: text(150).optional(),
        date: text(60).optional(),
        description: paragraph(400).optional(),
        url: link.optional(),
      })
    )
    .max(20)
    .optional(),
});

/** Schema for each stored section, by name. */
export const sectionSchemas = {
  profile: profileSchema,
  experiences: z.array(experienceSchema).max(40),
  products: z.array(productSchema).max(40),
  services: z.array(serviceSchema).max(20),
  skills: z.array(skillCategorySchema).max(20),
  projects: z.array(projectSchema).max(80),
  awards: z.array(awardSchema).max(40),
  certifications: z.array(certificationSchema).max(40),
  resume: resumeSchema,
} as const;

export type SectionName = keyof typeof sectionSchemas;
export const SECTION_NAMES = Object.keys(sectionSchemas) as SectionName[];

export function isSectionName(value: unknown): value is SectionName {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(sectionSchemas, value);
}

// ------------------------------------------------------------------ contact form

export const contactSchema = z.object({
  name: text(100).min(1, 'Please enter your name'),
  email: z.email('Please enter a valid email address').max(200),
  subject: text(150).optional(),
  message: paragraph(5000).min(10, 'Your message is a little short'),
  // Bot traps. `website` is a hidden field real people never fill; `elapsed` is ms since the form appeared.
  website: z.string().optional(),
  elapsed: z.number().optional(),
});

// ------------------------------------------------------------------ inferred types

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Product = z.infer<typeof productSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Project = z.infer<typeof projectSchema>;
export type Award = z.infer<typeof awardSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/** Everything the public site renders. */
export interface PortfolioData {
  profile: Profile;
  experiences: Experience[];
  products: Product[];
  services: Service[];
  skills: SkillCategory[];
  projects: Project[];
  awards: Award[];
  certifications: Certification[];
  resume: Resume;
}

// ------------------------------------------------------------------ validation helpers

/** Outcome of a validation. `data` is set when `ok`, `errors` otherwise (kept flat so it narrows without strict mode). */
export interface Validation<T> {
  ok: boolean;
  data?: T;
  errors?: string[];
}

function formatIssues(error: z.ZodError, prefix = ''): string[] {
  return error.issues.slice(0, 8).map((issue) => {
    const where = issue.path.length ? issue.path.map((p) => (typeof p === 'number' ? `[${p + 1}]` : `.${String(p)}`)).join('').replace(/^\./, '') : '';
    return `${prefix}${where ? where + ': ' : ''}${issue.message}`;
  });
}

/** Validate (and trim) one section. */
export function validateSection(section: SectionName, value: unknown): Validation<unknown> {
  const parsed = sectionSchemas[section].safeParse(value);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, errors: formatIssues(parsed.error, `${section}: `) };
}

const MAX_DOCUMENT_BYTES = 600_000;

/** Validate a whole document (Import / Reset). Unknown top-level keys are dropped. */
export function validatePortfolio(value: unknown): Validation<Partial<Record<SectionName, unknown>>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, errors: ['Data must be a JSON object.'] };
  if (JSON.stringify(value).length > MAX_DOCUMENT_BYTES) return { ok: false, errors: ['Data is too large to save.'] };

  const record = value as Record<string, unknown>;
  const out: Partial<Record<SectionName, unknown>> = {};
  const errors: string[] = [];
  for (const section of SECTION_NAMES) {
    if (record[section] === undefined) continue;
    const result = validateSection(section, record[section]);
    if (result.ok) out[section] = result.data;
    else errors.push(...(result.errors ?? []));
  }
  if (!out.profile) errors.push('profile: a profile with a name is required.');
  return errors.length ? { ok: false, errors } : { ok: true, data: out };
}
