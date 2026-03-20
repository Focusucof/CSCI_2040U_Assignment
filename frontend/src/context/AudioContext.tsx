'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Track } from '@/lib/types';

interface AudioContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  onTrackSelect: (track: Track) => void;
  onPlayPause: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextValue>({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  onTrackSelect: () => {},
  onPlayPause: () => {},
  setVolume: () => {},
  seek: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create the single Audio element once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audioUrl) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = currentTrack.audioUrl;
    if (isPlaying) {
      audio.play().catch(console.error);
    }
    // Only react to track URL changes, not isPlaying
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.audioUrl]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle volume
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

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        duration,
        onTrackSelect,
        onPlayPause,
        setVolume,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
