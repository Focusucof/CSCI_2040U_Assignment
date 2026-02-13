'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResults } from '@/services/types';
import musicService from '@/services';
import { useDebounce } from '@/hooks/useDebounce';
import Card from '@/components/ui/Card';
import TrackList from '@/components/ui/TrackList';

type Tab = 'all' | 'songs' | 'albums' | 'artists';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResults>({ songs: [], albums: [], artists: [] });
  const [tab, setTab] = useState<Tab>('all');

  useEffect(() => {
    if (debouncedQuery.trim()) {
      musicService.search(debouncedQuery).then(setResults);
    } else {
      setResults({ songs: [], albums: [], artists: [] });
    }
  }, [debouncedQuery]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'songs', label: 'Songs' },
    { key: 'albums', label: 'Albums' },
    { key: 'artists', label: 'Artists' },
  ];

  const hasResults = results.songs.length > 0 || results.albums.length > 0 || results.artists.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>

      {query && (
        <p className="text-muted text-sm">Results for &ldquo;{query}&rdquo;</p>
      )}

      {/* Tabs */}
      {hasResults && (
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                tab === t.key
                  ? 'bg-white text-black'
                  : 'bg-surface-light text-white hover:bg-surface-hover'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {!query && (
        <p className="text-muted text-sm">Type in the search bar above to find songs, albums, and artists.</p>
      )}

      {query && !hasResults && (
        <p className="text-muted text-sm">No results found for &ldquo;{query}&rdquo;</p>
      )}

      {/* Songs */}
      {(tab === 'all' || tab === 'songs') && results.songs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Songs</h2>
          <TrackList songs={tab === 'all' ? results.songs.slice(0, 5) : results.songs} showAlbum showCover />
        </section>
      )}

      {/* Albums */}
      {(tab === 'all' || tab === 'albums') && results.albums.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.albums.map(album => (
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
      )}

      {/* Artists */}
      {(tab === 'all' || tab === 'artists') && results.artists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.artists.map(artist => (
              <Card
                key={artist.id}
                href={`/artist/${artist.id}`}
                imageUrl={artist.imageUrl}
                title={artist.name}
                subtitle={artist.genres.join(', ')}
                rounded
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
