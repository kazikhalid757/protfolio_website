import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-char grid place-items-center px-6">
      <div className="max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">Error 404</p>
        <h1 className="mt-4 font-serif font-normal text-6xl leading-none">Page not found</h1>
        <p className="mt-5 text-mute leading-relaxed">That page does not exist. If you were looking for my work, the home page has everything.</p>
        <Link href="/" className="mt-8 inline-flex items-center h-12 px-6 bg-char text-paper font-medium hover:bg-signal transition-colors">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
