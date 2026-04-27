import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient(url: string, key: string) {
    return createClient(url, key);
}

export type { SupabaseClient } from "@supabase/supabase-js";

export interface DbPlaylists {
    id: string;
    user_id: string;
    playlist_name: string;
    mood_description: string;
    vibe_text: string;
    vibe_tags: string[];
    created_at: string;
}

export interface DbPlaylistSongs {
    id: string;
    playlist_id: string;
    title: string;
    artist: string;
    spotify_url: string | null;
    album_art: string | null;
    position: number;
}

export interface DbUserActions {
    id: string;
    user_id: string;
    action: string;
    artist: string | null;
    vibe_text: string | null;
    created_at: string;
}