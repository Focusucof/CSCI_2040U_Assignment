'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ToastProvider';

interface RenamePlaylistModalProps {
  playlistId: string;
  currentName: string;
  onClose: () => void;
}

export default function RenamePlaylistModal({ playlistId, currentName, onClose }: RenamePlaylistModalProps) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const { renamePlaylist } = useUser();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === currentName) {
      onClose();
      return;
    }

    setLoading(true);
    const success = await renamePlaylist(playlistId, name.trim());
    setLoading(false);

    if (success) {
      addToast(`Playlist renamed to "${name.trim()}"`, 'success');
      onClose();
    } else {
      addToast('Failed to rename playlist', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" onClick={onClose} onMouseDown={(e) => e.stopPropagation()}>
      <div
        className="bg-[#1E1E1E] border border-white/10 rounded-none p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Rename Playlist</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <div className="flex gap-3 mt-6 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || name.trim() === currentName}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-none hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Renaming...' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}