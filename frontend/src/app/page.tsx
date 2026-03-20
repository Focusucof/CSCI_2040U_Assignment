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
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <FeaturedContent onPlayTrack={handlePlay} />
      <NowPlaying currentTrack={currentTrack} isPlaying={isPlaying} onPlayPause={setIsPlaying} />
    </div>
  );
}
