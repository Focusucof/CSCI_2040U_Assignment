"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getPlaylistById } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";
import SongRow from "@/components/SongRow";

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const playlist = getPlaylistById(id);
  const { playSong } = usePlayerStore();

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative h-[300px] overflow-hidden">
        <Image
          src={playlist.cover}
          alt={playlist.name}
          fill
          className="object-cover blur-2xl scale-110 opacity-25"
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
            <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
              <Image
                src={playlist.cover}
                alt={playlist.name}
                width={176}
                height={176}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Playlist
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mt-1">
                {playlist.name}
              </h1>
              <p className="text-sm text-muted mt-2 max-w-md">
                {playlist.description}
              </p>
              <p className="text-xs text-muted mt-2">
                By {playlist.createdBy} · {playlist.songs.length} songs
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-5 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => playlist.songs[0] && playSong(playlist.songs[0], playlist.songs)}
          className="w-12 h-12 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center shadow-lg shadow-accent/25 transition-colors"
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </motion.button>
      </div>

      {/* Track list */}
      <div className="px-8">
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider border-b border-border mb-2">
          <div className="w-8 text-center">#</div>
          <div className="w-10"></div>
          <div className="flex-1">Title</div>
          <Clock className="w-3.5 h-3.5" />
        </div>

        {playlist.songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} showAlbum queue={playlist.songs} />
        ))}
      </div>
    </div>
  );
}
