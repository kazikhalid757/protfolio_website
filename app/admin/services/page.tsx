'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { serviceFields, serviceItem } from '@/components/admin/schemas';

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Services"
        description="What you offer clients. Each one appears as a card in the Services section with a “Hire me” link."
      />
      <SectionEditor
        section="services"
        kind="list"
        fields={serviceFields}
        addLabel="Add a service"
        emptyHint="No services yet. The Services section hides itself when this is empty."
        {...serviceItem}
      />
    </>
  );
}
