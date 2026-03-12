'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NowPlaying from '@/components/NowPlaying';
import FeaturedContent from '@/components/FeaturedContent';
import { Track } from '@/lib/types';

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>({
    id: '000',
    title: 'Placeholder',
    artist: 'Placeholder',
    album: 'Placeholder',
    duration: '0:00',
    genre: 'Placeholder',
    coverUrl: 'https://picsum.photos/seed/default/300/300',
  });

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <FeaturedContent onPlayTrack={handlePlay} />
      <NowPlaying currentTrack={currentTrack} />
    </div>
  );
}
