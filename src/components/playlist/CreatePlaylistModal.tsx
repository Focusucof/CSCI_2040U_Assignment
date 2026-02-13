'use client';

import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';

interface CreatePlaylistModalProps {
  onClose: () => void;
}

export default function CreatePlaylistModal({ onClose }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createPlaylist } = useLibrary();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createPlaylist(name.trim(), description.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-light rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Create Playlist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Playlist"
              className="w-full bg-surface text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="w-full bg-surface text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-muted hover:text-white transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 text-sm font-semibold bg-accent text-black rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
