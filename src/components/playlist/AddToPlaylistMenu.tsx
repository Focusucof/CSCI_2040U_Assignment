'use client';

import { useLibrary } from '@/context/LibraryContext';

interface AddToPlaylistMenuProps {
  songId: string;
  onClose: () => void;
  onRemove?: () => void;
}

export default function AddToPlaylistMenu({ songId, onClose, onRemove }: AddToPlaylistMenuProps) {
  const { playlists, addToPlaylist } = useLibrary();

  return (
    <div className="absolute right-0 top-8 z-50 w-52 bg-surface-light rounded-md shadow-xl py-1 text-sm">
      {onRemove && (
        <button
          onClick={() => { onRemove(); onClose(); }}
          className="w-full text-left px-4 py-2 hover:bg-surface-hover text-red-400"
        >
          Remove from playlist
        </button>
      )}
      <div className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Add to playlist</div>
      {playlists.length === 0 && (
        <p className="px-4 py-2 text-muted text-xs">No playlists yet</p>
      )}
      {playlists.map(p => (
        <button
          key={p.id}
          onClick={() => { addToPlaylist(p.id, songId); onClose(); }}
          className="w-full text-left px-4 py-2 hover:bg-surface-hover truncate"
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
