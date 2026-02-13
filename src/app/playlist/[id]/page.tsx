'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Song } from '@/services/types';
import { useLibrary } from '@/context/LibraryContext';
import musicService from '@/services';
import TrackList from '@/components/ui/TrackList';
import PlayButton from '@/components/ui/PlayButton';

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getPlaylist, deletePlaylist, removeFromPlaylist } = useLibrary();
  const playlist = getPlaylist(id);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (playlist && playlist.songIds.length > 0) {
      musicService.getSongsByIds(playlist.songIds).then(setSongs);
    } else {
      setSongs([]);
    }
  }, [playlist]);

  if (!playlist) {
    return <div className="text-muted">Playlist not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 shrink-0 rounded-md overflow-hidden shadow-2xl bg-gradient-to-br from-surface-light to-surface flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white" opacity={0.4}>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold uppercase">Playlist</p>
          <h1 className="text-5xl font-bold mt-2 mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-muted mb-2">{playlist.description}</p>
          )}
          <p className="text-sm text-muted">{songs.length} songs</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {songs.length > 0 && <PlayButton songs={songs} size="lg" />}
        <button
          onClick={() => {
            deletePlaylist(id);
            router.push('/playlists');
          }}
          className="text-sm text-muted hover:text-white transition-colors"
        >
          Delete Playlist
        </button>
      </div>

      {/* Tracks */}
      <TrackList
        songs={songs}
        showAlbum
        showCover
        onRemove={(songId) => removeFromPlaylist(id, songId)}
      />
    </div>
  );
}
