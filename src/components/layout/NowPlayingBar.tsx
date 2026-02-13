'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '@/context/PlayerContext';
import { useLibrary } from '@/context/LibraryContext';
import { formatDuration, cn } from '@/lib/utils';

export default function NowPlayingBar() {
  const {
    currentSong, isPlaying, progress, duration, volume,
    shuffle, repeat,
    togglePlay, nextTrack, prevTrack, seek, setVolume,
    toggleShuffle, toggleRepeat,
  } = usePlayer();
  const { isFavorite, toggleFavorite } = useLibrary();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-20 bg-surface border-t border-surface-light flex items-center px-4 gap-4">
      {/* Song Info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        <div className="w-14 h-14 shrink-0 relative rounded overflow-hidden">
          <Image src={currentSong.coverUrl} alt={currentSong.albumName} fill className="object-cover" sizes="56px" />
        </div>
        <div className="min-w-0">
          <Link href={`/album/${currentSong.albumId}`} className="text-sm font-medium truncate block hover:underline">
            {currentSong.title}
          </Link>
          <Link href={`/artist/${currentSong.artistId}`} className="text-xs text-muted truncate block hover:underline">
            {currentSong.artistName}
          </Link>
        </div>
        <button
          onClick={() => toggleFavorite(currentSong.id)}
          className="shrink-0 ml-2"
          aria-label={isFavorite(currentSong.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={isFavorite(currentSong.id) ? '#1DB954' : 'none'}
            stroke={isFavorite(currentSong.id) ? '#1DB954' : 'currentColor'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-[45%]">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={cn('text-muted hover:text-white transition-colors', shuffle && 'text-accent')}
            aria-label="Toggle shuffle"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 3h5v5m-1.5-3.5L14 10m7 4v5h-5m1.5-1.5L12 12M3 3l18 18M3 21L21 3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>

          <button onClick={prevTrack} className="text-muted hover:text-white transition-colors" aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button onClick={nextTrack} className="text-muted hover:text-white transition-colors" aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2V6zM4 18l8.5-6L4 6v12z" />
            </svg>
          </button>

          <button
            onClick={toggleRepeat}
            className={cn('text-muted hover:text-white transition-colors', repeat !== 'off' && 'text-accent')}
            aria-label="Toggle repeat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
            {repeat === 'one' && <span className="absolute text-[8px] font-bold">1</span>}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted w-10 text-right">{formatDuration(progress)}</span>
          <div
            className="flex-1 h-1 bg-surface-light rounded-full cursor-pointer group relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seek(pct * duration);
            }}
          >
            <div
              className="h-full bg-white group-hover:bg-accent rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <span className="text-xs text-muted w-10">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-[20%] justify-end">
        <button className="text-muted hover:text-white" aria-label="Volume" onClick={() => setVolume(volume > 0 ? 0 : 0.7)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {volume === 0 ? (
              <><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
            ) : (
              <><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></>
            )}
          </svg>
        </button>
        <div
          className="w-24 h-1 bg-surface-light rounded-full cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setVolume(pct);
          }}
        >
          <div
            className="h-full bg-white group-hover:bg-accent rounded-full"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
