"use client";

import { motion } from "framer-motion";
import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import PlaylistCard from "@/components/PlaylistCard";
import SongCard from "@/components/SongCard";
import SectionHeader from "@/components/SectionHeader";
import { recentlyPlayed, featuredAlbums, newReleases, artists, playlists, singles, allSongs, artistNames } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";

export default function Home() {
  const { openFlyout, playSong } = usePlayerStore();
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  // Quick picks: mix of recent albums and recent songs
  const quickAlbums = recentlyPlayed.slice(0, 4);
  const quickSingles = singles.slice(0, 2);

  return (
    <div className="px-8 py-8">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {greeting}
        </h1>
        <p className="text-muted mt-2 text-base">
          Here&apos;s what&apos;s been playing around you.
        </p>
      </motion.div>

      {/* Quick picks - compact grid mixing albums and singles */}
      <section className="mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {quickAlbums.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group flex items-center gap-3 bg-surface hover:bg-surface-hover rounded-xl overflow-hidden cursor-pointer transition-colors"
              onClick={() => openFlyout(album)}
            >
              <img
                src={album.cover}
                alt={album.title}
                className="w-16 h-16 object-cover flex-shrink-0"
              />
              <div className="min-w-0 pr-3">
                <span className="text-sm font-medium text-foreground truncate block">
                  {album.title}
                </span>
                <span className="text-xs text-muted truncate block">
                  {artistNames(album.artists)}
                </span>
              </div>
            </motion.div>
          ))}
          {quickSingles.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (quickAlbums.length + i) * 0.05 }}
              className="group flex items-center gap-3 bg-surface hover:bg-surface-hover rounded-xl overflow-hidden cursor-pointer transition-colors"
              onClick={() => playSong(song)}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="w-16 h-16 object-cover flex-shrink-0"
              />
              <div className="min-w-0 pr-3">
                <span className="text-sm font-medium text-foreground truncate block">
                  {song.title}
                </span>
                <span className="text-xs text-muted truncate block">
                  {artistNames(song.artists)} · Single
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Singles */}
      {singles.length > 0 && (
        <section className="mb-10">
          <SectionHeader title="Singles" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {singles.map((song, i) => (
              <SongCard key={song.id} song={song} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Albums */}
      <section className="mb-10">
        <SectionHeader title="Featured" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featuredAlbums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="mb-10">
        <SectionHeader title="New Releases" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {newReleases.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>

      {/* Made for you - playlists */}
      <section className="mb-10">
        <SectionHeader title="Made for You" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {playlists.slice(0, 5).map((pl, i) => (
            <PlaylistCard key={pl.id} playlist={pl} index={i} />
          ))}
        </div>
      </section>

      {/* Artists */}
      <section className="mb-10">
        <SectionHeader title="Popular Artists" />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {artists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
