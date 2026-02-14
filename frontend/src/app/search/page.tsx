"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { albums, artists, allSongs } from "@/data/mock";
import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import SongRow from "@/components/SongRow";

const genres = [
  { name: "Electronic", color: "from-violet-600 to-blue-600" },
  { name: "Indie Rock", color: "from-rose-600 to-orange-500" },
  { name: "R&B", color: "from-amber-600 to-yellow-500" },
  { name: "Folk", color: "from-emerald-600 to-teal-500" },
  { name: "Lo-fi", color: "from-cyan-600 to-sky-500" },
  { name: "Dream Pop", color: "from-pink-500 to-purple-600" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      songs: allSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.name.toLowerCase().includes(q)
      ).slice(0, 6),
      albumResults: albums.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artist.name.toLowerCase().includes(q)
      ),
      artistResults: artists.filter((a) =>
        a.name.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  return (
    <div className="px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          Search
        </h1>
      </motion.div>

      {/* Search input */}
      <div className="relative max-w-lg mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />
      </div>

      {/* Results */}
      {results ? (
        <div>
          {results.songs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-3">Songs</h2>
              {results.songs.map((song, i) => (
                <SongRow key={song.id} song={song} index={i} showAlbum />
              ))}
            </section>
          )}

          {results.artistResults.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Artists</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {results.artistResults.map((artist, i) => (
                  <ArtistCard key={artist.id} artist={artist} index={i} />
                ))}
              </div>
            </section>
          )}

          {results.albumResults.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {results.albumResults.map((album, i) => (
                  <AlbumCard key={album.id} album={album} index={i} />
                ))}
              </div>
            </section>
          )}

          {results.songs.length === 0 &&
            results.albumResults.length === 0 &&
            results.artistResults.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted">No results for &ldquo;{query}&rdquo;</p>
              </div>
            )}
        </div>
      ) : (
        /* Browse genres */
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {genres.map((genre, i) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => setQuery(genre.name)}
                className={`relative h-32 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${genre.color} hover:scale-[1.02] transition-transform`}
              >
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="text-lg font-bold text-white">{genre.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
