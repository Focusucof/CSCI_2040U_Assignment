'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Genre, Album, Song } from '@/services/types';
import musicService from '@/services';
import Card from '@/components/ui/Card';
import TrackList from '@/components/ui/TrackList';
import Link from 'next/link';

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get('genre');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    musicService.getGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      musicService.getAlbumsByGenre(selectedGenre).then(setAlbums);
      musicService.getSongsByGenre(selectedGenre).then(setSongs);
    } else {
      setAlbums([]);
      setSongs([]);
    }
  }, [selectedGenre]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Browse</h1>

      {/* Genre grid */}
      <section>
        <h2 className="text-xl font-bold mb-4">Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {genres.map(genre => (
            <Link
              key={genre.id}
              href={`/browse?genre=${encodeURIComponent(genre.name)}`}
              className="relative h-24 rounded-lg overflow-hidden transition-transform hover:scale-105"
              style={{
                backgroundColor: genre.color,
                opacity: selectedGenre && selectedGenre !== genre.name ? 0.5 : 1,
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Filtered content */}
      {selectedGenre && (
        <>
          <section>
            <h2 className="text-xl font-bold mb-4">{selectedGenre} Albums</h2>
            {albums.length === 0 ? (
              <p className="text-muted text-sm">No albums found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {albums.map(album => (
                  <Card
                    key={album.id}
                    href={`/album/${album.id}`}
                    imageUrl={album.coverUrl}
                    title={album.title}
                    subtitle={album.artistName}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{selectedGenre} Songs</h2>
            <TrackList songs={songs} showAlbum showCover />
          </section>
        </>
      )}
    </div>
  );
}
