'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { profileFields } from '@/components/admin/schemas';

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile & hero"
        description="Your name, headline, bio, contact details, the four hero numbers and social links. This is the top of the site, the footer and the search-result snippet."
      />
      <SectionEditor section="profile" kind="object" fields={profileFields} />
    </>
  );
}
