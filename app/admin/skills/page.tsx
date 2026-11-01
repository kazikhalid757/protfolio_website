'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { skillCategoryFields, skillItem } from '@/components/admin/schemas';

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Skills"
        description="The Toolbox section. Skills are grouped; put the group you want recruiters to see first at the top (Manual Testing leads now)."
      />
      <SectionEditor
        section="skills"
        kind="list"
        fields={skillCategoryFields}
        addLabel="Add a skill group"
        emptyHint="No skills yet."
        {...skillItem}
      />
    </>
  );
}
