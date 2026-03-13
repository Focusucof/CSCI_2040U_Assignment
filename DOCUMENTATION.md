# Streamly - Music Streaming Platform Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Authentication Server](#authentication-server)
7. [API Endpoints](#api-endpoints)
8. [Data Models](#data-models)
9. [Data Flow](#data-flow)
10. [Setup & Running](#setup--running)
11. [Design Decisions](#design-decisions)

---

## Project Overview

Streamly is a full-stack music streaming and discovery platform. It allows users to browse, discover, and manage music content. Administrative users can manage the music catalog through a dedicated admin panel with full CRUD (Create, Read, Update, Delete) capabilities.

The application is split into three independent services:

- **Frontend** (Next.js) - User interface and client-side logic
- **Backend** (Spring Boot) - Music catalog data management API
- **Auth Server** (Express.js) - Authentication and user management

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.4.9 | React framework with App Router |
| React | 19.2.1 | UI component library |
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Tailwind CSS | 4.1.11 | Utility-first CSS framework |
| Lucide React | 0.553.0 | Icon library |
| Framer Motion | 12.35.2 | Animation library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 4.0.3 | Java web framework |
| Java | 25 | Programming language |
| org.json | 20251224 | JSON processing |

### Authentication Server
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.17.1 | Node.js web framework |
| bcrypt | 6.0.0 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT token generation/verification |
| cookie-parser | 1.4.7 | Cookie handling |

---

## Directory Structure

```
CSCI_2040U_Assignment/
├── frontend/                       # Next.js application (Port 3000)
│   ├── src/
│   │   ├── app/                    # Pages and layouts
│   │   │   ├── page.tsx            # Home / discover page
│   │   │   ├── layout.tsx          # Root layout with metadata
│   │   │   ├── login/page.tsx      # Login page
│   │   │   ├── register/page.tsx   # Registration page
│   │   │   └── admin/page.tsx      # Admin dashboard (protected)
│   │   ├── components/             # Reusable React components
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── NowPlaying.tsx      # Music player bar
│   │   │   ├── FeaturedContent.tsx # Main content area
│   │   │   ├── AccountMenu.tsx     # User dropdown menu
│   │   │   ├── SongCard.tsx        # Song display card
│   │   │   ├── AlbumCard.tsx       # Album display card
│   │   │   ├── PlaylistCard.tsx    # Playlist display card
│   │   │   ├── ArtistCard.tsx      # Artist display card
│   │   │   ├── Toast.tsx           # Notification component
│   │   │   ├── ToastProvider.tsx   # Toast context provider
│   │   │   └── SectionHeader.tsx   # Section title component
│   │   └── lib/                    # Utilities and types
│   │       ├── types.ts            # TypeScript types
│   │       ├── mockData.ts         # Mock data for development
│   │       ├── utils.ts            # Helper functions
│   │       └── middleware.ts       # Auth middleware
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── backend/                     # Spring Boot application (Port 8080)
│   ├── src/main/java/streamly/
│   │   ├── Main.java            # Application entry point/spring run call
│   │   ├── Song.java            # Song class
│   │   ├── SongController.java  # REST API controller
│   │   ├── SongService.java     # Business logic & file I/O
│   │   ├── WebConfig.java       # CORS configuration
│   │   ├── User.java            # User class
│   │   ├── Album.java           # Album class
│   │   └── Playlist.java        # Playlist class
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── auth/                        # Express.js auth server (Port 3001)
│   ├── src/
│   │   ├── main.ts              # Server entry point
│   │   ├── routes/
│   │   │   ├── login.ts         # Login endpoint
│   │   │   ├── register.ts      # Registration endpoint
│   │   │   └── me.ts            # Current user endpoint
│   │   └── utils/
│   │       └── json.ts          # json IO helper functions
│   ├── package.json
│   └── tsconfig.json
│
└── data/                        # data storage directory
    ├── songs.json               # Song db
    └── users.json               # User db
```

---

## Frontend Architecture

### Pages

**Home Page** (`/`)
- Main user interface displayed after login
- Three-column layout: Sidebar | Featured Content | Now Playing
- Displays song cards, albums, playlists, and artists in responsive grids

**Login Page** (`/login`)
- Username and password form
- Authenticates against the auth server at port 3001
- Sets JWT token as an httpOnly cookie on success

**Register Page** (`/register`)
- New account creation form with password confirmation
- Redirects to login on successful registration

**Admin Panel** (`/admin`)
- Protected route requiring admin privileges
- Tabbed interface for managing: Songs, Albums, Playlists, Artists
- Full CRUD operations with dynamic forms
- Communicates with the Spring Boot backend at port 8080

### Components

| Component | Description |
|-----------|-------------|
| Sidebar | Navigation with links to Home, Search, Library, and playlists |
| NowPlaying | Fixed bottom bar with playback controls, track info, progress bar, and volume |
| FeaturedContent | Main content grid showing songs, albums, playlists, and artists |
| SongCard | Interactive card with cover art, title, artist, and hover play button |
| AlbumCard | Album display with cover, title, year, and track count |
| PlaylistCard | Playlist card with description and track count |
| ArtistCard | Circular artist image with name and genre |
| AccountMenu | Dropdown menu with login/logout and admin panel access |
| Toast / ToastProvider | Notification system with success, error, and warning variants |

### UI Design
- Dark theme using Tailwind CSS zinc color palette
- Hover effects with smooth transitions
- Responsive grid layouts
- Toast notifications auto-dismiss after 3 seconds

---

## Backend Architecture

### Spring Boot Application

The backend is a Spring Boot REST API that manages the music catalog. It uses file-based JSON storage as the database.

**Main.java** - Application entry point for Spring Boot startup.

**SongController.java** - REST controller mapped to `/admin/songs`. Handles HTTP requests.

**SongService.java** - Business logic layer responsible for:
- Reading and writing songs to `data/songs.json`
- Generating UUIDs for new songs
- CRUD operations on the song list
- Auto-creating the data directory and JSON file on startup

**WebConfig.java** - CORS configuration allowing the frontend at `localhost:3000` to make cross-origin requests with credentials.

---

## Authentication Server

The auth server is a standalone Express.js microservice for handling user registration, login, and session validation.

### Endpoints

**POST /auth/register**
- Accepts `{ username, password }`
- Hashes password with bcrypt (10 salt rounds)
- Generates UUID for user ID
- Stores user in `data/users.json`

**POST /auth/login**
- Accepts `{ username, password }`
- Verifies credentials against stored hash
- Generates JWT token (1-hour expiry) containing `userId`, `username`, `isAdmin`
- Sets token as httpOnly cookie

**GET /auth/me**
- Reads JWT from cookies
- Verifies and decodes token
- Returns `{ userId, username, isAdmin }`
- Used by frontend middleware to check authentication and admin status

---

## API Endpoints

### Backend - Music Catalog (Port 8080)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/admin/songs` | List all songs | - | JSON array of songs |
| POST | `/admin/songs` | Create a song | Song JSON (without id) | Created song with generated id |
| PUT | `/admin/songs/{id}` | Update a song | Song JSON | Updated song |
| DELETE | `/admin/songs/{id}` | Delete a song | - | 204 No Content |

### Auth Server (Port 3001)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/auth/register` | Register new user | `{ username, password }` | `{ message }` |
| POST | `/auth/login` | Login | `{ username, password }` | `{ message }` + cookie |
| GET | `/auth/me` | Get current user | - | `{ userId, username, isAdmin }` |

---

## Data Models

### Song (Backend & Frontend)

```
Field      Type     Description
─────      ────     ───────────
id         String   UUID, auto-generated on creation
title      String   Song title
artist     String   Artist name
album      String   Album name
coverUrl   String   URL to cover art image
duration   String   Track duration (e.g. "3:45")
genre      String   Music genre
```

### User (Auth Server)

```
Field        Type       Description
─────        ────       ───────────
id           String     UUID, auto-generated on registration
username     String     Unique username
password     String     bcrypt-hashed password
likedSongs   Array      List of liked song references
playlists    Array      List of user playlists
isAdmin      Boolean    Admin privileges flag
```

### Album

```
Field         Type       Description
─────         ────       ───────────
id            String     Unique identifier
title         String     Album title
artist        String     Artist name
coverUrl      String     URL to album cover
year          Number     Release year
trackCount    Number     Number of tracks
```

### Playlist

```
Field        Type       Description
─────        ────       ───────────
id           String     Unique identifier
title        String     Playlist name
description  String     Playlist description
coverUrl     String     URL to playlist cover
trackCount   Number     Number of tracks
```

### Artist

```
Field      Type     Description
─────      ────     ───────────
id         String   Unique identifier
name       String   Artist name
imageUrl   String   URL to artist image
genre      String   Primary genre
```

---

## Data Flow

### Authentication Flow

```
1. User submits login form on frontend
2. Frontend sends POST /auth/login to auth server (port 3001)
3. Auth server verifies credentials against data/users.json
4. Auth server generates JWT and sets httpOnly cookie
5. Frontend receives success response
6. On protected pages, frontend calls GET /auth/me to verify session
7. Auth server decodes JWT and returns user info including isAdmin flag
```

### Admin CRUD Flow

```
1. Admin user navigates to /admin
2. Frontend middleware checks /auth/me to verify admin status
3. Admin panel loads and fetches GET /admin/songs from backend (port 8080)
4. Spring Boot reads data/songs.json and returns song list
5. Admin creates/edits/deletes songs via the UI
6. Frontend sends POST/PUT/DELETE to backend
7. Spring Boot updates data/songs.json
8. Frontend shows toast notification on success/failure
```

### Service Communication Diagram

```
┌──────────────┐     Port 3000      ┌──────────────┐
│              │◄──────────────────►│              │
│   Browser    │                    │   Frontend   │
│              │                    │  (Next.js)   │
└──────────────┘                    └──────┬───────┘
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                    Port 3001 ▼                       ▼ Port 8080
               ┌──────────────────┐      ┌──────────────────┐
               │   Auth Server    │      │    Backend API    │
               │  (Express.js)    │      │  (Spring Boot)    │
               └────────┬─────────┘      └────────┬─────────┘
                        │                         │
                        ▼                         ▼
                  data/users.json           data/songs.json
```

---

## Setup & Running

### Prerequisites

- **Java 25** - For the Spring Boot backend
- **Node.js** or **Bun** - For the frontend and auth server
- **Maven** - For building the Java backend

### 1. Start the Auth Server (Port 3001)

```bash
cd auth
bun install        # or npm install
bun run src/main.ts
```

### 2. Start the Backend (Port 8080)

```bash
cd backend
mvn spring-boot:run
```

### 3. Start the Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Auth Server | http://localhost:3001 |
| Backend API | http://localhost:8080 |

### Default Admin Account

- Username: `dev`
- Access the admin panel via the account menu after logging in

---

## Design Decisions

### Three-Service Architecture
The application is split into three microservices (frontend, backend, auth) rather than a monolithic application. This provides clear separation and allows each service to be developed, tested, and deployed independently.

### File-Based JSON Storage
Data is stored in JSON files (`data/songs.json`, `data/users.json`)

### JWT with HttpOnly Cookies
Authentication tokens are stored as httpOnly cookies, which prevents JavaScript from accessing them directly. This protects against XSS (Cross-Site Scripting) attacks.

### Role-Based Access Control
Users have an `isAdmin` boolean flag. The frontend middleware checks this flag before allowing access to the admin panel.

### CORS Configuration
Both the backend and auth server are configured to accept requests from `http://localhost:3000` with credentials. This allows the frontend to communicate with both services during local development environments.

### Dark Theme UI
The frontend uses a dark theme with Tailwind CSS.
