'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Track } from '@/lib/types';

interface AudioContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  onTrackSelect: (track: Track) => void;
  onPlayPause: (playing: boolean) => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextValue>({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  onTrackSelect: () => {},
  onPlayPause: () => {},
  setVolume: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (currentTrack?.audioUrl && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack?.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onTrackSelect = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const onPlayPause = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        onTrackSelect,
        onPlayPause,
        setVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
