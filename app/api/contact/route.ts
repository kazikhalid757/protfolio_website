/**
 * Contact form.   POST { name, email, subject?, message, website?, elapsed? }
 *
 * Defences: schema validation + length limits, a hidden honeypot field, a "too fast to be human" check,
 * and database-backed rate limits (per visitor and overall). The message is stored in portfolio.messages and,
 * if RESEND_API_KEY is set, also emailed to you.
 */
import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/data';
import { dbConfigured } from '@/lib/db';
import { clientIp, hashIp, isSameOrigin, jsonError, readJson } from '@/lib/http';
import { addMessage } from '@/lib/messages';
import { rateLimit } from '@/lib/rateLimit';
import { contactSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

/** Remove control characters (keeps newlines and tabs). */
const clean = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

async function sendEmail(m: { name: string; email: string; subject: string; message: string }, to: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: m.email,
      subject: `[Portfolio] ${m.subject.replace(/[\r\n]+/g, ' ')}`,
      text: `From: ${m.name} <${m.email}>\nSubject: ${m.subject}\n\n${m.message}\n`,
    }),
  });
  if (!res.ok) throw new Error(`Email provider returned ${res.status}`);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError('Cross-site request blocked.', 403);

  const body = await readJson(request, 20_000);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Please check the form.', 400, parsed.error.issues.slice(0, 4).map((i) => i.message));
  }
  const input = parsed.data;

  // Bots: a filled honeypot, or a form submitted in under 2.5 seconds. Pretend it worked so they learn nothing.
  if (input.website || (typeof input.elapsed === 'number' && input.elapsed < 2500)) return NextResponse.json({ success: true });

  const ip = clientIp(request);
  const entry = {
    name: clean(input.name),
    email: input.email.trim(),
    subject: clean(input.subject?.trim() || 'New portfolio inquiry'),
    message: clean(input.message),
  };

  let stored = false;
  if (dbConfigured()) {
    try {
      const [perVisitor, overall] = await Promise.all([rateLimit(`contact:${ip}`, 5, 10 * 60), rateLimit('contact:all', 200, 24 * 3600)]);
      if (!perVisitor.ok || !overall.ok) {
        return jsonError('Too many messages in a short time. Please try again in a few minutes.', 429, undefined, {
          'Retry-After': String(Math.max(perVisitor.retryAfter, overall.retryAfter)),
        });
      }
      await addMessage({ ...entry, ipHash: hashIp(ip) });
      stored = true;
    } catch (error) {
      console.error('contact: could not store message:', (error as Error).message);
    }
  }

  // Optional email copy. If the database is down this still lets the message through.
  let emailed = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const to = process.env.CONTACT_TO_EMAIL || (await getPortfolioData()).profile.email;
      if (to) {
        await sendEmail(entry, to);
        emailed = true;
      }
    } catch (error) {
      console.error('contact: email failed:', (error as Error).message);
    }
  }

  if (!stored && !emailed) {
    const email = (await getPortfolioData()).profile.email;
    return jsonError(`Sorry, your message could not be sent right now. Please email ${email || 'me'} directly.`, 503);
  }
  return NextResponse.json({ success: true });
}
