'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Song } from '@/services/types';
import { usePlayer } from '@/context/PlayerContext';
import { useLibrary } from '@/context/LibraryContext';
import { formatDuration, cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import AddToPlaylistMenu from '@/components/playlist/AddToPlaylistMenu';

interface TrackRowProps {
  song: Song;
  index: number;
  queue?: Song[];
  showAlbum?: boolean;
  showCover?: boolean;
  onRemove?: () => void;
}

export default function TrackRow({ song, index, queue, showAlbum = false, showCover = false, onRemove }: TrackRowProps) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { isFavorite, toggleFavorite } = useLibrary();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = currentSong?.id === song.id;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-2 rounded-md hover:bg-surface-light cursor-pointer',
        isActive && 'bg-surface-light'
      )}
      onDoubleClick={() => playSong(song, queue)}
    >
      {/* Track number / Play icon */}
      <div className="w-6 text-center shrink-0">
        <span className={cn('text-sm group-hover:hidden', isActive ? 'text-accent' : 'text-muted')}>
          {index + 1}
        </span>
        <button
          className="hidden group-hover:block"
          onClick={(e) => { e.stopPropagation(); playSong(song, queue); }}
          aria-label="Play"
        >
          {isActive && isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Cover image */}
      {showCover && (
        <div className="w-10 h-10 shrink-0 relative rounded overflow-hidden">
          <Image src={song.coverUrl} alt={song.albumName} fill className="object-cover" sizes="40px" />
        </div>
      )}

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isActive && 'text-accent')}>{song.title}</p>
        <Link
          href={`/artist/${song.artistId}`}
          className="text-xs text-muted hover:underline truncate block"
          onClick={e => e.stopPropagation()}
        >
          {song.artistName}
        </Link>
      </div>

      {/* Album */}
      {showAlbum && (
        <Link
          href={`/album/${song.albumId}`}
          className="hidden md:block text-sm text-muted hover:underline truncate w-[25%]"
          onClick={e => e.stopPropagation()}
        >
          {song.albumName}
        </Link>
      )}

      {/* Favorite */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
        className={cn(
          'shrink-0 opacity-0 group-hover:opacity-100 transition-opacity',
          isFavorite(song.id) && 'opacity-100'
        )}
        aria-label={isFavorite(song.id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={isFavorite(song.id) ? '#1DB954' : 'none'}
          stroke={isFavorite(song.id) ? '#1DB954' : 'currentColor'}
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>

      {/* Add to playlist menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-white"
          aria-label="More options"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
        {showMenu && (
          <AddToPlaylistMenu songId={song.id} onClose={() => setShowMenu(false)} onRemove={onRemove} />
        )}
      </div>

      {/* Duration */}
      <span className="text-sm text-muted w-12 text-right shrink-0">{formatDuration(song.duration)}</span>
    </div>
  );
}
