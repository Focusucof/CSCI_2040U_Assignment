'use client';

import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, Heart } from 'lucide-react';
import Image from 'next/image';
import { useAudio } from '@/context/AudioContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ToastProvider';

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function NowPlaying() {
  const { currentTrack, isPlaying, volume, currentTime, duration, onPlayPause, setVolume, seek } = useAudio();
  const { isLoggedIn, likedSongs, toggleLike } = useUser();
  const { addToast } = useToast();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = currentTrack ? likedSongs.has(currentTrack.id) : false;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      seek(percentage * duration);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      setVolume(Math.max(0, Math.min(1, x / rect.width)));
    }
  };

  const handleLike = () => {
    if (!currentTrack) return;
    if (!isLoggedIn) {
      addToast('Log in to like songs', 'error');
      return;
    }
    toggleLike(currentTrack.id);
  };

  if (!currentTrack) return null;

  return (
    <div className="h-24 bg-[#0a0a0a] border-t border-white/5 px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-14 h-14 rounded-none overflow-hidden flex-shrink-0 shadow-lg">
          <Image
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-white truncate">{currentTrack.title}</h4>
          <p className="text-xs text-zinc-400 truncate">{currentTrack.artists?.join(', ')}</p>
        </div>
        <button
          onClick={handleLike}
          className={`transition-colors ml-2 ${isLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-rose-500'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => seek(Math.max(0, currentTime - 10))}
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            className="w-10 h-10 play-btn rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            onClick={() => onPlayPause(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white fill-current" />
            ) : (
              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
            )}
          </button>
          <button
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => seek(Math.min(duration, currentTime + 10))}
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 font-mono">{formatTime(currentTime)}</span>
          <div
            className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:from-purple-400 group-hover:to-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">{formatTime(duration || 0)}</span>
        </div>
      </div>

      {/* Volume & Extra */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 cursor-pointer"
            style={{ width: `${volume * 100}%` }}
            onClick={handleVolumeChange}
          />
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
