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
    <div className="group bg-zinc-900/60 hover:bg-zinc-800/80 rounded-lg p-3 transition-all duration-200 cursor-pointer">
      <div className="relative aspect-square rounded-md overflow-hidden mb-3 shadow-md">
        <Image
          src={album.coverUrl}
          alt={album.title}
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
      <h3 className="text-sm font-semibold text-white truncate">{album.title}</h3>
      <p className="text-xs text-zinc-400 truncate mt-0.5">{album.artist}</p>
      <p className="text-[11px] text-zinc-500 mt-1">{album.year} &middot; {album.trackCount} tracks</p>
    </div>
  );
}
