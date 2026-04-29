# 🎵 VibeList

> Describe a feeling. Get a soundtrack.

VibeList is an iOS app that transforms natural language into personalized playlists. Type a vibe — *"driving at 3am in the rain"* or *"late night to Tinashe, Latto, Bryson Tiller"* — and get a curated playlist with real Spotify links.

---

## ✨ Features

- **Natural language vibe input** — describe any mood, moment, or artist preference
- **Artist extraction** — mention artists and the AI picks up on them automatically
- **Similar artist expansion** — Last.fm finds sonically similar artists to enrich results
- **AI-powered generation** — Groq (LLaMA 3.3) generates contextually appropriate playlists
- **Spotify integration** — every song links directly to Spotify with album art
- **User authentication** — sign up and sign in with email and password
- **Cloud playlist sync** — saved playlists sync across devices via Supabase
- **Clean aesthetic UI** — dark, Spotify-inspired design with smooth animations

---

## 🛠 Tech Stack

### Mobile (`apps/mobile`)
- **Expo** (React Native) — iOS app
- **Expo Router** — file-based navigation
- **Supabase** — cloud playlist sync
- **AsyncStorage** — local session persistence
- **TypeScript**

### Backend (`apps/backend`)
- **Node.js + Express** — REST API
- **Groq API** (LLaMA 3.3-70b) — AI playlist generation + artist extraction
- **Last.fm API** — similar artist discovery
- **Spotify Web API** — song metadata, album art, deep links
- **Supabase** — PostgreSQL database + user authentication
- **Docker** — containerized for consistent deployments
- **TypeScript**

### Infrastructure
- **Monorepo** — npm workspaces
- **Render** — backend hosting (free tier)
- **Docker + Docker Compose** — local containerized development
- **Shared packages** — `@vibelist/types` and `@vibelist/database` across apps

---

## 🏗 Project Structure

```
vibelist/
├── apps/
│   ├── backend/          # Express API
│   │   └── src/
│   │       ├── routes/   # playlist, auth, playlists
│   │       └── services/ # groq, spotify, lastfm, supabase
│   └── mobile/           # Expo iOS app
│       ├── app/          # Expo Router screens
│       │   └── auth/     # signin, signup screens
│       ├── components/   # AnimatedSongCard, SkeletonLoader
│       ├── context/      # AuthContext
│       ├── hooks/        # useSavedPlaylists
│       └── services/     # api.ts
├── packages/
│   ├── types/            # Shared TypeScript interfaces
│   └── database/         # Supabase client + DB types
├── docker-compose.yml    # Local containerized development
└── package.json          # Workspace root
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop
- Expo Go app on your iOS device
- Accounts: [Groq](https://console.groq.com), [Spotify Developer](https://developer.spotify.com), [Last.fm API](https://www.last.fm/api), [Supabase](https://supabase.com)

> **Note:** Spotify is used for song metadata and deep links only (album art + direct links). The Spotify `/recommendations` endpoint was deprecated in November 2024 for new developer apps, so song generation is handled by Groq + Last.fm.

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/vibelist.git
cd vibelist

# Install all dependencies
npm install

# Build shared packages
npm run build --workspace=packages/types
npm run build --workspace=packages/database
```

### Environment Variables

**`apps/backend/.env`**
```env
PORT=3000
GROQ_API_KEY=your_groq_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
LASTFM_API_KEY=your_lastfm_api_key
```

**`apps/mobile/.env`**
```env
EXPO_PUBLIC_API_URL=http://your_local_ip:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running Locally

```bash
# Option 1: Standard
npm run dev:backend
cd apps/mobile && npx expo start

# Option 2: Docker
docker-compose up --build
cd apps/mobile && npx expo start
```

---

## 🗄 Database Schema

```sql
-- User playlists
playlists (id, user_id, playlist_name, mood_description, vibe_text, vibe_tags, created_at)

-- Songs in each playlist
playlist_songs (id, playlist_id, title, artist, spotify_url, album_art, position)

-- User actions (for future ML personalization)
user_actions (id, user_id, action, artist, vibe_text, created_at)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/playlist/generate` | Generate a playlist from a vibe |
| `POST` | `/api/auth/signup` | Create a new user |
| `POST` | `/api/auth/signin` | Sign in a user |
| `POST` | `/api/playlists/save` | Save a playlist to the database |
| `GET` | `/api/playlists/:userId` | Get all playlists for a user |
| `DELETE` | `/api/playlists/:playlistId` | Delete a playlist |
| `GET` | `/health` | Health check |

---

## 🧠 How It Works

1. User types a vibe (e.g. *"late night drive to Tinashe and Bryson Tiller"*)
2. **Groq** analyzes the vibe and extracts:
   - Artist names mentioned
   - Audio features (energy, valence, tempo)
   - Playlist name, mood description, vibe tags
3. **Last.fm** expands the artist list with sonically similar artists
4. **Groq** generates 10 songs using the expanded artist context
5. **Spotify API** enriches each song with album art and direct links
6. Results are returned to the app, displayed with staggered animations
7. User can save playlists — synced to Supabase for cross-device access

---



## 📄 License

MIT