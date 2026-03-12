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
    <div className="group bg-zinc-900/60 hover:bg-zinc-800/80 rounded-lg p-3 transition-all duration-200 cursor-pointer">
      <div className="relative aspect-square rounded-md overflow-hidden mb-3 shadow-md">
        <Image
          src={playlist.coverUrl}
          alt={playlist.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-white truncate">{playlist.title}</h3>
      <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">{playlist.description}</p>
      <p className="text-[11px] text-zinc-500 mt-1.5">{playlist.trackCount} tracks</p>
    </div>
  );
}
