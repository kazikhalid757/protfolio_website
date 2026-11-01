// @ts-check
/**
 * Database schema for the portfolio, kept in plain JS so both the app and `npm run db:setup` can use it.
 *
 * EVERYTHING lives in the dedicated "portfolio" schema. Nothing here ever touches the "public" schema,
 * so the portfolio can safely share a Neon database with another application.
 *
 * @typedef {(strings: TemplateStringsArray | string, ...values: any[]) => Promise<any[]>} Sql
 */

export const SCHEMA = 'portfolio';

/** The content sections stored in `site_content` (one JSONB row each). */
export const SECTIONS = ['profile', 'experiences', 'products', 'services', 'skills', 'projects', 'awards', 'certifications'];

/** Idempotent DDL. Safe to run any number of times. */
export const DDL = [
  `CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`,

  // One row per content section. `version` increments on every save and powers conflict detection.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.site_content (
     section    text        PRIMARY KEY,
     data       jsonb       NOT NULL,
     version    integer     NOT NULL DEFAULT 1,
     updated_at timestamptz NOT NULL DEFAULT now(),
     updated_by text
   )`,

  // Every saved version of every section, so any edit can be undone.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.content_revisions (
     id         bigserial   PRIMARY KEY,
     section    text        NOT NULL,
     version    integer     NOT NULL,
     data       jsonb       NOT NULL,
     actor      text,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS content_revisions_section_idx ON ${SCHEMA}.content_revisions (section, id DESC)`,

  // Contact-form inbox.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.messages (
     id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
     name       text        NOT NULL,
     email      text        NOT NULL,
     subject    text        NOT NULL,
     message    text        NOT NULL,
     ip_hash    text,
     read       boolean     NOT NULL DEFAULT false,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS messages_created_idx ON ${SCHEMA}.messages (created_at DESC)`,

  // Server-side admin sessions, so a session can be listed and revoked.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.admin_sessions (
     id           uuid        PRIMARY KEY,
     created_at   timestamptz NOT NULL DEFAULT now(),
     expires_at   timestamptz NOT NULL,
     last_seen_at timestamptz NOT NULL DEFAULT now(),
     ip           text,
     user_agent   text,
     revoked_at   timestamptz
   )`,

  // Fixed-window counters shared by every serverless instance.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.rate_limits (
     key      text        PRIMARY KEY,
     count    integer     NOT NULL,
     reset_at timestamptz NOT NULL
   )`,

  // Security-relevant events (sign-ins, saves, revokes).
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.audit_log (
     id     bigserial   PRIMARY KEY,
     at     timestamptz NOT NULL DEFAULT now(),
     action text        NOT NULL,
     detail text,
     ip     text
   )`,
  `CREATE INDEX IF NOT EXISTS audit_log_at_idx ON ${SCHEMA}.audit_log (at DESC)`,

  // First-party, cookie-free analytics. No IP address is stored: visitor_id is a daily keyed hash.
  // One row per visit (page load); duration = last_seen_at - started_at, kept fresh by a lightweight heartbeat.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.analytics_sessions (
     id           text        PRIMARY KEY,
     visitor_id   text        NOT NULL,
     started_at   timestamptz NOT NULL DEFAULT now(),
     last_seen_at timestamptz NOT NULL DEFAULT now(),
     pageviews    integer     NOT NULL DEFAULT 0,
     events       integer     NOT NULL DEFAULT 0,
     country      text,
     device       text,
     browser      text,
     os           text,
     referrer     text,
     utm_source   text,
     landing_path text
   )`,
  `CREATE INDEX IF NOT EXISTS analytics_sessions_started_idx ON ${SCHEMA}.analytics_sessions (started_at DESC)`,
  `CREATE INDEX IF NOT EXISTS analytics_sessions_seen_idx ON ${SCHEMA}.analytics_sessions (last_seen_at DESC)`,

  // Discrete actions: clicks (hire me, CV download, ...), section views, form start, message sent.
  `CREATE TABLE IF NOT EXISTS ${SCHEMA}.analytics_events (
     id         bigserial   PRIMARY KEY,
     at         timestamptz NOT NULL DEFAULT now(),
     session_id text        NOT NULL,
     type       text        NOT NULL,
     name       text,
     label      text,
     path       text
   )`,
  `CREATE INDEX IF NOT EXISTS analytics_events_at_idx ON ${SCHEMA}.analytics_events (at DESC)`,
  `CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON ${SCHEMA}.analytics_events (type, name, at DESC)`,
];

/** @param {Sql} sql */
export async function migrate(sql) {
  const run = /** @type {any} */ (sql).query.bind(sql);
  for (const statement of DDL) await run(statement);
}

/**
 * Create (or re-grant) a least-privilege login role that can only use the portfolio schema.
 * @param {Sql} sql  connected as the database owner
 * @param {string} role
 * @param {string} password  only used when the role does not exist yet
 * @returns {Promise<boolean>} true if the role was newly created
 */
export async function provisionRole(sql, role, password) {
  if (!/^[a-z_][a-z0-9_]*$/.test(role)) throw new Error('Invalid role name');
  const run = /** @type {any} */ (sql).query.bind(sql);
  const exists = (await run('SELECT 1 FROM pg_roles WHERE rolname = $1', [role])).length > 0;
  if (!exists) {
    // Passwords cannot be bound as parameters in CREATE ROLE, so it is escaped as a literal.
    await run(`CREATE ROLE ${role} LOGIN PASSWORD '${password.replace(/'/g, "''")}'`);
  }
  await run(`GRANT USAGE ON SCHEMA ${SCHEMA} TO ${role}`);
  await run(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ${SCHEMA} TO ${role}`);
  await run(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ${SCHEMA} TO ${role}`);
  await run(`ALTER DEFAULT PRIVILEGES IN SCHEMA ${SCHEMA} GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${role}`);
  await run(`ALTER DEFAULT PRIVILEGES IN SCHEMA ${SCHEMA} GRANT USAGE, SELECT ON SEQUENCES TO ${role}`);
  await run(`ALTER ROLE ${role} SET search_path = ${SCHEMA}`);
  return !exists;
}

/**
 * Fill empty content sections from a seed object (the repo's data/portfolio.json). Never overwrites.
 * @param {Sql} sql
 * @param {Record<string, any>} seed
 * @param {string} actor
 * @returns {Promise<string[]>} the sections that were seeded
 */
export async function seedIfEmpty(sql, seed, actor = 'seed') {
  const run = /** @type {any} */ (sql).query.bind(sql);
  const seeded = [];
  for (const section of SECTIONS) {
    if (seed[section] === undefined) continue;
    const json = JSON.stringify(seed[section]);
    const inserted = await run(
      `INSERT INTO ${SCHEMA}.site_content (section, data, version, updated_by) VALUES ($1, $2::jsonb, 1, $3)
       ON CONFLICT (section) DO NOTHING RETURNING section`,
      [section, json, actor]
    );
    if (inserted.length) {
      await run(`INSERT INTO ${SCHEMA}.content_revisions (section, version, data, actor) VALUES ($1, 1, $2::jsonb, $3)`, [section, json, actor]);
      seeded.push(section);
    }
  }
  return seeded;
}
