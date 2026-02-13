'use client';

import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import PlaylistCard from '@/components/playlist/PlaylistCard';
import CreatePlaylistModal from '@/components/playlist/CreatePlaylistModal';

export default function PlaylistsPage() {
  const { playlists } = useLibrary();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 text-sm font-semibold bg-accent text-black rounded-full hover:bg-accent-hover transition-colors"
        >
          Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-16">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted mb-4">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor" />
          </svg>
          <p className="text-muted">No playlists yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map(playlist => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
