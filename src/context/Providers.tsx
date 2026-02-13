'use client';

import { PlayerProvider } from './PlayerContext';
import { LibraryProvider } from './LibraryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LibraryProvider>
      <PlayerProvider>
        {children}
      </PlayerProvider>
    </LibraryProvider>
  );
}
