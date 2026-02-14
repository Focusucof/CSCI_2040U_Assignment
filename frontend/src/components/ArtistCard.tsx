"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Artist } from "@/data/mock";

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export default function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  return (
    <Link href={`/artist/${artist.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group cursor-pointer text-center"
      >
        <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 shadow-lg">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-full" />
        </div>
        <h3 className="text-sm font-medium text-foreground truncate">
          {artist.name}
        </h3>
        <p className="text-xs text-muted mt-0.5">Artist</p>
      </motion.div>
    </Link>
  );
}
