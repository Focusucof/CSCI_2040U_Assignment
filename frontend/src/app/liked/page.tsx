"use client";

import { Heart, Play, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { allSongs } from "@/data/mock";
import { usePlayerStore } from "@/lib/store";
import SongRow from "@/components/SongRow";

export default function LikedPage() {
  const { liked, playSong } = usePlayerStore();
  const likedSongsList = allSongs.filter((s) => liked.has(s.id));

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative h-[260px] overflow-hidden bg-gradient-to-b from-accent/20 to-background">
        <div className="relative z-10 h-full flex items-end px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-end gap-6"
          >
            <div className="w-44 h-44 rounded-2xl bg-gradient-to-br from-accent to-purple-900 flex items-center justify-center shadow-2xl flex-shrink-0">
              <Heart className="w-16 h-16 text-white fill-white" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Playlist
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mt-1">
                Liked Songs
              </h1>
              <p className="text-sm text-muted mt-2">
                {likedSongsList.length} songs
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-5 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => likedSongsList[0] && playSong(likedSongsList[0], likedSongsList)}
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

        {likedSongsList.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">Songs you like will appear here</p>
          </div>
        ) : (
          likedSongsList.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} showAlbum queue={likedSongsList} />
          ))
        )}
      </div>
    </div>
  );
}
