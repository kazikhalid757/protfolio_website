/**
 * Portfolio content, stored in Neon Postgres (one JSONB row per section in portfolio.site_content).
 *
 * Reading (public site):  getPortfolioData()  is cached by tag and refreshed the moment the admin saves.
 *                         If the database is unreachable the site keeps working from the bundled seed file.
 * Writing (admin):        saveSection / saveAll validate against lib/schemas.ts, bump a version number
 *                         (so two tabs cannot silently overwrite each other), keep a revision, and write an audit entry.
 */
import fs from 'node:fs';
import path from 'node:path';
import { revalidateTag, unstable_cache } from 'next/cache';
import { audit } from './audit';
import { sql } from './db';
import { seedIfEmpty } from './migrations.mjs';
import {
  SECTION_NAMES,
  validatePortfolio,
  validateSection,
  type PortfolioData,
  type SectionName,
} from './schemas';

export const CONTENT_TAG = 'portfolio-content';
const MAX_REVISIONS_PER_SECTION = 50;

// ------------------------------------------------------------------ errors

/** The submitted data failed validation. */
export class ValidationError extends Error {
  status = 400;
  details: string[];
  constructor(details: string[]) {
    super('Some fields need attention.');
    this.details = details;
  }
}

/** The section was changed by someone else since it was loaded. */
export class ConflictError extends Error {
  status = 409;
  constructor(section: string) {
    super(`"${section}" was changed in another tab or device since you opened it. Load the latest version first.`);
  }
}

// ------------------------------------------------------------------ bundled seed (also the outage fallback)

function readJsonFile(name: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', name), 'utf-8'));
  } catch {
    return null;
  }
}

/** Your starting content, shipped in the repo (data/portfolio.json). */
export function getSeedData(): PortfolioData | null {
  return readJsonFile('portfolio.json') ?? readJsonFile('default-portfolio.json');
}

/** The original starter content, used by "Reset". */
export function getDefaultData(): PortfolioData | null {
  return readJsonFile('default-portfolio.json');
}

const emptyPortfolio = (): PortfolioData => ({
  profile: { name: 'Portfolio' },
  experiences: [],
  products: [],
  services: [],
  skills: [],
  projects: [],
  awards: [],
  certifications: [],
});

function assemble(rows: { section: string; data: unknown }[]): PortfolioData {
  const out: any = emptyPortfolio();
  for (const row of rows) if ((SECTION_NAMES as string[]).includes(row.section)) out[row.section] = row.data;
  return out;
}

// ------------------------------------------------------------------ public read

const readCached = unstable_cache(
  async () => {
    const rows = await sql()`SELECT section, data FROM portfolio.site_content`;
    if (!rows.some((r) => r.section === 'profile')) throw new Error('content has not been set up yet');
    return assemble(rows as any);
  },
  ['portfolio-content-v1'],
  { tags: [CONTENT_TAG], revalidate: 300 }
);

/** Content for the public site. Never throws: falls back to the bundled seed if the database is unavailable. */
export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    return await readCached();
  } catch (error) {
    console.error('content: serving the bundled seed because:', (error as Error).message);
    return getSeedData() ?? emptyPortfolio();
  }
}

const readUpdatedAt = unstable_cache(
  async () => {
    const rows = await sql()`SELECT max(updated_at) AS t FROM portfolio.site_content`;
    if (!rows[0]?.t) throw new Error('no content');
    return new Date(rows[0].t).toISOString();
  },
  ['portfolio-updated-v1'],
  { tags: [CONTENT_TAG], revalidate: 300 }
);

/** When the content last changed (for sitemap <lastmod> and structured data), or null if unknown. */
export async function getContentUpdatedAt(): Promise<string | null> {
  try {
    return await readUpdatedAt();
  } catch {
    return null;
  }
}

/** Make the public site pick up new content immediately. */
export function bustContentCache() {
  try {
    revalidateTag(CONTENT_TAG);
  } catch {
    // not in a request context (scripts); the 5-minute revalidate window still applies
  }
}

// ------------------------------------------------------------------ admin read

export interface AdminContent {
  data: PortfolioData;
  /** Current version of each section, sent back when saving to detect conflicting edits. */
  versions: Partial<Record<SectionName, number>>;
  updatedAt: Partial<Record<SectionName, string>>;
}

