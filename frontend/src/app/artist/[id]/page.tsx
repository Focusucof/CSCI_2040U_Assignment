"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getArtistById, getAlbumsByArtist, getSongsByArtist } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";
import AlbumCard from "@/components/AlbumCard";
import SongRow from "@/components/SongRow";

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const artist = getArtistById(id);
  const { playSong } = usePlayerStore();

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Artist not found</p>
      </div>
    );
  }

  const artistAlbums = getAlbumsByArtist(artist.id);
  const topSongs = getSongsByArtist(artist.id).slice(0, 5);

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative h-[360px] overflow-hidden">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          className="object-cover blur-xl scale-110 opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

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
            <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl flex-shrink-0">
              <Image
                src={artist.image}
                alt={artist.name}
                width={176}
                height={176}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Artist
              </span>
              <h1 className="text-5xl font-bold tracking-tight text-foreground mt-1">
                {artist.name}
              </h1>
              <p className="text-sm text-muted mt-2">
                {artist.monthlyListeners} monthly listeners
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-5 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => topSongs[0] && playSong(topSongs[0], topSongs)}
          className="w-12 h-12 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center shadow-lg shadow-accent/25 transition-colors"
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </motion.button>
      </div>

      {/* Bio */}
      <div className="px-8 mb-8">
        <p className="text-sm text-muted max-w-2xl leading-relaxed">{artist.bio}</p>
      </div>

      {/* Popular tracks */}
      <section className="px-8 mb-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
          Popular
        </h2>
        {topSongs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} showAlbum queue={topSongs} />
        ))}
      </section>

      {/* Discography */}
      <section className="px-8 mb-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-5">
          Discography
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {artistAlbums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
