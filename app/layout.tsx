import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kazitamim.dev'),
  title: 'Kazi Khalid Hasan Tamim | QA & Test Automation Engineer | SDET',
  description: 'Production-grade portfolio of Kazi Khalid Hasan Tamim, Senior QA & Test Automation Engineer. Specializing in Playwright, Cypress, Selenium Grid, REST Assured, and CI/CD Quality Engineering.',
  keywords: [
    'Kazi Khalid Hasan Tamim',
    'Kazi Tamim',
    'QA Automation Engineer',
    'SDET',
    'Playwright',
    'Cypress',
    'Selenium Grid',
    'REST Assured',
    'CI/CD Quality Gates',
    'Google Bug Hunters VRP',
    'JMeter Performance Testing',
    'Test Automation Architect'
  ],
  authors: [{ name: 'Kazi Khalid Hasan Tamim', url: 'https://github.com/kazikhalid757' }],
  creator: 'Kazi Khalid Hasan Tamim',
  publisher: 'Kazi Khalid Hasan Tamim',
  formatDetection: {
    email: true,
    telephone: true,
  },
  openGraph: {
    title: 'Kazi Khalid Hasan Tamim | QA & Test Automation Engineer | SDET',
    description: 'Specializing in Playwright, Cypress, Selenium Grid, REST Assured, and CI/CD Quality Engineering.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Kazi Tamim — QA & SDET Engineering Dossier',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kazi Khalid Hasan Tamim | QA & Test Automation Engineer',
    description: 'Building resilient test automation frameworks & CI/CD quality pipelines.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kazi Khalid Hasan Tamim',
    alternateName: 'Kazi Tamim',
    jobTitle: 'QA & Test Automation Engineer | SDET',
    description: 'Senior QA & Test Automation Engineer specialized in Playwright, Cypress, Selenium, REST Assured, and CI/CD Quality Gates.',
    url: 'https://kazitamim.dev',
    image: 'https://kazitamim.dev/images/me.jpg',
    sameAs: [
      'https://github.com/kazikhalid757',
      'https://www.linkedin.com/in/kazi-khalid-hasan-tamim-bba115220/',
      'https://www.upwork.com/freelancers/~01ece4f0a9bea27e31?mp_source=share',
      'https://bughunters.google.com/profile/19cb3404-d271-4c52-803b-cefd2acd8759',
      'https://www.kaggle.com/kazikhalid757'
    ],
    knowsAbout: [
      'Software Testing',
      'Test Automation',
      'SDET',
      'Playwright',
      'Cypress',
      'Selenium Grid',
      'REST Assured',
      'Continuous Integration / Continuous Delivery (CI/CD)',
      'Docker',
      'Apache JMeter',
      'OWASP ZAP',
      'Google Bug Hunters VRP'
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/6.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        {children}
      </body>
    </html>
  );
}

