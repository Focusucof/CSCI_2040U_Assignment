'use client';

import React from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { Album } from '@/lib/types';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <div className="group relative bg-[#181818] hover:bg-[#252525] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1">
      {/* Album Art */}
      <div className="relative aspect-square">
        <Image
          src={album.coverUrl}
          alt={album.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="200px"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
        
        {/* Play Button - Bottom Right */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
        </div>

        {/* Album Info Overlay */}
        <div className="absolute bottom-3 left-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs font-medium text-white truncate">{album.title}</p>
          <p className="text-[10px] text-zinc-300 truncate">{album.artist}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">{album.title}</h3>
        <p className="text-xs text-zinc-400 truncate mt-1 group-hover:text-zinc-300 transition-colors">{album.artist}</p>
        
        {/* Year & Track Count */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-zinc-500">{album.year}</span>
          <span className="text-[10px] text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-500">{album.trackCount} tracks</span>
        </div>
      </div>
    </div>
  );
}
