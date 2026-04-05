'use client';

import { useState, useRef, useEffect } from 'react';
import { ListPlus } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ToastProvider';

interface AddToPlaylistDropdownProps {
  songId: string;
}

export default function AddToPlaylistDropdown({ songId }: AddToPlaylistDropdownProps) {
  const [open, setOpen] = useState(false);
  const { playlists, addSongToPlaylist } = useUser();
  const { addToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = async (playlistId: string, playlistName: string) => {
    await addSongToPlaylist(playlistId, songId);
    addToast(`Added to "${playlistName}"`, 'success');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-all duration-300"
      >
        <ListPlus className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-10 w-48 bg-[#1E1E1E] border border-white/10 rounded-none shadow-xl py-1 z-50">
          {playlists.length === 0 ? (
            <p className="px-4 py-2 text-xs text-zinc-500">No playlists yet</p>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(playlist.id, playlist.name);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors truncate"
              >
                {playlist.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
