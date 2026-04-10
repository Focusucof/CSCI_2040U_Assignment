'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Album } from '@/lib/types';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/album/${album.id}`);
  };

  return (
    <div
      className="relative bg-[#181818] hover:bg-[#252525] rounded-none transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Album Art */}
      <div className="relative aspect-square">
        <Image
          src={album.coverUrl}
          alt={album.title}
          fill
          className="object-cover transition-transform duration-500"
          sizes="200px"
        />
        
        {/* Play Button - Bottom Right */}
        <div className="absolute bottom-3 right-3 opacity-0 hover:opacity-100 translate-y-2 hover:translate-y-0 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-white truncate hover:text-purple-300 transition-colors">{album.title}</h3>
        <p className="text-xs text-zinc-400 truncate mt-1 hover:text-zinc-300 transition-colors">{album.artist}</p>
        
        {/* Year & Track Count */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-zinc-500">{album.year}</span>
          <span className="text-[10px] text-zinc-600">·</span>
          <span className="text-[10px] text-zinc-500">{album.trackCount} tracks</span>
        </div>
      </div>
    </div>
  );
}
