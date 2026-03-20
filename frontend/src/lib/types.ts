export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl?: string;
  duration: string;
  genre: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  trackCount: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  trackCount: number;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
}

export interface Recommendation {
  reason: string;
  tracks: Track[];
}
