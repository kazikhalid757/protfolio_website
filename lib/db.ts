/**
 * Neon Postgres client (HTTP driver, so it works on Vercel serverless and edge with no connection pool to manage).
 *
 * The app connects as the restricted `portfolio_app` role and only ever touches the `portfolio` schema.
 * All values are passed as bound parameters; SQL is never built by string concatenation with user input.
 */
import { neon, neonConfig, type NeonQueryFunction } from '@neondatabase/serverless';
import { SCHEMA } from './migrations.mjs';

export { SCHEMA };

/** Raised when the database cannot be used. `status` is the HTTP status to answer with. */
export class DatabaseError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 503, code = 'database_error') {
    super(message);
    this.name = 'DatabaseError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Resilient transport for the Neon HTTP driver.
 *
 * Node reuses keep-alive connections and Neon closes idle ones, and on slow or lossy links a connect can hang. So each
 * attempt gets a short timeout (a dead connection fails fast instead of stalling for 10 s) and network-level failures
 * are retried on a fresh connection, up to 3 attempts with a small back-off.
 * SQL errors (bad query, permission denied, ...) come back as normal HTTP responses and are never retried.
 */
const ATTEMPT_TIMEOUT_MS = 5000;
const MAX_ATTEMPTS = 3;

neonConfig.fetchFunction = async (url: string, init?: RequestInit) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(url, { ...init, signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) });
    } catch (error) {
      // Next.js signals "this route is dynamic" by throwing from fetch(); that is not a network failure. Let it through.
      if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE' || /Dynamic server usage/.test((error as Error)?.message || '')) throw error;
      lastError = error;
      const cause = (error as { cause?: { code?: string } })?.cause?.code ?? (error as Error).name;
      console.warn(`db: network error on attempt ${attempt}/${MAX_ATTEMPTS}:`, cause);
      if (attempt < MAX_ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
    }
  }
  throw lastError;
};

export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function dbConfigured(): boolean {
  return !!databaseUrl();
}

/** Template-tag query function returning plain row objects. */
export type Sql = NeonQueryFunction<false, false>;
export type Row = Record<string, any>;
let client: Sql | undefined;

/** The shared query function: await sql()`SELECT ... ${value}` */
export function sql(): Sql {
  const url = databaseUrl();
  if (!url) throw new DatabaseError('The database is not configured. Set DATABASE_URL.', 503, 'not_configured');
  // `cache: 'no-store'` is essential. Next.js 14 otherwise caches the driver's fetch() calls inside GET handlers, so an
  // identical query (same SQL, same session id) could be answered from the cache instead of the database. That would
  // let a revoked session keep working and make health checks lie. Every query must reach Postgres.
  return (client ??= neon<false, false>(url, { fetchOptions: { cache: 'no-store' } }));
}

/** Turn a driver error into a clear, safe message (never leaks connection details). */
export function toDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseError) return error;
  const code = (error as { code?: string })?.code;
  if (code === '42P01') return new DatabaseError('Database tables are missing. Run "npm run db:setup" once.', 503, 'not_migrated');
  if (code === '28P01' || code === '28000') return new DatabaseError('The database rejected the credentials. Check DATABASE_URL.', 503, 'auth_failed');
  if (code === '42501') return new DatabaseError('The database user is missing a permission. Run "npm run db:setup".', 503, 'permission_denied');
  console.error('Database error:', (error as Error)?.message);
  return new DatabaseError('The database is unavailable right now.', 503, 'unavailable');
}
