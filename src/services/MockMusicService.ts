import { IMusicService } from './IMusicService';
import { Song, Album, Artist, Genre, SearchResults } from './types';
import songsData from '@/data/songs.json';
import albumsData from '@/data/albums.json';
import artistsData from '@/data/artists.json';
import genresData from '@/data/genres.json';

export class MockMusicService implements IMusicService {
  private songs: Song[] = songsData;
  private albums: Album[] = albumsData;
  private artists: Artist[] = artistsData;
  private genres: Genre[] = genresData;

  // Songs
  async getSongs(): Promise<Song[]> {
    return this.songs;
  }

  async getSongById(id: string): Promise<Song | undefined> {
    return this.songs.find(s => s.id === id);
  }

  async getSongsByAlbum(albumId: string): Promise<Song[]> {
    return this.songs.filter(s => s.albumId === albumId).sort((a, b) => a.trackNumber - b.trackNumber);
  }

  async getSongsByArtist(artistId: string): Promise<Song[]> {
    return this.songs.filter(s => s.artistId === artistId);
  }

  async getSongsByGenre(genre: string): Promise<Song[]> {
    return this.songs.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
  }

  async getSongsByIds(ids: string[]): Promise<Song[]> {
    return ids.map(id => this.songs.find(s => s.id === id)).filter((s): s is Song => s !== undefined);
  }

  // Albums
  async getAlbums(): Promise<Album[]> {
    return this.albums;
  }

  async getAlbumById(id: string): Promise<Album | undefined> {
    return this.albums.find(a => a.id === id);
  }

  async getAlbumsByArtist(artistId: string): Promise<Album[]> {
    return this.albums.filter(a => a.artistId === artistId);
  }

  async getAlbumsByGenre(genre: string): Promise<Album[]> {
    return this.albums.filter(a => a.genre.toLowerCase() === genre.toLowerCase());
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    return this.albums.slice(0, 6);
  }

  // Artists
  async getArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    return this.artists.find(a => a.id === id);
  }

  // Genres
  async getGenres(): Promise<Genre[]> {
    return this.genres;
  }

  // Search
  async search(query: string): Promise<SearchResults> {
    const q = query.toLowerCase();
    return {
      songs: this.songs.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artistName.toLowerCase().includes(q) ||
        s.albumName.toLowerCase().includes(q)
      ),
      albums: this.albums.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.artistName.toLowerCase().includes(q)
      ),
      artists: this.artists.filter(a =>
        a.name.toLowerCase().includes(q)
      ),
    };
  }
}
