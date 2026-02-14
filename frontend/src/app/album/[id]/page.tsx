"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getAlbumById } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";
import SongRow from "@/components/SongRow";

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const album = getAlbumById(id);
  const { playAlbum } = usePlayerStore();

  if (!album) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Album not found</p>
      </div>
    );
  }

  const totalDuration = album.songs.reduce((acc, s) => {
    const [m, sec] = s.duration.split(":").map(Number);
    return acc + m * 60 + sec;
  }, 0);
  const totalMin = Math.floor(totalDuration / 60);

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative h-[340px] overflow-hidden">
        <Image
          src={album.cover}
          alt={album.title}
          fill
          className="object-cover blur-2xl scale-110 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />

        <div className="relative z-10 h-full flex items-end px-8 pb-8">
          <Link
            href="/"
            className="absolute top-6 left-6 w-9 h-9 rounded-full bg-surface/60 backdrop-blur-sm flex items-center justify-center hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-end gap-6"
          >
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
              <Image
                src={album.cover}
                alt={album.title}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Album
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mt-1">
                {album.title}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted">
                <Link
                  href={`/artist/${album.artist.id}`}
                  className="text-foreground font-medium hover:underline"
                >
                  {album.artist.name}
                </Link>
                <span>·</span>
                <span>{album.year}</span>
                <span>·</span>
                <span>{album.songs.length} songs, {totalMin} min</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-5 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => playAlbum(album)}
          className="w-12 h-12 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center shadow-lg shadow-accent/25 transition-colors"
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </motion.button>
        <span className="text-sm text-muted">{album.genre}</span>
      </div>

      {/* Track list header */}
      <div className="px-8">
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider border-b border-border mb-2">
          <div className="w-8 text-center">#</div>
          <div className="flex-1">Title</div>
          <Clock className="w-3.5 h-3.5" />
        </div>

        {/* Songs */}
        {album.songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} showCover={false} queue={album.songs} />
        ))}
      </div>
    </div>
  );
}
