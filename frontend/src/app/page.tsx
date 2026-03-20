'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import FeaturedContent from '@/components/FeaturedContent';
import { useAudio } from '@/context/AudioContext';

export default function Home() {
  const { onTrackSelect } = useAudio();

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <FeaturedContent onPlayTrack={onTrackSelect} />
    </div>
  );
}
