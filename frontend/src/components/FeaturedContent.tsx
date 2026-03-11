'use client';

import React from 'react';
import { Play, Music, Disc3, ListMusic, Mic2 } from 'lucide-react';
import Image from 'next/image';
import { Track } from '@/lib/types';
import { newSongs, newAlbums, featuredPlaylists, featuredArtists } from '@/lib/mockData';
import SectionHeader from '@/components/SectionHeader';
import SongCard from '@/components/SongCard';
import AlbumCard from '@/components/AlbumCard';
import PlaylistCard from '@/components/PlaylistCard';
import ArtistCard from '@/components/ArtistCard';
import AccountMenu from '@/components/AccountMenu';

interface FeaturedContentProps {
  onPlayTrack: (track: Track) => void;
}

export default function FeaturedContent({ onPlayTrack }: FeaturedContentProps) {
  return (
    <main className="flex-1 overflow-y-auto pb-28 px-6 py-6 lg:px-8">
      {/* Top bar with greeting and account */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Good evening</h1>
          <p className="text-zinc-400 mt-1">Discover something new today.</p>
        </div>
        <AccountMenu />
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {newSongs.slice(0, 6).map((track) => (
          <button
            key={track.id}
            onClick={() => onPlayTrack(track)}
            className="group flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-700/60 rounded-md overflow-hidden transition-colors"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={track.coverUrl}
                alt={track.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <span className="text-sm font-semibold text-white truncate pr-3">{track.title}</span>
            <div className="ml-auto mr-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex-shrink-0">
              <Play className="w-4 h-4 text-white fill-current ml-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* songs */}
      <section className="mb-10">
        <SectionHeader icon={Music} title="New Songs" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {newSongs.map((track) => (
            <SongCard key={track.id} track={track} onPlay={onPlayTrack} />
          ))}
        </div>
      </section>

      {/* New Albums */}
      <section className="mb-10">
        <SectionHeader icon={Disc3} title="New Albums" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {newAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="mb-10">
        <SectionHeader icon={ListMusic} title="Featured Playlists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {featuredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="mb-10">
        <SectionHeader icon={Mic2} title="Featured Artists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </main>
  );
}
