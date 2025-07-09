'use client';

import React, { Suspense } from 'react';
import PageContent from '@/components/features/PageContent';

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
