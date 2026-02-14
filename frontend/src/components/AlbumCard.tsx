"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Album } from "@/data/mock";
import { artistNames } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";

interface AlbumCardProps {
  album: Album;
  index?: number;
}

export default function AlbumCard({ album, index = 0 }: AlbumCardProps) {
  const { openFlyout, playAlbum } = usePlayerStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => openFlyout(album)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-surface mb-3">
        <div className="aspect-square relative">
          <Image
            src={album.cover}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            playAlbum(album);
          }}
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-accent shadow-lg shadow-accent/25 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </motion.button>
      </div>
      <h3 className="text-sm font-medium text-foreground truncate px-0.5">
        {album.title}
      </h3>
      <p className="text-xs text-muted truncate px-0.5 mt-0.5">
        {artistNames(album.artists)} · {album.year}
      </p>
    </motion.div>
  );
}
