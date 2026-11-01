/** Security-relevant events (sign-ins, saves, revokes). Logging never breaks the request it describes. */
import { SCHEMA, sql } from './db';

export type AuditAction =
  | 'login_success'
  | 'login_failed'
  | 'login_blocked'
  | 'logout'
  | 'content_saved'
  | 'content_imported'
  | 'content_reset'
  | 'session_revoked'
  | 'sessions_revoked_all'
  | 'message_deleted';

export interface AuditEntry {
  id: number;
  at: string;
  action: AuditAction;
  detail: string | null;
  ip: string | null;
}

export async function audit(action: AuditAction, detail?: string, ip?: string): Promise<void> {
  try {
    const q = sql();
    await q`INSERT INTO portfolio.audit_log (action, detail, ip) VALUES (${action}, ${detail?.slice(0, 300) ?? null}, ${ip ?? null})`;
    // Keep the table small: trim now and then.
    if (Math.random() < 0.02) await q`DELETE FROM portfolio.audit_log WHERE at < now() - interval '90 days'`;
  } catch (error) {
    console.error('audit failed:', (error as Error).message);
  }
}

export async function listAudit(limit = 40): Promise<AuditEntry[]> {
  const rows = await sql()`SELECT id, at, action, detail, ip FROM portfolio.audit_log ORDER BY id DESC LIMIT ${limit}`;
  return rows.map((r: any) => ({ ...r, at: new Date(r.at).toISOString() }));
}

void SCHEMA;
