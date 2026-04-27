# 🎵 VibeList

> Describe a feeling. Get a soundtrack.

VibeList is an iOS app that transforms natural language into personalized playlists. Type a vibe — *"driving at 3am in the rain"* or *"late night to Tinashe, Latto, Bryson Tiller"* — and get a curated playlist with real Spotify links. Apple Music support coming soon.

---

## ✨ Features

- **Natural language vibe input** — describe any mood, moment, or artist preference
- **Artist extraction** — mention artists and the AI picks up on them automatically
- **AI-powered generation** — Groq (LLaMA 3.3) generates contextually appropriate playlists
- **Spotify integration** — every song links directly to Spotify with album art
- **Save playlists** — save your favorite generated playlists locally
- **Clean aesthetic UI** — dark, Spotify-inspired design with smooth animations

---

## 🛠 Tech Stack

### Mobile (`apps/mobile`)
- **Expo** (React Native) — iOS app
- **Expo Router** — file-based navigation
- **AsyncStorage** — local playlist persistence
- **TypeScript**

### Backend (`apps/backend`)
- **Node.js + Express** — REST API
- **Groq API** (LLaMA 3.3-70b) — AI playlist generation + artist extraction
- **Spotify Web API** — song metadata, album art, deep links
- **Supabase** — PostgreSQL database + user authentication
- **TypeScript**

### Infrastructure
- **Monorepo** — npm workspaces
- **Render** — backend hosting (free tier)
- **Shared types** — `@vibelist/types` package used across apps

---

## 🏗 Project Structure

```
vibelist/
├── apps/
│   ├── backend/          # Express API
│   │   └── src/
│   │       ├── routes/   # playlist, auth, playlists
│   │       └── services/ # groq, spotify, supabase
│   └── mobile/           # Expo iOS app
│       ├── app/          # Expo Router screens
│       ├── components/   # AnimatedSongCard, SkeletonLoader
│       ├── hooks/        # useSavedPlaylists
│       └── services/     # api.ts
├── packages/
│   ├── types/            # Shared TypeScript interfaces
│   └── database/         # Supabase client + DB types
└── package.json          # Workspace root
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo Go app on your iOS device
- Accounts: [Groq](https://console.groq.com), [Supabase](https://supabase.com)

> **Note:** Spotify is used for song metadata and deep links only (album art + direct links). The Spotify `/recommendations` endpoint was deprecated in November 2024 for new developer apps, so song generation is handled entirely by Groq.

### Installation

```bash
# Clone the repo
git clone https://github.com/Cxrlo19/Vibelist.git
cd VibeList

# Install all dependencies
npm install
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
```

**`apps/mobile/.env`**
```env
EXPO_PUBLIC_API_URL=http://your_local_ip:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running Locally

```bash
# Start backend (from root)
npm run dev:backend

# Start mobile app (from apps/mobile)
cd apps/mobile
npx expo start
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
2. Backend sends vibe to **Groq** which extracts:
   - Artist names mentioned
   - Audio features (energy, valence, tempo)
   - Playlist name, mood description, vibe tags
   - 10 song suggestions
3. **Spotify API** enriches each song with album art and direct links
4. Results returned to the mobile app and displayed with animations

---

## 💡 Possible Implementations

- **Similar Artist Discovery** — integrate Last.fm's `artist.getSimilar` to expand artist seeds and generate richer, more accurate playlists
- **ML Personalization** — track saves and taps to build a taste profile over time, feeding it back into the generation prompt for increasingly personal results
- **Cross-Device Sync** — replace AsyncStorage with Supabase-backed cloud storage tied to user accounts
- **Apple Music Support** — alternative to Spotify for link enrichment and album art using MusicKit (exploratory)
- **Docker** — containerize the backend for consistent local and production deployments
- **App Store Release** — publish via Expo EAS Build and EAS Submit

---

## 📄 License

MIT