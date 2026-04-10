'use client';

import { Play, Heart } from 'lucide-react';
import Image from 'next/image';
import { Track } from '@/lib/types';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ToastProvider';
import AddToPlaylistDropdown from '@/components/AddToPlaylistDropdown';

interface SongCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onContextMenu?: (e: React.MouseEvent, track: Track) => void;
}

export default function SongCard({ track, onPlay, onContextMenu }: SongCardProps) {
  const { isLoggedIn, likedSongs, toggleLike } = useUser();
  const { addToast } = useToast();
  const isLiked = likedSongs.has(track.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      addToast('Log in to like songs', 'error');
      return;
    }
    toggleLike(track.id);
  };

  return (
    <div
      className="relative bg-[#181818] hover:bg-[#252525] rounded-none transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, track);
      }}
    >
      {/* Album Art Container */}
      <div
        className="relative aspect-square overflow-hidden"
        onClick={() => onPlay(track)}
      >
        <Image
          src={track.coverUrl || '/placeholder-music.svg'}
          alt={track.title}
          fill
          className="object-cover"
          sizes="200px"
        />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 translate-y-4 hover:translate-y-0 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isLiked ? 'opacity-100 text-rose-500' : 'opacity-0 hover:opacity-100 text-white hover:bg-purple-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Add to Playlist Button */}
      {isLoggedIn && (
        <div className="absolute top-3 left-3 z-10 opacity-0 hover:opacity-100 transition-all duration-300"
          style={{ pointerEvents: 'auto' }}
        >
          <AddToPlaylistDropdown songId={track.id} />
        </div>
      )}

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-white truncate hover:text-purple-300 transition-colors">{track.title}</h3>
        <p className="text-xs text-zinc-400 truncate mt-1 hover:text-zinc-300 transition-colors">{track.artists?.join(', ')}</p>

        {/* Genre Tags */}
        {track.genres && track.genres.length > 0 && (
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-zinc-500 hover:text-purple-300 hover:bg-purple-500/20 transition-colors">
              {track.genres[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
