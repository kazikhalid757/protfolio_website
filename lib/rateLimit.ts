/**
 * Rate limiting shared by every serverless instance (counters live in Postgres).
 * One atomic upsert per check, so concurrent requests cannot slip past the limit.
 */
import { sql } from './db';

export interface RateResult {
  ok: boolean;
  /** Seconds until the window resets (only meaningful when !ok). */
  retryAfter: number;
}

/** Allow `max` hits per `windowSeconds` for `key`. Throws if the database is unreachable (callers fail closed). */
export async function rateLimit(key: string, max: number, windowSeconds: number): Promise<RateResult> {
  const rows = await sql()`
    INSERT INTO portfolio.rate_limits AS r (key, count, reset_at)
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT (key) DO UPDATE SET
      count    = CASE WHEN r.reset_at <= now() THEN 1 ELSE r.count + 1 END,
      reset_at = CASE WHEN r.reset_at <= now() THEN now() + make_interval(secs => ${windowSeconds}) ELSE r.reset_at END
    RETURNING count, GREATEST(0, CEIL(EXTRACT(EPOCH FROM (reset_at - now()))))::int AS retry`;
  const { count, retry } = rows[0] as { count: number; retry: number };

  if (Math.random() < 0.02) {
    sql()`DELETE FROM portfolio.rate_limits WHERE reset_at < now() - interval '1 day'`.catch(() => {});
  }
  return { ok: count <= max, retryAfter: retry };
}
