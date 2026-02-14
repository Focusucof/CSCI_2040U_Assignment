"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import type { Song } from "@/data/mock";
import { artistNames } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";

interface SongCardProps {
  song: Song;
  index?: number;
}

export default function SongCard({ song, index = 0 }: SongCardProps) {
  const { playSong, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?.id === song.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => playSong(song)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-surface mb-3">
        <div className="aspect-square relative">
          <Image
            src={song.cover}
            alt={song.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

          {/* Single badge */}
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-accent/90 text-[10px] font-semibold uppercase tracking-wider text-white">
            Single
          </span>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            playSong(song);
          }}
          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isActive
              ? "bg-accent opacity-100 translate-y-0"
              : "bg-accent shadow-accent/25 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          }`}
        >
          {isActive && isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </motion.button>
      </div>
      <h3 className={`text-sm font-medium truncate px-0.5 ${isActive ? "text-accent" : "text-foreground"}`}>
        {song.title}
      </h3>
      <p className="text-xs text-muted truncate px-0.5 mt-0.5">
        {artistNames(song.artists)} · {song.duration}
      </p>
    </motion.div>
  );
}
