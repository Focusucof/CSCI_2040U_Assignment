'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Artist, Song, Album } from '@/services/types';
import musicService from '@/services';
import TrackList from '@/components/ui/TrackList';
import Card from '@/components/ui/Card';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    musicService.getArtistById(id).then(a => {
      if (a) {
        setArtist(a);
        musicService.getSongsByIds(a.topSongIds).then(setTopSongs);
      }
    });
    musicService.getAlbumsByArtist(id).then(setAlbums);
  }, [id]);

  if (!artist) {
    return <div className="text-muted">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 shrink-0 relative rounded-full overflow-hidden shadow-2xl">
          <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" sizes="192px" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase">Artist</p>
          <h1 className="text-5xl font-bold mt-2 mb-2">{artist.name}</h1>
          <p className="text-sm text-muted">{artist.genres.join(', ')}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted max-w-2xl leading-relaxed">{artist.bio}</p>

      {/* Top Songs */}
      <section>
        <h2 className="text-xl font-bold mb-4">Popular</h2>
        <TrackList songs={topSongs} showCover />
      </section>

      {/* Discography */}
      <section>
        <h2 className="text-xl font-bold mb-4">Discography</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albums.map(album => (
            <Card
              key={album.id}
              href={`/album/${album.id}`}
              imageUrl={album.coverUrl}
              title={album.title}
              subtitle={`${album.year} · ${album.genre}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
