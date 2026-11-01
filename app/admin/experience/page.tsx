'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { experienceFields, experienceItem } from '@/components/admin/schemas';

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        title="Experience"
        description="Your jobs, newest first. Use the arrows to reorder. A period containing “Present” gets the Now tag and powers the hero line."
      />
      <SectionEditor
        section="experiences"
        kind="list"
        fields={experienceFields}
        addLabel="Add a job"
        emptyHint="No jobs yet. Add your first one."
        {...experienceItem}
      />
    </>
  );
}
