/**
 * Builds a PDF from the editor's unsaved draft, so it can be checked before going live.
 *   POST { value }  ->  the PDF, with the page count in X-Resume-Pages. Nothing is stored.
 */
import { NextResponse } from 'next/server';
import { routeError } from '@/lib/errors';
import { jsonError, readJson } from '@/lib/http';
import { resumeFileName } from '@/lib/resume/document';
import { renderResumePdf } from '@/lib/resume/pdf';
import { validateSection, type Resume } from '@/lib/schemas';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const body = (await readJson(request)) as { value?: unknown } | undefined;
  if (!body) return jsonError('Body must be valid JSON (and not too large).', 400);

  const checked = validateSection('resume', body.value);
  if (!checked.ok) return jsonError('Some fields need attention.', 400, checked.errors);

  try {
    const resume = checked.data as Resume;
    const { buffer, pages } = await renderResumePdf(resume);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resumeFileName(resume)}"`,
        'X-Resume-Pages': String(pages),
      },
    });
  } catch (error) {
    return routeError(error);
  }
}
