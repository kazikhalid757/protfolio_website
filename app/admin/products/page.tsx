'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import SectionEditor from '@/components/admin/SectionEditor';
import { productFields, productItem } from '@/components/admin/schemas';

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="The case studies in the Products section: things you built, and SaaS products you tested. “Built by me” cards are dark."
      />
      <SectionEditor
        section="products"
        kind="list"
        fields={productFields}
        addLabel="Add a product"
        emptyHint="No products yet."
        {...productItem}
      />
    </>
  );
}
