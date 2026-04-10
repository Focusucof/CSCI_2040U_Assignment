'use client';

import { useState, useEffect } from 'react';
import { X, Music, Disc3, Mic2, Play, Calendar, Tag, Clock, Hash } from 'lucide-react';
import Image from 'next/image';

interface SongInfo {
  id: string;
  title: string;
  artists: string[];
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: string;
  genres: string[];
  releaseDate: string;
  explicit: boolean;
  playCount: number;
}

interface SongInfoModalProps {
  trackId: string;
  onClose: () => void;
}

export default function SongInfoModal({ trackId, onClose }: SongInfoModalProps) {
  const [song, setSong] = useState<SongInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/songs/${trackId}`);
        if (!res.ok) throw new Error('Failed to fetch song info');
        const data = await res.json();
        setSong(data);
      } catch (err) {
        setError('Failed to load song info');
      } finally {
        setLoading(false);
      }
    };
    fetchSongInfo();
  }, [trackId]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" onClick={onClose}>
      <div
        className="bg-[#1E1E1E] border border-white/10 rounded-none p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Song Info</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center py-8">{error}</p>
        ) : song ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              {song.coverUrl && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={song.coverUrl.startsWith('http') ? song.coverUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${song.coverUrl}`}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{song.title}</h3>
                <p className="text-zinc-400 truncate">{song.artists?.join(', ')}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <InfoRow icon={<Hash className="w-4 h-4" />} label="ID" value={song.id} />
              <InfoRow icon={<Disc3 className="w-4 h-4" />} label="Album" value={song.album || 'Unknown'} />
              <InfoRow icon={<Mic2 className="w-4 h-4" />} label="Artists" value={song.artists?.join(', ') || 'Unknown'} />
              <InfoRow icon={<Tag className="w-4 h-4" />} label="Genres" value={song.genres?.join(', ') || 'None'} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Release Date" value={song.releaseDate || 'Unknown'} />
              <InfoRow icon={<Clock className="w-4 h-4" />} label="Duration" value={song.duration || 'Unknown'} />
              <InfoRow icon={<Play className="w-4 h-4" />} label="Play Count" value={song.playCount?.toString() || '0'} />
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">Explicit:</span>
                <span className={`text-sm ${song.explicit ? 'text-green-400' : 'text-zinc-500'}`}>
                  {song.explicit ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-none transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-500">{icon}</span>
      <span className="text-sm text-zinc-400">{label}:</span>
      <span className="text-sm text-white truncate">{value}</span>
    </div>
  );
}