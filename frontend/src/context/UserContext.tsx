'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { UserPlaylist } from '@/lib/types';

interface UserData {
  userId: string;
  username: string;
  isAdmin: boolean;
}

interface UserContextValue {
  user: UserData | null;
  isLoggedIn: boolean;
  likedSongs: Set<string>;
  playlists: UserPlaylist[];
  toggleLike: (songId: string) => Promise<void>;
  createPlaylist: (name: string) => Promise<UserPlaylist | null>;
  deletePlaylist: (id: string) => Promise<void>;
  renamePlaylist: (id: string, name: string) => Promise<boolean>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoggedIn: false,
  likedSongs: new Set(),
  playlists: [],
  toggleLike: async () => {},
  createPlaylist: async () => null,
  deletePlaylist: async () => {},
  renamePlaylist: async () => false,
  addSongToPlaylist: async () => {},
  removeSongFromPlaylist: async () => {},
  refreshUser: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001';

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const likedSongsRef = useRef(likedSongs);
  useEffect(() => { likedSongsRef.current = likedSongs; }, [likedSongs]);
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);

  const fetchUserData = useCallback(async () => {
    try {
      const meRes = await fetch(`${AUTH_URL}/auth/me`, { credentials: 'include' });
      if (!meRes.ok) {
        setUser(null);
        setLikedSongs(new Set());
        setPlaylists([]);
        return;
      }
      const meData = await meRes.json();
      setUser(meData);

      const [likesRes, playlistsRes] = await Promise.all([
        fetch(`${AUTH_URL}/auth/likes`, { credentials: 'include' }),
        fetch(`${AUTH_URL}/auth/playlists`, { credentials: 'include' }),
      ]);

      if (likesRes.ok) {
        const likesData = await likesRes.json();
        setLikedSongs(new Set(likesData.likedSongs));
      }
      if (playlistsRes.ok) {
        const playlistsData = await playlistsRes.json();
        setPlaylists(playlistsData.playlists);
      }
    } catch {
      setUser(null);
      setLikedSongs(new Set());
      setPlaylists([]);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleLike = useCallback(async (songId: string) => {
    const wasLiked = likedSongsRef.current.has(songId);
    // Optimistic update
    setLikedSongs((prev) => {
      const next = new Set(prev);
      if (wasLiked) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });

    try {
      const res = await fetch(`${AUTH_URL}/auth/likes/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ songId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLikedSongs(new Set(data.likedSongs));
    } catch {
      // Revert on failure
      setLikedSongs((prev) => {
        const next = new Set(prev);
        if (wasLiked) {
          next.add(songId);
        } else {
          next.delete(songId);
        }
        return next;
      });
    }
  }, []);

  const createPlaylist = useCallback(async (name: string): Promise<UserPlaylist | null> => {
    try {
      const res = await fetch(`${AUTH_URL}/auth/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      if (!res.ok) return null;
      const newPlaylist: UserPlaylist = await res.json();
      setPlaylists((prev) => [...prev, newPlaylist]);
      return newPlaylist;
    } catch {
      return null;
    }
  }, []);

  const deletePlaylist = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${AUTH_URL}/auth/playlists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setPlaylists((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {}
  }, []);

  const renamePlaylist = useCallback(async (id: string, name: string): Promise<boolean> => {
    try {
      const res = await fetch(`${AUTH_URL}/auth/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const updated: UserPlaylist = await res.json();
        setPlaylists((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const addSongToPlaylist = useCallback(async (playlistId: string, songId: string) => {
    try {
      const res = await fetch(`${AUTH_URL}/auth/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ songId }),
      });
      if (res.ok) {
        const updated: UserPlaylist = await res.json();
        setPlaylists((prev) =>
          prev.map((p) => (p.id === playlistId ? updated : p))
        );
      }
    } catch {}
  }, []);

  const removeSongFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    try {
      const res = await fetch(`${AUTH_URL}/auth/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const updated: UserPlaylist = await res.json();
        setPlaylists((prev) =>
          prev.map((p) => (p.id === playlistId ? updated : p))
        );
      }
    } catch {}
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        likedSongs,
        playlists,
        toggleLike,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        refreshUser: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
