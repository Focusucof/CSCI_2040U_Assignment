'use client';

import { Song } from '@/services/types';
import TrackRow from './TrackRow';

interface TrackListProps {
  songs: Song[];
  showAlbum?: boolean;
  showCover?: boolean;
  onRemove?: (songId: string) => void;
}

export default function TrackList({ songs, showAlbum = false, showCover = false, onRemove }: TrackListProps) {
  if (songs.length === 0) {
    return <p className="text-muted text-sm px-4 py-8 text-center">No tracks found.</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-surface-light text-xs text-muted uppercase tracking-wider">
        <span className="w-6 text-center">#</span>
        {showCover && <span className="w-10" />}
        <span className="flex-1">Title</span>
        {showAlbum && <span className="hidden md:block w-[25%]">Album</span>}
        <span className="w-14" />
        <span className="w-16" />
        <span className="w-12 text-right">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>
      {songs.map((song, i) => (
        <TrackRow
          key={song.id}
          song={song}
          index={i}
          queue={songs}
          showAlbum={showAlbum}
          showCover={showCover}
          onRemove={onRemove ? () => onRemove(song.id) : undefined}
        />
      ))}
    </div>
  );
}
