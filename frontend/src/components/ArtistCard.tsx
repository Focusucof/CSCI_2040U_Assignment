'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Artist } from '@/lib/types';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/artist/${artist.id}`);
  };

  return (
    <div
      className="relative bg-[#181818] hover:bg-[#252525] rounded-none overflow-hidden transition-all duration-300 cursor-pointer text-center p-4 hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Artist Image with Glowing Ring */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Glowing Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl" />
        
        {/* Image Container */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all duration-300">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="150px"
          />
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Artist Name */}
      <h3 className="text-base font-bold text-white truncate hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all">
        {artist.name}
      </h3>
      
      {/* Genre */}
      <p className="text-xs text-zinc-400 mt-1 hover:text-zinc-300 transition-colors">{artist.genre}</p>

      {/* Follow Button (appears on hover) */}
      <button className="mt-3 px-4 py-1.5 bg-white/10 hover:bg-purple-500 rounded-full text-[10px] font-medium text-white opacity-0 hover:opacity-100 transition-all duration-300">
        Follow
      </button>
    </div>
  );
}
