'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NowPlaying from '@/components/NowPlaying';
import SearchContent from '@/components/SearchContent';
import { Track } from '@/lib/types';

export default function SearchPage() {
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
      <SearchContent onPlayTrack={handlePlay} />
      <NowPlaying currentTrack={currentTrack} />
    </div>
  );
}
