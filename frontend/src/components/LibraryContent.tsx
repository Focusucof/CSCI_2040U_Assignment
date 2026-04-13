'use client';

import { useState, useEffect } from 'react';
import { Heart, Play, Music, Clock } from 'lucide-react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Track } from '@/lib/types';
import { useUser } from '@/context/UserContext';
import { useAudio } from '@/context/AudioContext';
import SongContextMenu from '@/components/SongContextMenu';
import PlaylistContextMenu from '@/components/PlaylistContextMenu';
import CoverImage from '@/components/CoverImage';
import { UserPlaylist } from '@/lib/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const SONGS_API = `${BACKEND_URL}/admin/songs`;

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

export default function LibraryContent() {
  const { likedSongs, playlists, toggleLike } = useUser();
  const { onTrackSelect, setQueue } = useAudio();
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);
  const [playlistContextMenu, setPlaylistContextMenu] = useState<{ x: number; y: number; playlist: UserPlaylist } | null>(null);

  useEffect(() => {
    fetch(SONGS_API)
      .then((res) => res.json())
      .then((data) => setAllSongs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const likedTracks = allSongs.filter((song) => likedSongs.has(song.id)).map(normalizeTrackUrl);

  return (
    <main className="flex-1 overflow-y-auto pb-28">
      <div className="p-8">
        {/* Liked Songs Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-white/5 rounded-none p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-none flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Liked Songs</h1>
                <p className="text-zinc-400 text-sm mt-1">{likedTracks.length} song{likedTracks.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : likedTracks.length === 0 ? (
            <p className="text-zinc-500 text-sm">No liked songs yet. Click the heart on any song to add it here.</p>
          ) : (
            <div className="space-y-1">
              {/* Header row */}
              <div className="grid grid-cols-[auto_1fr_1fr_80px_40px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-white/5">
                <span className="w-10">#</span>
                <span>Title</span>
                <span>Album</span>
                <span className="flex items-center justify-end"><Clock className="w-3 h-3" /></span>
                <span></span>
              </div>
              {likedTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="grid grid-cols-[auto_1fr_1fr_80px_40px] gap-4 px-4 py-2 items-center hover:bg-white/5 rounded-none transition-colors group cursor-pointer"
                  onClick={() => { setQueue(likedTracks); onTrackSelect(track); }}
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
                      <CoverImage src={track.coverUrl} alt={track.title} />
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
                    className="text-rose-500 hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Playlists Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
          {playlists.length === 0 ? (
            <p className="text-zinc-500 text-sm">No playlists yet. Create one from the sidebar.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setPlaylistContextMenu({ x: e.clientX, y: e.clientY, playlist });
                  }}
                >
                  <Link
                    href={`/playlist/${playlist.id}`}
                    className="bg-[#181818] hover:bg-[#252525] rounded-none p-4 transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div className="w-full aspect-square bg-gradient-to-br from-purple-900/60 to-cyan-900/60 rounded-none flex items-center justify-center mb-4">
                      <Music className="w-12 h-12 text-zinc-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{playlist.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {playlist.songIds.length} song{playlist.songIds.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {new Date(playlist.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <SongContextMenu
          track={contextMenu.track}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
      {playlistContextMenu && (
        <PlaylistContextMenu
          playlist={playlistContextMenu.playlist}
          x={playlistContextMenu.x}
          y={playlistContextMenu.y}
          onClose={() => setPlaylistContextMenu(null)}
        />
      )}
    </main>
  );
}
