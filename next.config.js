/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lets a second build run in its own folder (NEXT_DIST_DIR=.next-check next build)
  // without disturbing a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // pdfkit reads its font metrics from its own folder at run time, so it must not be bundled.
    serverComponentsExternalPackages: ['pdfkit'],
    // The public pages read data/*.json with fs at request time; make sure it ships with the deployment.
    outputFileTracingIncludes: {
      '/**': ['./data/**/*'],
      '/resume.pdf': ['./node_modules/pdfkit/js/data/**/*'],
      '/api/admin/resume/pdf': ['./node_modules/pdfkit/js/data/**/*'],
    },
  },
};

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

nextConfig.headers = async () => [{ source: '/:path*', headers: securityHeaders }];

module.exports = nextConfig;
