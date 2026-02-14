import artistsJson from "./artists.json";
import albumsJson from "./albums.json";
import songsJson from "./songs.json";
import playlistsJson from "./playlists.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Artist {
  id: string;
  name: string;
  image: string;
  monthlyListeners: string;
  bio: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  cover: string;
  year: number;
  genre: string;
  songs: Song[];
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album | null;
  duration: string;
  cover: string;
  liked: boolean;
  audioSrc: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
  createdBy: string;
}

// ---------------------------------------------------------------------------
// Build runtime objects from JSON  (songs are the primary entity)
// ---------------------------------------------------------------------------

// 1. Artists
export const artists: Artist[] = artistsJson as Artist[];
const artistMap = new Map<string, Artist>();
for (const a of artists) artistMap.set(a.id, a);

// 2. Albums (empty song lists for now — filled after songs are built)
const albumMap = new Map<string, Album>();
export const albums: Album[] = albumsJson.map((raw) => {
  const album: Album = {
    id: raw.id,
    title: raw.title,
    artist: artistMap.get(raw.artistId)!,
    cover: raw.cover,
    year: raw.year,
    genre: raw.genre,
    songs: [],
  };
  albumMap.set(album.id, album);
  return album;
});

// 3. Songs — the primary entity
export const allSongs: Song[] = songsJson.map((raw) => {
  const artist = artistMap.get(raw.artistId)!;
  const album = raw.albumId ? albumMap.get(raw.albumId) ?? null : null;

  const song: Song = {
    id: raw.id,
    title: raw.title,
    artist,
    album,
    duration: raw.duration,
    cover: raw.cover,
    liked: raw.liked ?? false,
    audioSrc: raw.audioSrc,
  };

  // If this song belongs to an album, push it into that album's songs list
  if (album) album.songs.push(song);

  return song;
});

const songMap = new Map<string, Song>();
for (const s of allSongs) songMap.set(s.id, s);

// 4. Playlists
export const playlists: Playlist[] = playlistsJson.map((raw) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  cover: raw.cover,
  createdBy: raw.createdBy,
  songs: raw.songIds.map((sid) => songMap.get(sid)!).filter(Boolean),
}));

// 5. Derived lists
export const likedSongs: Song[] = allSongs.filter((s) => s.liked);

// ---------------------------------------------------------------------------
// Curated lists (edit these to change the home page)
// ---------------------------------------------------------------------------

export const recentlyPlayed: Album[] = [albums[0], albums[2], albums[4], albums[5], albums[3], albums[7]];
export const featuredAlbums: Album[] = [albums[2], albums[0], albums[5], albums[7]];
export const newReleases: Album[] = albums.filter((a) => a.year === 2024);

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getAlbumById(id: string): Album | undefined {
  return albumMap.get(id);
}

export function getArtistById(id: string): Artist | undefined {
  return artistMap.get(id);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}

export function getAlbumsByArtist(artistId: string): Album[] {
  return albums.filter((a) => a.artist.id === artistId);
}

export function getSongsByArtist(artistId: string): Song[] {
  return allSongs.filter((s) => s.artist.id === artistId);
}
