'use client';

import React from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { Playlist } from '@/lib/types';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="relative bg-[#181818] hover:bg-[#252525] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1">
      {/* Playlist Cover */}
      <div className="relative aspect-square">
        <Image
          src={playlist.coverUrl}
          alt={playlist.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="200px"
        />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 translate-y-4 hover:translate-y-0 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-white truncate hover:text-purple-300 transition-colors">{playlist.title}</h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed hover:text-zinc-300 transition-colors">{playlist.description}</p>
        
        {/* Track Count */}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[10px] text-zinc-500">{playlist.trackCount} tracks</span>
        </div>
      </div>
    </div>
  );
}
