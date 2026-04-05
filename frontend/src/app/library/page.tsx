'use client';

import Sidebar from '@/components/Sidebar';
import LibraryContent from '@/components/LibraryContent';

export default function LibraryPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <LibraryContent />
    </div>
  );
}
