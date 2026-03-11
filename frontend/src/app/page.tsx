'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NowPlaying from '@/components/NowPlaying';
import { Track } from '@/lib/types';

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>({
    id: '000',
    title: 'Placeholder',
    artist: 'Placeholder',
    album: 'Placeholder',
    duration: '0:00',
    genre: 'Placeholder',
    coverUrl: 'http://0.0.0.0',
  });

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <NowPlaying currentTrack={currentTrack} />
    </div>
  );
}
