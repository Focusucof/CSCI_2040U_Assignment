'use client';

import { useEffect, useState } from 'react';
import { Song } from '@/services/types';
import { useLibrary } from '@/context/LibraryContext';
import musicService from '@/services';
import TrackList from '@/components/ui/TrackList';
import PlayButton from '@/components/ui/PlayButton';

export default function FavoritesPage() {
  const { favoriteIds } = useLibrary();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const ids = [...favoriteIds];
    if (ids.length > 0) {
      musicService.getSongsByIds(ids).then(setSongs);
    } else {
      setSongs([]);
    }
  }, [favoriteIds]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 shrink-0 rounded-md overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-800 to-accent flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold uppercase">Playlist</p>
          <h1 className="text-5xl font-bold mt-2 mb-4">Liked Songs</h1>
          <p className="text-sm text-muted">{songs.length} songs</p>
        </div>
      </div>

      {songs.length > 0 && (
        <div className="flex items-center gap-4">
          <PlayButton songs={songs} size="lg" />
        </div>
      )}

      <TrackList songs={songs} showAlbum showCover />
    </div>
  );
}
