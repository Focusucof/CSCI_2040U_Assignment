'use client';

import React, { useState, useEffect } from 'react';
import { Play, Music, Disc3, ListMusic, Mic2, Search, X } from 'lucide-react';
import Image from 'next/image';
import { Track } from '@/lib/types';
import { newSongs, newAlbums, featuredPlaylists, featuredArtists } from '@/lib/mockData';
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

interface FeaturedContentProps {
  onPlayTrack: (track: Track) => void;
}

export default function FeaturedContent({ onPlayTrack }: FeaturedContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(API_BASE);
        if (response.ok) {
          const data = await response.json();
          setAllSongs(data.map(normalizeTrackUrl));
        }
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const searchSongs = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
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

    const debounce = setTimeout(searchSongs, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const displayedTracks = isSearching ? searchResults : allSongs;

  return (
    <main className="flex-1 overflow-y-auto pb-28 px-6 py-6 lg:px-8">
      {/* Top bar - Search (centered) and Account (right) */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Empty div for left spacing */}
        <div className="w-10" />

        {/* Search Bar - Centered */}
        <div className="relative flex-1 max-w-xl mx-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E1E1E] text-white placeholder-zinc-400 pl-12 pr-12 py-3 rounded-xl text-sm focus:outline-none input-glow transition-all"
          />
          {searchQuery && (
            <button
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

      {/* Greeting */}
      <div className="mb-8">
        {loading ? (
          <div>
            <h1 className="text-3xl font-bold text-white">Loading...</h1>
          </div>
        ) : isSearching ? (
          <div>
            <h1 className="text-3xl font-bold text-white">Search Results</h1>
            <p className="text-zinc-400 mt-1">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white">Good evening</h1>
            <p className="text-zinc-400 mt-1">Discover something new today.</p>
          </div>
        )}
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {!loading && displayedTracks.slice(0, 6).map((track) => (
          <button
            key={track.id}
            onClick={() => onPlayTrack(track)}
            className="group flex items-center gap-3 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src={track.coverUrl}
                alt={track.title}
                fill
                className="object-cover"
                sizes="56px"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <span className="text-sm font-semibold text-white truncate pr-3 group-hover:text-purple-300 transition-colors">{track.title}</span>
            <div className="ml-auto mr-3 w-9 h-9 play-btn rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
              <Play className="w-4 h-4 text-white fill-current ml-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* songs */}
      <section className="mb-10">
        <SectionHeader 
          icon={Music} 
          title={isSearching ? 'Songs' : 'All Songs'} 
        />
        {loading ? (
          <p className="text-zinc-400">Loading songs...</p>
        ) : displayedTracks.length === 0 ? (
          <p className="text-zinc-400">
            {isSearching ? 'No songs found. Try a different search term.' : 'No songs available.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayedTracks.map((track) => (
              <SongCard key={track.id} track={track} onPlay={onPlayTrack} />
            ))}
          </div>
        )}
      </section>

      {/* New Albums */}
      {!isSearching && (
        <section className="mb-10">
          <SectionHeader icon={Disc3} title="New Albums" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {newAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Playlists */}
      {!isSearching && (
        <section className="mb-10">
          <SectionHeader icon={ListMusic} title="Featured Playlists" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Artists */}
      {!isSearching && (
        <section className="mb-10">
          <SectionHeader icon={Mic2} title="Featured Artists" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
