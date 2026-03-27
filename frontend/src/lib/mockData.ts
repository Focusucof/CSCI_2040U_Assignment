import { Album, Playlist, Artist } from '@/lib/types';

export const newAlbums: Album[] = [
  {
    id: '1',
    title: 'After Hours',
    artist: 'The Weeknd',
    coverUrl: 'https://picsum.photos/seed/album1/300/300',
    year: 2024,
    trackCount: 14,
  },
  {
    id: '2',
    title: 'Future Nostalgia',
    artist: 'Dua Lipa',
    coverUrl: 'https://picsum.photos/seed/album2/300/300',
    year: 2024,
    trackCount: 11,
  },
  {
    id: '3',
    title: 'Dreamland',
    artist: 'Glass Animals',
    coverUrl: 'https://picsum.photos/seed/album3/300/300',
    year: 2024,
    trackCount: 16,
  },
  {
    id: '4',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    coverUrl: 'https://picsum.photos/seed/album4/300/300',
    year: 2024,
    trackCount: 13,
  },
  {
    id: '5',
    title: 'IGOR',
    artist: 'Tyler, The Creator',
    coverUrl: 'https://picsum.photos/seed/album5/300/300',
    year: 2024,
    trackCount: 12,
  },
  {
    id: '6',
    title: 'In Rainbows',
    artist: 'Radiohead',
    coverUrl: 'https://picsum.photos/seed/album6/300/300',
    year: 2024,
    trackCount: 10,
  },
];

export const featuredPlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Chill Vibes',
    description: 'Relax and unwind with these smooth tracks',
    coverUrl: 'https://picsum.photos/seed/playlist1/300/300',
    trackCount: 50,
  },
  {
    id: '2',
    title: 'Workout Pump',
    description: 'High energy beats to fuel your workout',
    coverUrl: 'https://picsum.photos/seed/playlist2/300/300',
    trackCount: 35,
  },
  {
    id: '3',
    title: 'Late Night Jazz',
    description: 'Smooth jazz for those quiet evenings',
    coverUrl: 'https://picsum.photos/seed/playlist3/300/300',
    trackCount: 40,
  },
  {
    id: '4',
    title: 'Indie Discoveries',
    description: 'Fresh indie tracks you haven\'t heard yet',
    coverUrl: 'https://picsum.photos/seed/playlist4/300/300',
    trackCount: 28,
  },
  {
    id: '5',
    title: 'Road Trip Anthems',
    description: 'Songs that make every drive better',
    coverUrl: 'https://picsum.photos/seed/playlist5/300/300',
    trackCount: 45,
  },
  {
    id: '6',
    title: 'Focus Flow',
    description: 'Ambient music for deep concentration',
    coverUrl: 'https://picsum.photos/seed/playlist6/300/300',
    trackCount: 60,
  },
];

export const featuredArtists: Artist[] = [
  {
    id: '1',
    name: 'The Weeknd',
    imageUrl: 'https://picsum.photos/seed/artist1/300/300',
    genre: 'R&B / Pop',
  },
  {
    id: '2',
    name: 'Dua Lipa',
    imageUrl: 'https://picsum.photos/seed/artist2/300/300',
    genre: 'Pop',
  },
  {
    id: '3',
    name: 'Kendrick Lamar',
    imageUrl: 'https://picsum.photos/seed/artist3/300/300',
    genre: 'Hip-Hop',
  },
  {
    id: '4',
    name: 'Tame Impala',
    imageUrl: 'https://picsum.photos/seed/artist4/300/300',
    genre: 'Psychedelic Rock',
  },
  {
    id: '5',
    name: 'Billie Eilish',
    imageUrl: 'https://picsum.photos/seed/artist5/300/300',
    genre: 'Alt-Pop',
  },
  {
    id: '6',
    name: 'Frank Ocean',
    imageUrl: 'https://picsum.photos/seed/artist6/300/300',
    genre: 'R&B',
  },
];
