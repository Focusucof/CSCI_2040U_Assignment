'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SearchContent from '@/components/SearchContent';

function SearchInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <SearchContent key={query} />;
}

export default function SearchPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <Suspense>
        <SearchInner />
      </Suspense>
    </div>
  );
}
