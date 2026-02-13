export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumName: string;
  duration: number; // seconds
  trackNumber: number;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  year: number;
  genre: string;
  songIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  genres: string[];
  albumIds: string[];
  topSongIds: string[];
}

export interface Genre {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songIds: string[];
  createdAt: string;
}

export interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
}
