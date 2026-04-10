'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Trash2, Heart, Clock, Music, X, Search } from 'lucide-react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import { Track } from '@/lib/types';
import { useUser } from '@/context/UserContext';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/components/ToastProvider';
import SongContextMenu from '@/components/SongContextMenu';

const SONGS_API = 'http://localhost:8080/admin/songs';
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

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  const { playlists, deletePlaylist, removeSongFromPlaylist, likedSongs, toggleLike } = useUser();
  const { onTrackSelect, setQueue } = useAudio();
  const { addToast } = useToast();
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  const playlist = playlists.find((p) => p.id === playlistId);

  useEffect(() => {
    fetch(SONGS_API)
      .then((res) => res.json())
      .then((data) => setAllSongs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const playlistTracks = playlist
    ? allSongs.filter((song) => playlist.songIds.includes(song.id)).map(normalizeTrackUrl)
    : [];

  const filteredTracks = playlistTracks.filter((track) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(query) ||
      track.artists?.some((a) => a.toLowerCase().includes(query)) ||
      track.album.toLowerCase().includes(query)
    );
  });

  const handleDelete = async () => {
    if (!playlist) return;
    await deletePlaylist(playlist.id);
    addToast(`Playlist "${playlist.name}" deleted`, 'success');
    router.push('/library');
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;
    await removeSongFromPlaylist(playlist.id, songId);
    addToast('Song removed from playlist', 'success');
  };

  if (!playlist && !loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-black">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500">Playlist not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-28">
        <div className="p-8">
          {/* Playlist Header */}
          {playlist && (
            <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-white/5 rounded-none p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-none flex items-center justify-center shadow-lg">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{playlist.name}</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                      {playlist.songIds.length} song{playlist.songIds.length !== 1 ? 's' : ''}
                      {' \u00B7 '}Created {new Date(playlist.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-none transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Playlist
                </button>
              </div>
            </div>
          )}

          {/* Search within playlist */}
          {playlistTracks.length > 0 && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search in playlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E1E1E] text-white placeholder-zinc-400 pl-10 pr-4 py-2 rounded-none text-sm focus:outline-none border border-transparent focus:border-white/20 transition-all"
              />
            </div>
          )}

          {/* Song List */}
          {loading ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : playlistTracks.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              No songs in this playlist yet. Use the + button on any song card to add songs.
            </p>
          ) : filteredTracks.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4">No songs match &quot;{searchQuery}&quot;</p>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-[auto_1fr_1fr_80px_40px_40px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-white/5">
                <span className="w-10">#</span>
                <span>Title</span>
                <span>Album</span>
                <span className="flex items-center justify-end"><Clock className="w-3 h-3" /></span>
                <span></span>
                <span></span>
              </div>
              {filteredTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="grid grid-cols-[auto_1fr_1fr_80px_40px_40px] gap-4 px-4 py-2 items-center hover:bg-white/5 rounded-none transition-colors group cursor-pointer"
                  onClick={() => { setQueue(filteredTracks); onTrackSelect(track); }}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSong(track.id);
                    }}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
