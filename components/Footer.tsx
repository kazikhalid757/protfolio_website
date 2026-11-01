import React from 'react';
import type { Profile } from '@/lib/schemas';

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const name = profile?.name || 'Kazi Khalid Hasan Tamim';
  return (
    <footer className="bg-char text-paper">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <p className="text-paper">
          © {new Date().getFullYear()} {name}
        </p>
        <p className="font-mono text-xs text-paper/60">
          Tested, then built in Dhaka, Bangladesh. Anonymous, cookie-free analytics.
        </p>
      </div>
    </footer>
  );
}
