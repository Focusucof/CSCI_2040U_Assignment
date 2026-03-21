export interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  coverUrl: string;
  audioUrl?: string;
  duration: string;
  genres: string[];
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

