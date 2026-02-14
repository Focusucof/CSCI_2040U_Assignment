"use client";

import Image from "next/image";
import { Play, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Song } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";

interface SongRowProps {
  song: Song;
  index: number;
  showCover?: boolean;
  showAlbum?: boolean;
  queue?: Song[];
}

export default function SongRow({ song, index, showCover = true, showAlbum = false, queue }: SongRowProps) {
  const { playSong, currentSong, isPlaying, toggleLike, liked } = usePlayerStore();
  const isActive = currentSong?.id === song.id;
  const isLiked = liked.has(song.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => playSong(song, queue)}
      className={`group flex items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
        isActive ? "bg-accent-muted" : "hover:bg-surface-hover"
      }`}
    >
      {/* Track number / play icon */}
      <div className="w-8 text-center flex-shrink-0">
        <span className={`text-sm tabular-nums group-hover:hidden ${isActive ? "text-accent" : "text-muted"}`}>
          {index + 1}
        </span>
        <Play
          className={`w-4 h-4 hidden group-hover:block mx-auto ${
            isActive && isPlaying ? "text-accent" : "text-foreground"
          } fill-current`}
        />
      </div>

      {/* Cover */}
      {showCover && (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={song.cover} alt={song.title} fill className="object-cover" />
        </div>
      )}

      {/* Title & Artist */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? "text-accent" : "text-foreground"}`}>
          {song.title}
        </p>
        <p className="text-xs text-muted truncate">{song.artist.name}</p>
      </div>

      {/* Album name */}
      {showAlbum && song.album && (
        <span className="text-xs text-muted hidden md:block truncate max-w-[150px]">
          {song.album.title}
        </span>
      )}

      {/* Like */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(song.id);
        }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isLiked ? "fill-accent text-accent opacity-100" : "text-muted hover:text-foreground"
          }`}
          style={isLiked ? { opacity: 1 } : undefined}
        />
      </button>

      {/* Duration */}
      <span className="text-xs text-muted tabular-nums w-10 text-right flex-shrink-0">
        {song.duration}
      </span>
    </motion.div>
  );
}
