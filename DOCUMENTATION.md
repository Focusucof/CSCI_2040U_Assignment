# Music Library Catalogue App

A Spotify-inspired music library catalogue built with Next.js, TypeScript, and Tailwind CSS for CSCI 2040U.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [File Reference](#file-reference)
  - [Pages](#pages)
  - [Components](#components)
  - [Context (State Management)](#context-state-management)
  - [Services](#services)
  - [Data](#data)
  - [Hooks & Utilities](#hooks--utilities)
- [Connecting Your Own Backend](#connecting-your-own-backend)
- [Architecture Decisions](#architecture-decisions)

---

## Features

- **Home Page** — Featured albums grid and genre quick-links with a time-of-day greeting
- **Browse** — Genre cards that filter albums and songs by genre
- **Search** — Debounced search across songs, albums, and artists with tabbed results (All / Songs / Albums / Artists)
- **Album Detail** — Album artwork, metadata, and a full tracklist with play-all button
- **Artist Detail** — Artist image, bio, top songs, and discography
- **Audio Playback** — Full playback controls: play/pause, next/previous, seek, volume, shuffle, and repeat (off / all / one)
- **Now Playing Bar** — Persistent bottom bar showing current track info, playback controls, progress bar, and volume slider
- **Favorites** — Heart-toggle on any track; liked songs appear on the Favorites page and persist across sessions via localStorage
- **Playlists** — Create, view, and delete playlists; add or remove songs from playlists; persisted to localStorage
- **Responsive Layout** — Sidebar collapses on mobile; search bar in the header; navigation arrows for browser history
- **Dark Theme** — Spotify-inspired dark UI with `#121212` background and `#1DB954` green accent

---

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 16 (App Router)             |
| Language         | TypeScript                          |
| Styling          | Tailwind CSS 4 (dark custom theme)  |
| State Management | React Context (Player + Library)    |
| Persistence      | localStorage (playlists, favorites) |
| Audio            | HTML5 `<audio>` via React refs      |
| Images           | `next/image` with picsum.photos     |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start
```

The app runs at `http://localhost:3000` by default.

---

## Project Structure

```
src/
├── app/                          # Pages (Next.js App Router)
│   ├── layout.tsx                # Root layout: Sidebar + Header + NowPlayingBar shell
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles and Tailwind theme
│   ├── search/page.tsx           # Search results page
│   ├── browse/page.tsx           # Genre browsing page
│   ├── album/[id]/page.tsx       # Album detail page
│   ├── artist/[id]/page.tsx      # Artist detail page
│   ├── playlist/[id]/page.tsx    # Single playlist page
│   ├── playlists/page.tsx        # All playlists page
│   └── favorites/page.tsx        # Liked songs page
├── components/
│   ├── layout/                   # Sidebar, Header, NowPlayingBar
│   ├── ui/                       # Card, TrackRow, TrackList, PlayButton
│   └── playlist/                 # PlaylistCard, CreatePlaylistModal, AddToPlaylistMenu
├── context/                      # React Context providers
│   ├── PlayerContext.tsx          # Audio playback state
│   ├── LibraryContext.tsx         # Playlists and favorites state
│   └── Providers.tsx             # Wraps both contexts
├── services/                     # Data access layer (swappable)
│   ├── types.ts                  # TypeScript interfaces
│   ├── IMusicService.ts          # Service interface (contract)
│   ├── MockMusicService.ts       # Mock implementation using local JSON
│   └── index.ts                  # Factory export (change one line to swap backends)
├── data/                         # Mock JSON data files
│   ├── songs.json                # 24 songs
│   ├── albums.json               # 6 albums
│   ├── artists.json              # 5 artists
│   └── genres.json               # 6 genres
├── hooks/
│   └── useDebounce.ts            # Debounce hook for search input
└── lib/
    └── utils.ts                  # formatDuration, cn (class name helper)
```

---

## File Reference

### Pages

| File | Route | Description |
| ---- | ----- | ----------- |
| `app/layout.tsx` | — | Root layout. Renders the Sidebar, Header, NowPlayingBar, and wraps everything in context Providers. All pages are rendered inside this shell. |
| `app/page.tsx` | `/` | Home page. Displays a time-based greeting, genre quick-links, and a grid of featured albums. |
| `app/search/page.tsx` | `/search?q=...` | Search page. Reads the `q` query parameter, debounces the input, queries the music service, and displays tabbed results for songs, albums, and artists. |
| `app/browse/page.tsx` | `/browse?genre=...` | Browse page. Shows a genre grid. When a genre is selected, displays filtered albums and songs for that genre. |
| `app/album/[id]/page.tsx` | `/album/:id` | Album detail page. Shows album cover, title, artist, year, total duration, a play button, and the full tracklist. |
| `app/artist/[id]/page.tsx` | `/artist/:id` | Artist detail page. Shows artist image, name, genres, bio, top songs, and discography (albums grid). |
| `app/favorites/page.tsx` | `/favorites` | Favorites page. Displays all songs the user has liked, with a play-all button. Reacts live to changes in the favorites set. |
| `app/playlists/page.tsx` | `/playlists` | Playlists index page. Lists all user-created playlists as cards with a "Create Playlist" button that opens a modal. |
| `app/playlist/[id]/page.tsx` | `/playlist/:id` | Single playlist page. Shows playlist name, description, song count, a play button, a delete button, and the tracklist with per-track remove option. |

### Components

| File | Description |
| ---- | ----------- |
| `components/layout/Sidebar.tsx` | Left sidebar with navigation links (Home, Search, Browse), library links (Liked Songs, Playlists), and a dynamic list of user-created playlists. Highlights the active route. Hidden on mobile. |
| `components/layout/Header.tsx` | Top header bar with back/forward navigation buttons and a search input. Submitting the search navigates to `/search?q=...`. |
| `components/layout/NowPlayingBar.tsx` | Bottom bar shown when a song is playing. Displays song info with album art, playback controls (shuffle, prev, play/pause, next, repeat), a seekable progress bar, a favorite toggle, and a volume slider. |
| `components/ui/Card.tsx` | Reusable card component used for albums and artists. Shows an image, title, subtitle, and a play-button overlay on hover. Accepts a `rounded` prop for circular artist images. |
| `components/ui/TrackRow.tsx` | A single track row. Shows track number (or play icon on hover), optional cover art, song title, artist link, optional album link, a favorite heart, an "add to playlist" menu, and duration. Double-click or click the play icon to play. |
| `components/ui/TrackList.tsx` | Renders a list of TrackRow components with a column header row. Accepts `showAlbum` and `showCover` flags to toggle columns. Passes the full song array as the playback queue. |
| `components/ui/PlayButton.tsx` | Green circular play button in sm/md/lg sizes. Plays the first song in the provided array and sets the rest as the queue. |
| `components/playlist/CreatePlaylistModal.tsx` | Modal dialog for creating a new playlist. Includes name and optional description fields. |
| `components/playlist/AddToPlaylistMenu.tsx` | Dropdown menu that appears on the three-dot button in TrackRow. Lists all user playlists to add the song to, and optionally shows a "Remove from playlist" action. |
| `components/playlist/PlaylistCard.tsx` | Card component for displaying a playlist in the playlists grid. Shows a music icon, playlist name, and song count. |

### Context (State Management)

| File | Description |
| ---- | ----------- |
| `context/PlayerContext.tsx` | Manages all audio playback state: `currentSong`, `queue`, `queueIndex`, `isPlaying`, `progress`, `duration`, `volume`, `shuffle`, and `repeat`. Creates and controls a hidden HTML `<audio>` element via a ref. Exposes actions: `playSong`, `togglePlay`, `nextTrack`, `prevTrack`, `seek`, `setVolume`, `toggleShuffle`, `toggleRepeat`. |
| `context/LibraryContext.tsx` | Manages user library state: `playlists` array and `favoriteIds` set. Loads from localStorage on mount and persists on every change. Exposes actions: `toggleFavorite`, `isFavorite`, `createPlaylist`, `deletePlaylist`, `addToPlaylist`, `removeFromPlaylist`, `getPlaylist`. |
| `context/Providers.tsx` | Convenience wrapper that nests `LibraryProvider` and `PlayerProvider`. Used in the root layout to provide both contexts to the entire app. |

### Services

| File | Description |
| ---- | ----------- |
| `services/types.ts` | TypeScript interfaces for all data models: `Song`, `Album`, `Artist`, `Genre`, `Playlist`, and `SearchResults`. |
| `services/IMusicService.ts` | The service interface. Defines all data-access methods with `Promise` return types. Any backend implementation must satisfy this contract. See [Connecting Your Own Backend](#connecting-your-own-backend) for details. |
| `services/MockMusicService.ts` | Implements `IMusicService` using the local JSON files in `src/data/`. All methods are async to match the interface, making the swap to a real API seamless. |
| `services/index.ts` | Factory file that exports a single `musicService` instance. Currently instantiates `MockMusicService`. **Change one line here to swap to a different backend.** |

### Data

| File | Description |
| ---- | ----------- |
| `data/songs.json` | 24 songs across 6 albums and 5 artists. Each song has an `id`, `title`, `artistId`, `artistName`, `albumId`, `albumName`, `duration` (seconds), `trackNumber`, `genre`, `coverUrl`, and `audioUrl`. |
| `data/albums.json` | 6 albums: Neon Horizons (Electronic), Rust & Gold (Rock), Daylight (Pop), Street Frequency (Hip-Hop), Smoky Room (Jazz), Quiet Moments (Lo-Fi). Each album references its songs by ID. |
| `data/artists.json` | 5 artists: Luna Wave, The Velvet Chains, Aria Chen, MC Flux, The Jazz Collective. Each has a bio, genre list, album IDs, and top song IDs. |
| `data/genres.json` | 6 genres (Pop, Rock, Electronic, Hip-Hop, Jazz, Lo-Fi) with a display color and image URL. |

### Hooks & Utilities

| File | Description |
| ---- | ----------- |
| `hooks/useDebounce.ts` | Generic debounce hook. Used by the search page to delay querying the service until the user stops typing (300ms). |
| `lib/utils.ts` | `formatDuration(seconds)` — converts seconds to `m:ss` format. `cn(...classes)` — joins CSS class names, filtering out falsy values. |

---

## Connecting Your Own Backend

The app is designed so that swapping from mock data to a real API requires **no changes to any component or page**. All data access goes through the `IMusicService` interface.

### Step 1: Create your implementation

Create a new file (e.g., `src/services/ApiMusicService.ts`) that implements the `IMusicService` interface:

```typescript
import { IMusicService } from './IMusicService';
import { Song, Album, Artist, Genre, SearchResults } from './types';

export class ApiMusicService implements IMusicService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getSongs(): Promise<Song[]> {
    const res = await fetch(`${this.baseUrl}/songs`);
    return res.json();
  }

  async getSongById(id: string): Promise<Song | undefined> {
    const res = await fetch(`${this.baseUrl}/songs/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  }

  async getSongsByAlbum(albumId: string): Promise<Song[]> {
    const res = await fetch(`${this.baseUrl}/albums/${albumId}/songs`);
    return res.json();
  }

  async getSongsByArtist(artistId: string): Promise<Song[]> {
    const res = await fetch(`${this.baseUrl}/artists/${artistId}/songs`);
    return res.json();
  }

  async getSongsByGenre(genre: string): Promise<Song[]> {
    const res = await fetch(`${this.baseUrl}/songs?genre=${encodeURIComponent(genre)}`);
    return res.json();
  }

  async getSongsByIds(ids: string[]): Promise<Song[]> {
    const res = await fetch(`${this.baseUrl}/songs?ids=${ids.join(',')}`);
    return res.json();
  }

  async getAlbums(): Promise<Album[]> {
    const res = await fetch(`${this.baseUrl}/albums`);
    return res.json();
  }

  async getAlbumById(id: string): Promise<Album | undefined> {
    const res = await fetch(`${this.baseUrl}/albums/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  }

  async getAlbumsByArtist(artistId: string): Promise<Album[]> {
    const res = await fetch(`${this.baseUrl}/artists/${artistId}/albums`);
    return res.json();
  }

  async getAlbumsByGenre(genre: string): Promise<Album[]> {
    const res = await fetch(`${this.baseUrl}/albums?genre=${encodeURIComponent(genre)}`);
    return res.json();
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    const res = await fetch(`${this.baseUrl}/albums/featured`);
    return res.json();
  }

  async getArtists(): Promise<Artist[]> {
    const res = await fetch(`${this.baseUrl}/artists`);
    return res.json();
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    const res = await fetch(`${this.baseUrl}/artists/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  }

  async getGenres(): Promise<Genre[]> {
    const res = await fetch(`${this.baseUrl}/genres`);
    return res.json();
  }

  async search(query: string): Promise<SearchResults> {
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
}
```

### Step 2: Swap the service in `services/index.ts`

```typescript
import { IMusicService } from './IMusicService';
import { ApiMusicService } from './ApiMusicService';

// Point to your real API
const musicService: IMusicService = new ApiMusicService('https://your-api.example.com/api');

export default musicService;
export type { IMusicService };
```

That's it. Every page and component already consumes the service through async calls and will work with the new backend as long as the API returns data matching the interfaces defined in `services/types.ts`.

### Backend data contract

Your API must return JSON objects matching these TypeScript interfaces (defined in `services/types.ts`):

- **Song** — `id`, `title`, `artistId`, `artistName`, `albumId`, `albumName`, `duration` (number, seconds), `trackNumber`, `genre`, `coverUrl`, `audioUrl`
- **Album** — `id`, `title`, `artistId`, `artistName`, `coverUrl`, `year`, `genre`, `songIds`
- **Artist** — `id`, `name`, `imageUrl`, `bio`, `genres`, `albumIds`, `topSongIds`
- **Genre** — `id`, `name`, `color` (hex string), `imageUrl`
- **SearchResults** — `{ songs: Song[], albums: Album[], artists: Artist[] }`

---

## Architecture Decisions

- **App Router (not Pages Router)** — Uses Next.js App Router with the `src/app/` directory for file-based routing and layouts.
- **Client components** — All pages use `'use client'` since they rely on React hooks for state, audio playback, and localStorage. This is appropriate for a client-heavy music player app.
- **Service interface pattern** — `IMusicService` abstracts data access so the mock implementation can be swapped for a real API without touching any UI code.
- **React Context over external state libraries** — Two focused contexts (Player and Library) keep the architecture simple and dependency-free. No Redux, Zustand, or other libraries needed.
- **localStorage for persistence** — Playlists and favorites are saved to localStorage automatically on every state change and restored on mount. This provides persistence without a backend database.
- **HTML5 Audio via refs** — The `<audio>` element is created imperatively in a `useEffect` and controlled through a ref, avoiding unnecessary re-renders from the audio element being in the DOM tree.
- **Suspense boundaries** — Pages using `useSearchParams()` (search, browse) are wrapped in `<Suspense>` as required by Next.js for static pre-rendering.
