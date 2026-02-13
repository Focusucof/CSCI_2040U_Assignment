'use client';

import { useEffect, useState } from 'react';
import { Album, Genre } from '@/services/types';
import musicService from '@/services';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function HomePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    musicService.getFeaturedAlbums().then(setAlbums);
    musicService.getGenres().then(setGenres);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Good {getTimeOfDay()}</h1>

      {/* Quick genre links */}
      <section>
        <h2 className="text-xl font-bold mb-4">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {genres.map(genre => (
            <Link
              key={genre.id}
              href={`/browse?genre=${encodeURIComponent(genre.name)}`}
              className="relative h-20 rounded-lg overflow-hidden group"
              style={{ backgroundColor: genre.color }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Albums */}
      <section>
        <h2 className="text-xl font-bold mb-4">Featured Albums</h2>
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
      </section>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
