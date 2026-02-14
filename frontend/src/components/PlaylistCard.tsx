"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Playlist } from "@/data/mock";

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export default function PlaylistCard({ playlist, index = 0 }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group cursor-pointer"
      >
        <div className="relative rounded-2xl overflow-hidden bg-surface mb-3">
          <div className="aspect-square relative">
            <Image
              src={playlist.cover}
              alt={playlist.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
          </div>
          <motion.div
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-accent shadow-lg shadow-accent/25 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </motion.div>
        </div>
        <h3 className="text-sm font-medium text-foreground truncate px-0.5">
          {playlist.name}
        </h3>
        <p className="text-xs text-muted truncate px-0.5 mt-0.5">
          {playlist.description}
        </p>
      </motion.div>
    </Link>
  );
}
