'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Music, Disc3, ListMusic, Mic2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Track, Album, Artist, Playlist } from '@/lib/types';
import SectionHeader from '@/components/SectionHeader';
import SongCard from '@/components/SongCard';
import AlbumCard from '@/components/AlbumCard';
import PlaylistCard from '@/components/PlaylistCard';
import ArtistCard from '@/components/ArtistCard';
import AccountMenu from '@/components/AccountMenu';
import SongContextMenu from '@/components/SongContextMenu';
import { useAudio } from '@/context/AudioContext';

const API_BASE = 'http://localhost:8080/admin/songs';
const ALBUMS_API = 'http://localhost:8080/admin/albums';
const ARTISTS_API = 'http://localhost:8080/admin/artists';
const PLAYLISTS_API = 'http://localhost:3001/auth/playlists';
const BACKEND_URL = 'http://localhost:8080';

function normalizeTrackUrl(track: Track): Track {
  let normalized = track;
  if (track.coverUrl && track.coverUrl.trim() !== '' && !track.coverUrl.startsWith('http')) {
    const prefix = track.coverUrl.startsWith('/') ? '' : '/';
    normalized = { ...normalized, coverUrl: BACKEND_URL + prefix + track.coverUrl };
  } else if (!track.coverUrl || track.coverUrl.trim() === '') {
    normalized = { ...normalized, coverUrl: '/placeholder-music.svg' };
  }
  if (track.audioUrl && !track.audioUrl.startsWith('http')) {
    const prefix = track.audioUrl.startsWith('/') ? '' : '/';
    normalized = { ...normalized, audioUrl: BACKEND_URL + prefix + track.audioUrl };
  }
  const raw = track as Track & Record<string, unknown>;
  if (track.artists === undefined && raw.artist) {
    normalized = { ...normalized, artists: [String(raw.artist)] };
  }
  if (track.genres === undefined && raw.genre) {
    normalized = { ...normalized, genres: [String(raw.genre)] };
  }
  return normalized;
}

function normalizeAlbumUrl(album: Album): Album {
  let normalized = album;
  if (album.coverUrl && album.coverUrl.trim() !== '' && !album.coverUrl.startsWith('http')) {
    const prefix = album.coverUrl.startsWith('/') ? '' : '/';
    normalized = { ...normalized, coverUrl: BACKEND_URL + prefix + album.coverUrl };
  } else if (!album.coverUrl || album.coverUrl.trim() === '') {
    normalized = { ...normalized, coverUrl: '/placeholder-music.svg' };
  }
  return normalized;
}