/** Fresh (uncached) content for the editor. Seeds an empty database from the bundled file on first use. */
export async function loadForAdmin(actor = 'admin'): Promise<AdminContent> {
  const q = sql();
  let rows = await q`SELECT section, data, version, updated_at FROM portfolio.site_content`;
  if (rows.length === 0) {
    const seed = getSeedData();
    if (seed) {
      await seedIfEmpty(q as any, seed as any, actor);
      rows = await q`SELECT section, data, version, updated_at FROM portfolio.site_content`;
      bustContentCache();
    }
  }
  const versions: AdminContent['versions'] = {};
  const updatedAt: AdminContent['updatedAt'] = {};
  for (const r of rows) {
    if (!(SECTION_NAMES as string[]).includes(r.section)) continue;
    versions[r.section as SectionName] = r.version;
    updatedAt[r.section as SectionName] = new Date(r.updated_at).toISOString();
  }
  return { data: assemble(rows as any), versions, updatedAt };
}

// ------------------------------------------------------------------ admin write

/**
 * One atomic statement: write the section, bump its version and record a revision.
 * When `expected` is a number the write only happens if the stored version still equals it.
 */
function writeStatement(q: any, section: string, json: string, actor: string, expected: number | null) {
  return q`
    WITH upd AS (
      INSERT INTO portfolio.site_content AS c (section, data, version, updated_by, updated_at)
      VALUES (${section}, ${json}::jsonb, 1, ${actor}, now())
      ON CONFLICT (section) DO UPDATE
         SET data = EXCLUDED.data, version = c.version + 1, updated_at = now(), updated_by = EXCLUDED.updated_by
       WHERE (${expected}::int IS NULL OR c.version = ${expected}::int)
      RETURNING version
    ), rev AS (
      INSERT INTO portfolio.content_revisions (section, version, data, actor)
      SELECT ${section}, version, ${json}::jsonb, ${actor} FROM upd
      RETURNING id
    )
    SELECT version FROM upd`;
}

async function pruneRevisions(section: string) {
  await sql()`
    DELETE FROM portfolio.content_revisions
     WHERE section = ${section}
       AND id NOT IN (SELECT id FROM portfolio.content_revisions WHERE section = ${section} ORDER BY id DESC LIMIT ${MAX_REVISIONS_PER_SECTION})`;
}

export interface SaveOptions {
  actor: string;
  ip?: string;
  /** Version the editor loaded. Omit to overwrite regardless. */
  expectedVersion?: number | null;
}

/** Validate and save one section. Returns the stored data and its new version. */
export async function saveSection(section: SectionName, value: unknown, opts: SaveOptions): Promise<{ data: unknown; version: number }> {
  const checked = validateSection(section, value);
  if (!checked.ok) throw new ValidationError(checked.errors ?? []);

  const rows = await writeStatement(sql(), section, JSON.stringify(checked.data), opts.actor, opts.expectedVersion ?? null);
  if (!rows.length) throw new ConflictError(section);

  await pruneRevisions(section);
  await audit('content_saved', `${section} v${rows[0].version}`, opts.ip);
  bustContentCache();
  return { data: checked.data, version: rows[0].version };
}

/** Replace everything at once (Import / Reset). All sections are written in one transaction. */
export async function saveAll(doc: unknown, opts: SaveOptions & { kind: 'content_imported' | 'content_reset' }): Promise<void> {
  const checked = validatePortfolio(doc);
  if (!checked.ok) throw new ValidationError(checked.errors ?? []);

  const sections = Object.entries(checked.data ?? {}) as [SectionName, unknown][];
  await sql().transaction((txn: any) => sections.map(([name, data]) => writeStatement(txn, name, JSON.stringify(data), opts.actor, null)));
  await Promise.all(sections.map(([name]) => pruneRevisions(name)));
  await audit(opts.kind, `${sections.length} sections`, opts.ip);
  bustContentCache();
}

export async function resetToDefaults(opts: SaveOptions): Promise<void> {
  const defaults = getDefaultData();
  if (!defaults) throw new ValidationError(['The starter content file (data/default-portfolio.json) is missing.']);
  await saveAll(defaults, { ...opts, kind: 'content_reset' });
}

// ------------------------------------------------------------------ revisions

export interface RevisionSummary {
  id: number;
  version: number;
  actor: string | null;
  createdAt: string;
}

export async function listRevisions(section: SectionName, limit = 30): Promise<RevisionSummary[]> {
  const rows = await sql()`
    SELECT id, version, actor, created_at FROM portfolio.content_revisions
     WHERE section = ${section} ORDER BY id DESC LIMIT ${limit}`;
  return rows.map((r) => ({ id: Number(r.id), version: r.version, actor: r.actor, createdAt: new Date(r.created_at).toISOString() }));
}

export async function getRevision(section: SectionName, id: number): Promise<unknown | null> {
  const rows = await sql()`SELECT data FROM portfolio.content_revisions WHERE section = ${section} AND id = ${id}`;
  return rows.length ? rows[0].data : null;
}
