'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { projectFields, projectItem } from '@/components/admin/schemas';

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="The open-source automation frameworks list. Each row links to its GitHub repo."
      />
      <SectionEditor
        section="projects"
        kind="list"
        fields={projectFields}
        addLabel="Add a project"
        emptyHint="No projects yet."
        {...projectItem}
      />
    </>
  );
}
