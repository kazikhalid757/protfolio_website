'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { awardFields, awardItem, certificationFields, certificationItem } from '@/components/admin/schemas';

const tabs = [
  { id: 'awards', label: 'Awards' },
  { id: 'certifications', label: 'Certifications' },
] as const;

export default function AwardsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('awards');

  return (
    <>
      <PageHeader
        title="Awards & certifications"
        description="The Recognition section. Each tab saves on its own, and unsaved edits in one stay put while you look at the other."
      />

      <div role="tablist" aria-label="Recognition" className="mb-6 flex border-b border-char">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`h-11 px-5 text-sm font-semibold border-x border-t -mb-px transition-colors ${
              tab === t.id ? 'bg-char text-paper border-char' : 'bg-transparent text-charSoft border-transparent hover:bg-paperDeep'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Both stay mounted so a draft in one tab is not lost when switching */}
      <div id="panel-awards" role="tabpanel" aria-labelledby="tab-awards" hidden={tab !== 'awards'}>
        <SectionEditor section="awards" kind="list" fields={awardFields} addLabel="Add an award" emptyHint="No awards yet." {...awardItem} />
      </div>
      <div id="panel-certifications" role="tabpanel" aria-labelledby="tab-certifications" hidden={tab !== 'certifications'}>
        <SectionEditor
          section="certifications"
          kind="list"
          fields={certificationFields}
          addLabel="Add a certificate"
          emptyHint="No certificates yet."
          {...certificationItem}
        />
      </div>
    </>
  );
}
