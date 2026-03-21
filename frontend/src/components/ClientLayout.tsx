'use client';

import { usePathname } from 'next/navigation';
import NowPlaying from '@/components/NowPlaying';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {children}
      {!isAdmin && <NowPlaying />}
    </>
  );
}
