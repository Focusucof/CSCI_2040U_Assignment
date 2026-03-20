'use client';

import React from 'react';
import { Play, Heart } from 'lucide-react';
import Image from 'next/image';
import { Track } from '@/lib/types';

interface SongCardProps {
  track: Track;
  onPlay: (track: Track) => void;
}

export default function SongCard({ track, onPlay }: SongCardProps) {
  return (
    <button
      onClick={() => onPlay(track)}
      className="group relative bg-[#181818] hover:bg-[#252525] rounded-xl overflow-hidden transition-all duration-300 text-left w-full hover:-translate-y-1"
    >
      {/* Album Art Container */}
      <div className="relative aspect-square">
        <Image
          src={track.coverUrl}
          alt={track.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="200px"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>

        {/* Like Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-500"
        >
          <Heart className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">{track.title}</h3>
        <p className="text-xs text-zinc-400 truncate mt-1 group-hover:text-zinc-300 transition-colors">{track.artist}</p>
        
        {/* Genre Tag */}
        <div className="mt-2">
          <span className="inline-block px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-zinc-500 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
            {track.genre}
          </span>
        </div>
      </div>
    </button>
  );
}
