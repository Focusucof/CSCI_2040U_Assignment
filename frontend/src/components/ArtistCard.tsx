'use client';

import React from 'react';
import Image from 'next/image';
import { Artist } from '@/lib/types';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="group bg-zinc-900/60 hover:bg-zinc-800/80 rounded-lg p-3 transition-all duration-200 cursor-pointer text-center">
      <div className="relative aspect-square rounded-full overflow-hidden mb-3 shadow-md mx-auto">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="200px"
        />
      </div>
      <h3 className="text-sm font-semibold text-white truncate">{artist.name}</h3>
      <p className="text-xs text-zinc-400 mt-0.5">{artist.genre}</p>
    </div>
  );
}
