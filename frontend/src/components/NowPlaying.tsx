'use client';

import React from 'react';
import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, Heart } from 'lucide-react';
import Image from 'next/image';
import { Track } from '@/lib/types';

interface NowPlayingProps {
  currentTrack: Track | null;
}

export default function NowPlaying({ currentTrack }: NowPlayingProps) {
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
          <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
        </div>
        <button className="text-zinc-400 hover:text-rose-500 transition-colors ml-2">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button className="w-10 h-10 play-btn rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 font-mono">0:45</span>
          <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer">
            <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:from-purple-400 group-hover:to-cyan-400 transition-all" />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Volume & Extra */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-cyan-500" />
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
