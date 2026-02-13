'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Playlist } from '@/services/types';

interface LibraryContextType {
  playlists: Playlist[];
  favoriteIds: Set<string>;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  getPlaylist: (id: string) => Playlist | undefined;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return fallback;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedPlaylists = loadFromStorage<Playlist[]>('playlists', []);
    const storedFavorites = loadFromStorage<string[]>('favorites', []);
    setPlaylists(storedPlaylists);
    setFavoriteIds(new Set(storedFavorites));
    setLoaded(true);
  }, []);

  // Persist playlists
  useEffect(() => {
    if (loaded) localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists, loaded]);

  // Persist favorites
  useEffect(() => {
    if (loaded) localStorage.setItem('favorites', JSON.stringify([...favoriteIds]));
  }, [favoriteIds, loaded]);

  const toggleFavorite = useCallback((songId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favoriteIds.has(songId);
  }, [favoriteIds]);

  const createPlaylist = useCallback((name: string, description = '') => {
    const playlist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      coverUrl: 'https://picsum.photos/seed/playlist/300/300',
      songIds: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists(prev => [...prev, playlist]);
    return playlist;
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  const addToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p
      )
    );
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter(id => id !== songId) }
          : p
      )
    );
  }, []);

  const getPlaylist = useCallback((id: string) => {
    return playlists.find(p => p.id === id);
  }, [playlists]);

  return (
    <LibraryContext.Provider
      value={{
        playlists,
        favoriteIds,
        toggleFavorite,
        isFavorite,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        getPlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
