'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Album, Song } from '@/services/types';
import musicService from '@/services';
import TrackList from '@/components/ui/TrackList';
import PlayButton from '@/components/ui/PlayButton';
import { formatDuration } from '@/lib/utils';

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    musicService.getAlbumById(id).then(a => setAlbum(a ?? null));
    musicService.getSongsByAlbum(id).then(setSongs);
  }, [id]);

  if (!album) {
    return <div className="text-muted">Loading...</div>;
  }

  const totalDuration = songs.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 shrink-0 relative rounded-md overflow-hidden shadow-2xl">
          <Image src={album.coverUrl} alt={album.title} fill className="object-cover" sizes="192px" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase">Album</p>
          <h1 className="text-5xl font-bold mt-2 mb-4">{album.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href={`/artist/${album.artistId}`} className="font-semibold text-white hover:underline">
              {album.artistName}
            </Link>
            <span>&middot;</span>
            <span>{album.year}</span>
            <span>&middot;</span>
            <span>{songs.length} songs, {formatDuration(totalDuration)}</span>
          </div>
        </div>
      </div>

      {/* Play button */}
      <div className="flex items-center gap-4">
        <PlayButton songs={songs} size="lg" />
      </div>

      {/* Track list */}
      <TrackList songs={songs} />
    </div>
  );
}
