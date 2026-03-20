'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Music, Disc3, Mic2, Search, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Track, Album, Artist } from '@/lib/types';
import SectionHeader from '@/components/SectionHeader';
import AccountMenu from '@/components/AccountMenu';

const SONGS_API = 'http://localhost:8080/admin/songs';
const ALBUMS_API = 'http://localhost:8080/admin/albums';
const ARTISTS_API = 'http://localhost:8080/admin/artists';
const BACKEND_URL = 'http://localhost:8080';

function normalizeTrackUrl(track: Track): Track {
  let normalized = track;
  if (track.coverUrl && !track.coverUrl.startsWith('http')) {
    const prefix = track.coverUrl.startsWith('/') ? '' : '/';
    normalized = { ...normalized, coverUrl: BACKEND_URL + prefix + track.coverUrl };
  }
  if (track.audioUrl && !track.audioUrl.startsWith('http')) {
    const prefix = track.audioUrl.startsWith('/') ? '' : '/';
    normalized = { ...normalized, audioUrl: BACKEND_URL + prefix + track.audioUrl };
  }
  return normalized;
}

function normalizeImageUrl(url: string): string {
  if (url && !url.startsWith('http')) {
    const prefix = url.startsWith('/') ? '' : '/';
    return BACKEND_URL + prefix + url;
  }
  return url;
}

interface SearchContentProps {
  onPlayTrack: (track: Track) => void;
}

export default function SearchContent({ onPlayTrack }: SearchContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [songs, setSongs] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSongs([]);
      setAlbums([]);
      setArtists([]);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      try {
        const [songsRes, albumsRes, artistsRes] = await Promise.all([
          fetch(`${SONGS_API}/search?q=${encodeURIComponent(searchQuery)}`),
          fetch(`${ALBUMS_API}/search?q=${encodeURIComponent(searchQuery)}`),
          fetch(`${ARTISTS_API}/search?q=${encodeURIComponent(searchQuery)}`),
        ]);

        if (cancelled) return;

        const songsData = songsRes.ok ? await songsRes.json() : [];
        const albumsData = albumsRes.ok ? await albumsRes.json() : [];
        const artistsData = artistsRes.ok ? await artistsRes.json() : [];

        if (cancelled) return;

        setSongs(songsData.map(normalizeTrackUrl));
        setAlbums(albumsData.map((a: Album) => ({ ...a, coverUrl: normalizeImageUrl(a.coverUrl) })));
        setArtists(artistsData.map((a: Artist) => ({ ...a, imageUrl: normalizeImageUrl(a.imageUrl) })));
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const debounce = setTimeout(fetchResults, 100);
    return () => { cancelled = true; clearTimeout(debounce); };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSongs([]);
    setAlbums([]);
    setArtists([]);
    router.push('/search');
  };

  const hasResults = songs.length > 0 || albums.length > 0 || artists.length > 0;

  return (
    <main className="flex-1 overflow-y-auto pb-28 px-6 py-6 lg:px-8">
      {/* Top bar - Search (centered) and Account (right) */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Back button */}
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Search Bar - Centered */}
        <div className="relative flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1E1E] text-white placeholder-zinc-400 pl-12 pr-12 py-3 rounded-none text-sm focus:outline-none input-glow transition-all"
            />
          </form>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Account - Right */}
        <div className="flex-shrink-0">
          <AccountMenu />
        </div>
      </div>

      {/* Results */}
      {!searchQuery ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Search for music</h2>
          <p className="text-zinc-400">Find songs, artists, and albums</p>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-20">
          <Music className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
          <p className="text-zinc-400">Try searching for something else</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Songs Section */}
          {songs.length > 0 && (
            <section>
              <SectionHeader icon={Music} title={`Songs (${songs.length})`} />
              <div className="space-y-2">
                {songs.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => onPlayTrack(track)}
                    className="w-full flex items-center gap-4 bg-[#181818] hover:bg-[#252525] rounded-none p-3 transition-all duration-300"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <Image
                        src={track.coverUrl}
                        alt={track.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{track.title}</h3>
                      <p className="text-xs text-zinc-400 truncate">{track.artist} · {track.album} · {track.genre}</p>
                    </div>
                    <p className="text-xs text-zinc-500 px-3">{track.duration}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {albums.length > 0 && (
            <section>
              <SectionHeader icon={Disc3} title={`Albums (${albums.length})`} />
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="flex-shrink-0 w-44"
                  >
                    <div className="group bg-[#181818] hover:bg-[#252525] rounded-none p-3 transition-all duration-300 cursor-pointer">
                      <div className="relative w-36 h-36 mb-3">
                        <Image
                          src={album.coverUrl}
                          alt={album.title}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{album.title}</h3>
                      <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {artists.length > 0 && (
            <section>
              <SectionHeader icon={Mic2} title={`Artists (${artists.length})`} />
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex-shrink-0 w-44"
                  >
                    <div className="group bg-[#181818] hover:bg-[#252525] rounded-none p-3 transition-all duration-300 cursor-pointer text-center">
                      <div className="relative w-36 h-36 mx-auto mb-3 rounded-full overflow-hidden">
                        <Image
                          src={artist.imageUrl}
                          alt={artist.name}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{artist.name}</h3>
                      <p className="text-xs text-zinc-400 truncate">{artist.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
