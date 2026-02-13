'use client';

import Link from 'next/link';
import { Playlist } from '@/services/types';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className="bg-surface hover:bg-surface-hover p-4 rounded-lg transition-all duration-200 group block"
    >
      <div className="relative aspect-square mb-4 rounded-md overflow-hidden shadow-lg bg-surface-light flex items-center justify-center">
        {playlist.songIds.length > 0 ? (
          <div className="w-full h-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity={0.5}>
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity={0.3}>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
        <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-sm font-semibold truncate">{playlist.name}</h3>
      <p className="text-xs text-muted mt-1">{playlist.songIds.length} songs</p>
    </Link>
  );
}
