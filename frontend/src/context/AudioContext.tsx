'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Track } from '@/lib/types';

interface AudioContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  loop: 'none' | 'one' | 'all';
  shuffle: boolean;
  onTrackSelect: (track: Track) => void;
  onPlayPause: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (tracks: Track[]) => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextValue>({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  queue: [],
  loop: 'none',
  shuffle: false,
  onTrackSelect: () => {},
  onPlayPause: () => {},
  setVolume: () => {},
  seek: () => {},
  playNext: () => {},
  playPrevious: () => {},
  setQueue: () => {},
  toggleLoop: () => {},
  toggleShuffle: () => {},
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
  const [queue, setQueue] = useState<Track[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
  const [loop, setLoop] = useState<'none' | 'one' | 'all'>('none');
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const shuffleQueue = useCallback((tracks: Track[]) => {
    const shuffled = [...tracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    
    if (loop === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (loop === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    
    const nextTrack = queue[nextIndex];
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
    if (nextTrack.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/songs/${nextTrack.id}/play`, {
        method: 'POST',
      }).catch(console.error);
    }
  }, [queue, currentTrack, loop]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      if (loop === 'all') {
        prevIndex = queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    
    const prevTrack = queue[prevIndex];
    setCurrentTrack(prevTrack);
    setIsPlaying(true);
    if (prevTrack.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/songs/${prevTrack.id}/play`, {
        method: 'POST',
      }).catch(console.error);
    }
  }, [queue, currentTrack, loop]);

  const toggleLoop = useCallback(() => {
    setLoop(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none');
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      if (!prev) {
        setQueue(shuffleQueue(queue));
      } else {
        setQueue([...originalQueue]);
      }
      return !prev;
    });
  }, [queue, originalQueue, shuffleQueue]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (loop === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

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
  }, [loop, playNext]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audioUrl) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = currentTrack.audioUrl;
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack?.audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
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
    if (track.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/songs/${track.id}/play`, {
        method: 'POST',
      }).catch(console.error);
    }
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

  const handleSetQueue = useCallback((tracks: Track[]) => {
    setOriginalQueue(tracks);
    if (shuffle) {
      setQueue(shuffleQueue(tracks));
    } else {
      setQueue(tracks);
    }
  }, [shuffle, shuffleQueue]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        duration,
        queue,
        loop,
        shuffle,
        onTrackSelect,
        onPlayPause,
        setVolume,
        seek,
        playNext,
        playPrevious,
        setQueue: handleSetQueue,
        toggleLoop,
        toggleShuffle,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}