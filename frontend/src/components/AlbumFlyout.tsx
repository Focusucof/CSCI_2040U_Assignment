"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Play, Clock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/lib/store";
import { artistNames } from "@/data/mock";
import SongRow from "./SongRow";

export default function AlbumFlyout() {
  const { flyoutAlbum, closeFlyout, playAlbum } = usePlayerStore();

  return (
    <AnimatePresence>
      {flyoutAlbum && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeFlyout}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Flyout Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed right-6 top-6 bottom-[104px] w-[420px] bg-surface rounded-3xl border border-border shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header with album art */}
            <div className="relative h-[200px] flex-shrink-0">
              <Image
                src={flyoutAlbum.cover}
                alt={flyoutAlbum.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

              {/* Close button */}
              <button
                onClick={closeFlyout}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Album info overlay */}
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    <Image
                      src={flyoutAlbum.cover}
                      alt={flyoutAlbum.title}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-foreground truncate">
                      {flyoutAlbum.title}
                    </h2>
                    <p className="text-sm text-muted">
                      {artistNames(flyoutAlbum.artists)} · {flyoutAlbum.year} · {flyoutAlbum.genre}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
              <button
                onClick={() => playAlbum(flyoutAlbum)}
                className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover rounded-full text-sm font-medium text-white transition-colors"
              >
                <Play className="w-4 h-4 fill-white" />
                Play
              </button>
              <Link
                href={`/album/${flyoutAlbum.id}`}
                onClick={closeFlyout}
                className="flex items-center gap-2 px-4 py-2 bg-surface-hover hover:bg-border rounded-full text-sm font-medium text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Full Page
              </Link>
              <div className="ml-auto flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                {flyoutAlbum.songs.length} tracks
              </div>
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-y-auto py-2">
              {flyoutAlbum.songs.map((song, i) => (
                <SongRow key={song.id} song={song} index={i} showCover={false} queue={flyoutAlbum.songs} />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
