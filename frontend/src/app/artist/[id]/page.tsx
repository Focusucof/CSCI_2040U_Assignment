'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Heart, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import { Track, Artist } from '@/lib/types';
import { useUser } from '@/context/UserContext';
import { useAudio } from '@/context/AudioContext';
import SongContextMenu from '@/components/SongContextMenu';

const SONGS_API = 'http://localhost:8080/admin/songs';
const ARTISTS_API = 'http://localhost:8080/admin/artists';
const BACKEND_URL = 'http://localhost:8080';

function normalizeImageUrl(url: string): string {
  if (url && !url.startsWith('http')) {
    const prefix = url.startsWith('/') ? '' : '/';
    return BACKEND_URL + prefix + url;
  }
  return url;
}

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

export default function ArtistPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;
  const { likedSongs, toggleLike } = useUser();
  const { onTrackSelect, setQueue } = useAudio();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(ARTISTS_API).then(res => res.json()),
      fetch(SONGS_API).then(res => res.json())
    ])
      .then(([artistsData, songsData]) => {
        const foundArtist = artistsData.find((a: Artist) => a.id === artistId);
        setArtist(foundArtist || null);
        setAllSongs(songsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [artistId]);

  const artistTracks = allSongs.filter((track) => track.artists?.includes(artist?.name || '')).map(normalizeTrackUrl);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-black">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500">Loading...</p>
        </main>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex h-screen overflow-hidden bg-black">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500">Artist not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-28">
        <div className="p-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500/30">
              <Image
                src={normalizeImageUrl(artist.imageUrl)}
                alt={artist.name}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
            <div>
              <p className="text-sm text-zinc-400 uppercase tracking-wider mb-1">Artist</p>
              <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
              <p className="text-zinc-300">{artist.genre}</p>
              <p className="text-zinc-500 text-sm mt-1">
                {artistTracks.length} song{artistTracks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => { if (artistTracks.length > 0) { setQueue(artistTracks); onTrackSelect(artistTracks[0]); } }}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Play className="w-6 h-6 text-white fill-current ml-1" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-[auto_1fr_1fr_80px_40px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-white/5">
              <span className="w-10">#</span>
              <span>Title</span>
              <span>Album</span>
              <span className="flex items-center justify-end"><Clock className="w-3 h-3" /></span>
              <span></span>
            </div>
            {artistTracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[auto_1fr_1fr_80px_40px] gap-4 px-4 py-2 items-center hover:bg-white/5 rounded-none transition-colors group cursor-pointer"
                onClick={() => { setQueue(artistTracks); onTrackSelect(track); }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, track });
                }}
              >
                <span className="w-10 text-sm text-zinc-500 group-hover:hidden">{index + 1}</span>
                <span className="w-10 hidden group-hover:block">
                  <Play className="w-4 h-4 text-white" />
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-none overflow-hidden flex-shrink-0">
                    <Image src={normalizeImageUrl(track.coverUrl)} alt={track.title} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{track.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{track.artists?.join(', ')}</p>
                  </div>
                </div>
                <span className="text-sm text-zinc-400 truncate">{track.album}</span>
                <span className="text-sm text-zinc-400 text-right">{track.duration}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(track.id);
                  }}
                  className={`transition-colors ${likedSongs.has(track.id) ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500'}`}
                >
                  <Heart className={`w-4 h-4 ${likedSongs.has(track.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>

          {artistTracks.length === 0 && (
            <p className="text-zinc-500 text-sm mt-4">No songs found for this artist.</p>
          )}
        </div>
      </main>

      {contextMenu && (
        <SongContextMenu
          track={contextMenu.track}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}