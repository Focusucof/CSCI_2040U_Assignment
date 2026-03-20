'use client';

import Sidebar from '@/components/Sidebar';
import FeaturedContent from '@/components/FeaturedContent';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <FeaturedContent />
    </div>
  );
}
