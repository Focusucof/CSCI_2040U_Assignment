"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import PlaylistCard from "@/components/PlaylistCard";
import { albums, artists, playlists } from "@/data/mock";

const tabs = ["Playlists", "Albums", "Artists"] as const;
type Tab = (typeof tabs)[number];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Playlists");

  return (
    <div className="px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          Your Library
        </h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Playlists" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {playlists.map((pl, i) => (
            <PlaylistCard key={pl.id} playlist={pl} index={i} />
          ))}
        </div>
      )}

      {activeTab === "Albums" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      )}

      {activeTab === "Artists" && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {artists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
