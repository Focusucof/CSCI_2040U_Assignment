'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Play, Music, Disc3, ListMusic, Mic2, Search, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Track } from '@/lib/types';
import { newAlbums, featuredPlaylists, featuredArtists } from '@/lib/mockData';
import SectionHeader from '@/components/SectionHeader';
import SongCard from '@/components/SongCard';
import AlbumCard from '@/components/AlbumCard';
import PlaylistCard from '@/components/PlaylistCard';
import ArtistCard from '@/components/ArtistCard';
import AccountMenu from '@/components/AccountMenu';

const API_BASE = 'http://localhost:8080/admin/songs';
const BACKEND_URL = 'http://localhost:8080';

function normalizeTrackUrl(track: Track): Track {
  if (track.coverUrl && !track.coverUrl.startsWith('http')) {
    return { ...track, coverUrl: BACKEND_URL + track.coverUrl };
  }
  return track;
}

interface HorizontalScrollProps {
  children: React.ReactNode;
}

function HorizontalScroll({ children }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
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

interface SearchContentProps {
  onPlayTrack: (track: Track) => void;
}

export default function SearchContent({ onPlayTrack }: SearchContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.map(normalizeTrackUrl));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(fetchResults, 100);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    router.push('/search');
  };

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
      ) : searchResults.length === 0 ? (
        <div className="text-center py-20">
          <Music className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
          <p className="text-zinc-400">Try searching for something else</p>
        </div>
        ) : (
        <section className="mb-10">
          <SectionHeader 
            icon={Music} 
            title={`${searchResults.length} Results`} 
          />
          <div className="space-y-2 fade-in">
            {searchResults.map((track) => (
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
    </main>
  );
}
