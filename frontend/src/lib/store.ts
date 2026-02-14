"use client";

import { create } from "zustand";
import type { Song, Album } from "@/data/mock";
import { allSongs } from "@/data/mock";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentTime: number;
  duration: number;
  volume: number;
  liked: Set<string>;
  flyoutAlbum: Album | null;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  openFlyout: (album: Album) => void;
  closeFlyout: () => void;
  playAlbum: (album: Album) => void;
  nextSong: () => void;
  prevSong: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

// Initialize liked from mock data
const initialLiked = new Set<string>();
allSongs.forEach((s) => {
  if (s.liked) initialLiked.add(s.id);
});

// Singleton audio element (only in browser)
let audio: HTMLAudioElement | null = null;
function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
  }
  return audio;
}

// Ticker for updating currentTime
let tickInterval: ReturnType<typeof setInterval> | null = null;

function startTick() {
  stopTick();
  tickInterval = setInterval(() => {
    const a = getAudio();
    if (!a.paused && !isNaN(a.duration)) {
      usePlayerStore.setState({
        currentTime: a.currentTime,
        duration: a.duration,
      });
    }
  }, 250);
}

function stopTick() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Set up audio event listeners once (only in browser)
  if (typeof window !== "undefined") {
    const a = getAudio();

    a.addEventListener("ended", () => {
      const { repeat, currentSong, queue } = get();
      if (repeat === "one") {
        a.currentTime = 0;
        a.play();
        return;
      }
      // Auto-advance
      get().nextSong();
    });

    a.addEventListener("loadedmetadata", () => {
      set({ duration: a.duration });
    });
  }

  return {
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentTime: 0,
    duration: 0,
    volume: 75,
    liked: initialLiked,
    flyoutAlbum: null,
    shuffle: false,
    repeat: "off",

    playSong: (song, queue) => {
      const a = getAudio();
      const state = get();

      // If same song, just toggle play
      if (state.currentSong?.id === song.id) {
        if (a.paused) {
          a.play();
          startTick();
          set({ isPlaying: true });
        } else {
          a.pause();
          stopTick();
          set({ isPlaying: false });
        }
        return;
      }

      a.src = song.audioSrc;
      a.volume = state.volume / 100;
      a.play().catch(() => {});
      startTick();

      set({
        currentSong: song,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        ...(queue ? { queue } : {}),
      });
    },

    togglePlay: () => {
      const a = getAudio();
      const { isPlaying, currentSong } = get();
      if (!currentSong) return;

      if (isPlaying) {
        a.pause();
        stopTick();
        set({ isPlaying: false });
      } else {
        a.play().catch(() => {});
        startTick();
        set({ isPlaying: true });
      }
    },

    seek: (time) => {
      const a = getAudio();
      if (!isNaN(a.duration)) {
        a.currentTime = time;
        set({ currentTime: time });
      }
    },

    setVolume: (v) => {
      const a = getAudio();
      a.volume = v / 100;
      set({ volume: v });
    },

    toggleLike: (songId) =>
      set((s) => {
        const next = new Set(s.liked);
        if (next.has(songId)) next.delete(songId);
        else next.add(songId);
        return { liked: next };
      }),

    isLiked: (songId) => get().liked.has(songId),
    openFlyout: (album) => set({ flyoutAlbum: album }),
    closeFlyout: () => set({ flyoutAlbum: null }),

    playAlbum: (album) => {
      if (album.songs.length > 0) {
        const a = getAudio();
        const song = album.songs[0];
        a.src = song.audioSrc;
        a.volume = get().volume / 100;
        a.play().catch(() => {});
        startTick();
        set({
          currentSong: song,
          queue: album.songs,
          isPlaying: true,
          currentTime: 0,
          duration: 0,
        });
      }
    },

    nextSong: () => {
      const { currentSong, queue, shuffle, repeat } = get();
      if (!currentSong || queue.length === 0) return;

      const idx = queue.findIndex((s) => s.id === currentSong.id);

      let nextIdx: number;
      if (shuffle) {
        nextIdx = Math.floor(Math.random() * queue.length);
      } else {
        nextIdx = idx + 1;
        if (nextIdx >= queue.length) {
          if (repeat === "all") {
            nextIdx = 0;
          } else {
            // Stop at end
            stopTick();
            set({ isPlaying: false });
            return;
          }
        }
      }

      const next = queue[nextIdx];
      const a = getAudio();
      a.src = next.audioSrc;
      a.volume = get().volume / 100;
      a.play().catch(() => {});
      startTick();
      set({ currentSong: next, isPlaying: true, currentTime: 0, duration: 0 });
    },

    prevSong: () => {
      const { currentSong, queue } = get();
      if (!currentSong || queue.length === 0) return;

      // If more than 3 seconds in, restart current song
      const a = getAudio();
      if (a.currentTime > 3) {
        a.currentTime = 0;
        set({ currentTime: 0 });
        return;
      }

      const idx = queue.findIndex((s) => s.id === currentSong.id);
      const prevIdx = (idx - 1 + queue.length) % queue.length;
      const prev = queue[prevIdx];
      a.src = prev.audioSrc;
      a.volume = get().volume / 100;
      a.play().catch(() => {});
      startTick();
      set({ currentSong: prev, isPlaying: true, currentTime: 0, duration: 0 });
    },

    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
    toggleRepeat: () =>
      set((s) => ({
        repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
      })),
  };
});
