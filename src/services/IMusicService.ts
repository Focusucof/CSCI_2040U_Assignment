import { Song, Album, Artist, Genre, SearchResults } from './types';

export interface IMusicService {
  // Songs
  getSongs(): Promise<Song[]>;
  getSongById(id: string): Promise<Song | undefined>;
  getSongsByAlbum(albumId: string): Promise<Song[]>;
  getSongsByArtist(artistId: string): Promise<Song[]>;
  getSongsByGenre(genre: string): Promise<Song[]>;
  getSongsByIds(ids: string[]): Promise<Song[]>;

  // Albums
  getAlbums(): Promise<Album[]>;
  getAlbumById(id: string): Promise<Album | undefined>;
  getAlbumsByArtist(artistId: string): Promise<Album[]>;
  getAlbumsByGenre(genre: string): Promise<Album[]>;
  getFeaturedAlbums(): Promise<Album[]>;

  // Artists
  getArtists(): Promise<Artist[]>;
  getArtistById(id: string): Promise<Artist | undefined>;

  // Genres
  getGenres(): Promise<Genre[]>;

  // Search
  search(query: string): Promise<SearchResults>;
}
