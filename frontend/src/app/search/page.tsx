'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import SearchContent from '@/components/SearchContent';
import { useAudio } from '@/context/AudioContext';

export default function SearchPage() {
  const { onTrackSelect } = useAudio();

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <SearchContent onPlayTrack={onTrackSelect} />
    </div>
  );
}
