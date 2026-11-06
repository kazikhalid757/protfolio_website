/** Public resume download: GET /resume.pdf. Built from the saved resume section, so it is always up to date. */
import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/data';
import { hasResume, resumeFileName } from '@/lib/resume/document';
import { renderResumePdf } from '@/lib/resume/pdf';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { resume } = await getPortfolioData();
  if (!hasResume(resume)) return new NextResponse('Not found', { status: 404 });

  try {
    const { buffer } = await renderResumePdf(resume);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resumeFileName(resume)}"`,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=0, must-revalidate',
        // The file holds a phone number; recruiters get it from the site, search engines do not need to list it.
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('resume: could not build the PDF:', (error as Error).message);
    return new NextResponse('The resume could not be generated right now.', { status: 500 });
  }
}