function normalizeArtistUrl(artist: Artist): Artist {
  let normalized = artist;
  if (artist.imageUrl && artist.imageUrl.trim() !== '' && !artist.imageUrl.startsWith('http')) {
    const prefix = artist.imageUrl.startsWith('/') ? '' : '/';
    normalized = { ...normalized, imageUrl: BACKEND_URL + prefix + artist.imageUrl };
  } else if (!artist.imageUrl || artist.imageUrl.trim() === '') {
    normalized = { ...normalized, imageUrl: '/placeholder-music.svg' };
  }
  return normalized;
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 300 : -300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/section">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 z-10 -ml-5"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 z-10 -mr-5"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}

export default function FeaturedContent() {
  const router = useRouter();
  const { onTrackSelect, setQueue } = useAudio();
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [songsRes, albumsRes, artistsRes, playlistsRes] = await Promise.all([
          fetch(API_BASE),
          fetch(ALBUMS_API),
          fetch(ARTISTS_API),
          fetch(PLAYLISTS_API, { credentials: 'include' }),
        ]);

        if (!cancelled) {
          if (songsRes.ok) {
            const songsData = await songsRes.json();
            setAllSongs(songsData.map(normalizeTrackUrl));
          }
          if (albumsRes.ok) {
            const albumsData = await albumsRes.json();
            setAlbums(albumsData.map(normalizeAlbumUrl));
          }
          if (artistsRes.ok) {
            const artistsData = await artistsRes.json();
            setArtists(artistsData.map(normalizeArtistUrl));
          }
          if (playlistsRes.ok) {
            const playlistsData = await playlistsRes.json();
            const mappedPlaylists: Playlist[] = (playlistsData.playlists || []).map((p: { id: string; name: string; songIds: string[] }) => ({
              id: p.id,
              title: p.name,
              description: '',
              coverUrl: '/placeholder-music.svg',
              trackCount: p.songIds?.length || 0,
            }));
            setPlaylists(mappedPlaylists);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Derived state: no useEffect needed for filtering
  const searchSuggestions = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    const query = searchQuery.toLowerCase();
    return allSongs.filter(
      track =>
        track.title?.toLowerCase().includes(query) ||
        track.artists?.some(a => a.toLowerCase().includes(query)) ||
        track.album?.toLowerCase().includes(query) ||
        track.genres?.some(g => g.toLowerCase().includes(query))
    ).slice(0, 5);
  }, [searchQuery, allSongs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (track: Track) => {
    setSearchFocused(false);
    setSearchQuery('');
    onTrackSelect(track);
  };

  return (
    <main className="flex-1 overflow-y-auto pb-28 px-6 py-6 lg:px-8">
      {/* Top bar - Search (centered) and Account (right) */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="w-10" />

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search songs, artists, albums..."
              className="w-full bg-[#1E1E1E] text-white placeholder-zinc-400 pl-12 pr-12 py-3 rounded-none text-sm focus:outline-none input-glow transition-all"
            />
          </form>

          {searchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#252525] border border-zinc-700 z-50 fade-in">
              {searchSuggestions.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleSuggestionClick(track)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, track });
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(track)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#303030] transition-all duration-200 text-left"
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={track.coverUrl || '/placeholder-music.svg'}
                      alt={track.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{track.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{track.artists?.join(', ')} · {track.album}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setSearchFocused(false);
                }}
                className="w-full px-4 py-2 text-sm text-purple-400 hover:bg-[#303030] transition-colors border-t border-zinc-700"
              >
                View all results for &quot;{searchQuery}&quot;
              </button>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <AccountMenu />
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        {loading ? (
          <h1 className="text-3xl font-bold text-white">Loading...</h1>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white">Good evening</h1>
            <p className="text-zinc-400 mt-1">Discover something new today.</p>
          </div>
        )}
      </div>

      {/* Quick Picks */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {allSongs.slice(0, 6).map((track) => (
            <button
              key={track.id}
              onClick={() => onTrackSelect(track)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, track });
              }}
              className="group flex items-center gap-3 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-none transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={track.coverUrl || '/placeholder-music.svg'}
                  alt={track.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <span className="text-sm font-semibold text-white truncate pr-3 group-hover:text-purple-300 transition-colors">{track.title}</span>
              <div className="ml-auto mr-3 w-9 h-9 play-btn rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Featured Songs */}
      <section className="mb-10">
        <SectionHeader icon={Music} title="Featured" />
        {loading ? (
          <p className="text-zinc-400">Loading songs...</p>
        ) : allSongs.length === 0 ? (
          <p className="text-zinc-400">No songs available.</p>
        ) : (
          <HorizontalScroll>
            {allSongs.slice(0, 10).map((track) => (
              <div key={track.id} className="flex-shrink-0 w-48">
                <SongCard track={track} onPlay={onTrackSelect} onContextMenu={(e, t) => setContextMenu({ x: e.clientX, y: e.clientY, track: t })} />
              </div>
            ))}
          </HorizontalScroll>
        )}
      </section>

      {/* New Albums */}
      <section className="mb-10">
        <SectionHeader icon={Disc3} title="New Albums" />
        {loading ? (
          <p className="text-zinc-400">Loading albums...</p>
        ) : albums.length === 0 ? (
          <p className="text-zinc-400">No albums available.</p>
        ) : (
          <HorizontalScroll>
            {albums.map((album) => (
              <div key={album.id} className="flex-shrink-0 w-48">
                <AlbumCard album={album} />
              </div>
            ))}
          </HorizontalScroll>
        )}
      </section>

      {/* User Playlists */}
      <section className="mb-10">
        <SectionHeader icon={ListMusic} title="Your Playlists" />
        {playlists.length === 0 ? (
          <p className="text-zinc-400">No playlists yet.</p>
        ) : (
          <HorizontalScroll>
            {playlists.map((playlist) => (
              <div key={playlist.id} className="flex-shrink-0 w-48">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </HorizontalScroll>
        )}
      </section>

      {/* Featured Artists */}
      <section className="mb-10">
        <SectionHeader icon={Mic2} title="Featured Artists" />
        {loading ? (
          <p className="text-zinc-400">Loading artists...</p>
        ) : artists.length === 0 ? (
          <p className="text-zinc-400">No artists available.</p>
        ) : (
          <HorizontalScroll>
            {artists.map((artist) => (
              <div key={artist.id} className="flex-shrink-0 w-48">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </HorizontalScroll>
        )}
      </section>

      {contextMenu && (
        <SongContextMenu
          track={contextMenu.track}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </main>
  );
}
