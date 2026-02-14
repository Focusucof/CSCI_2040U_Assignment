"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/lib/store";
import { artistNames } from "@/data/mock";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NowPlaying() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    toggleLike,
    liked,
    nextSong,
    prevSong,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
  } = usePlayerStore();

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[88px] bg-surface/80 backdrop-blur-xl border-t border-border z-40 flex items-center justify-center">
        <span className="text-muted text-sm">No song playing - pick something to listen to</span>
      </div>
    );
  }

  const isLiked = liked.has(currentSong.id);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[88px] bg-surface/80 backdrop-blur-xl border-t border-border z-40">
      <div className="h-full max-w-full px-4 flex items-center">
        {/* Song Info - Left */}
        <div className="flex items-center gap-3 w-[260px] min-w-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
            >
              <Image
                src={currentSong.cover}
                alt={currentSong.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-muted truncate">
              {artistNames(currentSong.artists)}
            </p>
          </div>
          <button
            onClick={() => toggleLike(currentSong.id)}
            className="ml-1 flex-shrink-0"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? "fill-accent text-accent" : "text-muted hover:text-foreground"
              }`}
            />
          </button>
        </div>

        {/* Controls - Center */}
        <div className="flex-1 flex flex-col items-center gap-1.5 max-w-[600px] mx-auto">
          <div className="flex items-center gap-5">
            <button
              onClick={toggleShuffle}
              className={`transition-colors ${shuffle ? "text-accent" : "text-muted hover:text-foreground"}`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={prevSong}
              className="text-muted hover:text-foreground transition-colors"
            >
              <SkipBack className="w-4.5 h-4.5 fill-current" />
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-background fill-current" />
              ) : (
                <Play className="w-4 h-4 text-background fill-current ml-0.5" />
              )}
            </motion.button>
            <button
              onClick={nextSong}
              className="text-muted hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4.5 h-4.5 fill-current" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`transition-colors ${repeat !== "off" ? "text-accent" : "text-muted hover:text-foreground"}`}
            >
              {repeat === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] text-muted w-10 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 accent-accent"
              style={{
                background: `linear-gradient(to right, #8b5cf6 ${progress}%, #27272a ${progress}%)`,
              }}
            />
            <span className="text-[11px] text-muted w-10 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume - Right */}
        <div className="flex items-center gap-2 w-[200px] justify-end">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 75)}
            className="text-muted hover:text-foreground transition-colors"
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-accent"
            style={{
              background: `linear-gradient(to right, #8b5cf6 ${volume}%, #27272a ${volume}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
