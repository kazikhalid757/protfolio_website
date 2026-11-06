'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import ResumeEditor from '@/components/admin/ResumeEditor';

export default function ResumePage() {
  return (
    <>
      <PageHeader
        title="Resume"
        description="Everything in the downloadable PDF. It is separate from your website content, so you can tailor it freely. Saving updates the Download CV button straight away."
      />
      <ResumeEditor />
    </>
  );
}
