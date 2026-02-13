'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Song } from '@/services/types';

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

interface PlayerContextType extends PlayerState {
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    queue: [],
    queueIndex: -1,
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 0.7,
    shuffle: false,
    repeat: 'off',
  });

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = state.volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, progress: audio.currentTime, duration: audio.duration || 0 }));
    };
    const handleEnded = () => {
      handleTrackEnd();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrackEnd = useCallback(() => {
    setState(prev => {
      if (prev.repeat === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        return prev;
      }

      let nextIndex = prev.queueIndex + 1;
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      }

      if (nextIndex >= prev.queue.length) {
        if (prev.repeat === 'all') {
          nextIndex = 0;
        } else {
          return { ...prev, isPlaying: false };
        }
      }

      const nextSong = prev.queue[nextIndex];
      if (nextSong && audioRef.current) {
        audioRef.current.src = nextSong.audioUrl;
        audioRef.current.play();
        return { ...prev, currentSong: nextSong, queueIndex: nextIndex, isPlaying: true };
      }
      return { ...prev, isPlaying: false };
    });
  }, []);

  // Re-attach ended handler when handleTrackEnd updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handler = () => handleTrackEnd();
    audio.addEventListener('ended', handler);
    return () => audio.removeEventListener('ended', handler);
  }, [handleTrackEnd]);

  const playSong = useCallback((song: Song, queue?: Song[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newQueue = queue || [song];
    const index = newQueue.findIndex(s => s.id === song.id);

    audio.src = song.audioUrl;
    audio.play();
    setState(prev => ({
      ...prev,
      currentSong: song,
      queue: newQueue,
      queueIndex: index >= 0 ? index : 0,
      isPlaying: true,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    if (state.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.isPlaying, state.currentSong]);

  const nextTrack = useCallback(() => {
    setState(prev => {
      let nextIndex = prev.queueIndex + 1;
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      }
      if (nextIndex >= prev.queue.length) {
        nextIndex = prev.repeat === 'all' ? 0 : prev.queueIndex;
      }
      const nextSong = prev.queue[nextIndex];
      if (nextSong && audioRef.current) {
        audioRef.current.src = nextSong.audioUrl;
        audioRef.current.play();
        return { ...prev, currentSong: nextSong, queueIndex: nextIndex, isPlaying: true };
      }
      return prev;
    });
  }, []);

  const prevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If past 3 seconds, restart current track
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    setState(prev => {
      let prevIndex = prev.queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = prev.repeat === 'all' ? prev.queue.length - 1 : 0;
      }
      const prevSong = prev.queue[prevIndex];
      if (prevSong && audioRef.current) {
        audioRef.current.src = prevSong.audioUrl;
        audioRef.current.play();
        return { ...prev, currentSong: prevSong, queueIndex: prevIndex, isPlaying: true };
      }
      return prev;
    });
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setState(prev => ({ ...prev, volume: vol }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
      const nextIndex = (modes.indexOf(prev.repeat) + 1) % modes.length;
      return { ...prev, repeat: modes[nextIndex] };
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playSong,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
