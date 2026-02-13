'use client';

import { Song } from '@/services/types';
import { usePlayer } from '@/context/PlayerContext';

interface PlayButtonProps {
  songs: Song[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PlayButton({ songs, size = 'md', className = '' }: PlayButtonProps) {
  const { playSong } = usePlayer();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const iconSize = {
    sm: 14,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={() => songs.length > 0 && playSong(songs[0], songs)}
      className={`${sizeClasses[size]} bg-accent rounded-full flex items-center justify-center hover:scale-105 hover:bg-accent-hover transition-all shadow-xl ${className}`}
      aria-label="Play"
    >
      <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 24 24" fill="black">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
