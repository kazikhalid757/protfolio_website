/** Contact-form inbox, stored in portfolio.messages. */
import { sql } from './db';

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const toMessage = (r: Record<string, any>): InboxMessage => ({
  id: r.id,
  name: r.name,
  email: r.email,
  subject: r.subject,
  message: r.message,
  date: new Date(r.created_at).toISOString(),
  read: r.read,
});

export async function listMessages(limit = 200): Promise<InboxMessage[]> {
  const rows = await sql()`SELECT id, name, email, subject, message, read, created_at FROM portfolio.messages ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map(toMessage);
}

export async function countUnread(): Promise<number> {
  const rows = await sql()`SELECT count(*)::int AS n FROM portfolio.messages WHERE read = false`;
  return rows[0].n;
}

export async function addMessage(input: { name: string; email: string; subject: string; message: string; ipHash?: string }): Promise<string> {
  const rows = await sql()`
    INSERT INTO portfolio.messages (name, email, subject, message, ip_hash)
    VALUES (${input.name}, ${input.email}, ${input.subject}, ${input.message}, ${input.ipHash ?? null})
    RETURNING id`;
  // Keep the inbox bounded.
  if (Math.random() < 0.05) {
    sql()`DELETE FROM portfolio.messages WHERE id IN (SELECT id FROM portfolio.messages ORDER BY created_at DESC OFFSET 1000)`.catch(() => {});
  }
  return rows[0].id;
}

const UUID = /^[0-9a-f-]{36}$/i;

export async function setRead(id: string, read: boolean): Promise<boolean> {
  if (!UUID.test(id)) return false;
  const rows = await sql()`UPDATE portfolio.messages SET read = ${read} WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function removeMessage(id: string): Promise<boolean> {
  if (!UUID.test(id)) return false;
  const rows = await sql()`DELETE FROM portfolio.messages WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
