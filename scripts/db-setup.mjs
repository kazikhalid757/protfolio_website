// @ts-check
/**
 * One-time (and re-runnable) database setup. Run with:  npm run db:setup
 *
 *   - creates the "portfolio" schema and its tables           (never touches the "public" schema)
 *   - seeds empty content sections from data/portfolio.json   (never overwrites existing content)
 *   - creates a least-privilege role "portfolio_app" limited to that schema
 *   - writes DATABASE_URL (the restricted role) into .env.local
 *
 * Flags:  --rotate   generate a new password for portfolio_app and update .env.local
 *
 * It connects as the database OWNER using DATABASE_ADMIN_URL (kept only in .env.local, never on the host).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { migrate, provisionRole, seedIfEmpty, SCHEMA } from '../lib/migrations.mjs';

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, '.env.local');
const ROLE = 'portfolio_app';
const rotate = process.argv.includes('--rotate');

/** Minimal .env reader so the script has no extra dependency. */
function loadEnv() {
  for (const file of ['.env.local', '.env']) {  // first file wins, matching Next.js (.env.local overrides .env)
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  }
}

/** Set KEY=value in .env.local, replacing an existing line or appending one. */
function upsertEnv(key, value) {
  const lines = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8').split('\n') : [];
  const idx = lines.findIndex((l) => l.startsWith(key + '='));
  if (idx >= 0) lines[idx] = `${key}=${value}`;
  else lines.push(`${key}=${value}`);
  fs.writeFileSync(ENV_FILE, lines.join('\n').replace(/\n*$/, '\n'), { mode: 0o600 });
}

loadEnv();

const ownerUrl = process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!ownerUrl) {
  console.error('No database URL found. Put DATABASE_ADMIN_URL (the owner connection string) in .env.local.');
  process.exit(1);
}
const currentUser = new URL(process.env.DATABASE_URL || ownerUrl).username;
if (!process.env.DATABASE_ADMIN_URL && currentUser !== ROLE) {
  // First run: remember the owner URL under its own name so DATABASE_URL can be switched to the restricted role.
  upsertEnv('DATABASE_ADMIN_URL', ownerUrl);
}

const sql = /** @type {any} */ (neon(ownerUrl));

console.log(`Connected as ${new URL(ownerUrl).username}. Setting up schema "${SCHEMA}"...`);
await migrate(sql);
console.log('  tables ready');

const seedFile = ['data/portfolio.json', 'data/default-portfolio.json'].map((f) => path.join(ROOT, f)).find((f) => fs.existsSync(f));
if (seedFile) {
  const seeded = await seedIfEmpty(sql, JSON.parse(fs.readFileSync(seedFile, 'utf8')), 'setup');
  console.log(seeded.length ? `  seeded: ${seeded.join(', ')}` : '  content already present (left untouched)');
}

const password = crypto.randomBytes(24).toString('base64url');
const created = await provisionRole(sql, ROLE, password);
if (created || rotate) {
  if (!created) await sql.query(`ALTER ROLE ${ROLE} PASSWORD '${password.replace(/'/g, "''")}'`);
  const url = new URL(process.env.DATABASE_URL || ownerUrl);
  url.username = ROLE;
  url.password = password;
  upsertEnv('DATABASE_URL', url.toString());
  console.log(`  role "${ROLE}" ${created ? 'created' : 'password rotated'}; DATABASE_URL in .env.local now uses it`);
} else {
  console.log(`  role "${ROLE}" already exists (grants refreshed). Use --rotate if you need a new password.`);
}

const counts = await sql.query(
  `SELECT 'site_content' t, count(*)::int n FROM ${SCHEMA}.site_content
   UNION ALL SELECT 'content_revisions', count(*)::int FROM ${SCHEMA}.content_revisions
   UNION ALL SELECT 'messages', count(*)::int FROM ${SCHEMA}.messages`
);
console.log('Done.', counts.map((/** @type {any} */ c) => `${c.t}=${c.n}`).join('  '));
