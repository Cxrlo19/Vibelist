import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist } from '@vibelist/types';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'saved_playlists';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function useSavedPlaylists() {
    const [saved, setSaved] = useState<Playlist[]>([]);
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            loadFromCloud();
        } else {
            loadFromLocal();
        }
    }, [session]);

    // Load from local AsyncStorage (fallback for logged out users)
    const loadFromLocal = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) setSaved(JSON.parse(raw));
        } catch { }
    };

    // Load from Supabase via backend
    const loadFromCloud = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/playlists/${session!.user.id}`, {
                headers: { Authorization: `Bearer ${session!.access_token}` }
            });
            if (!res.ok) return;
            const data = await res.json();

            // Transform DB format to Playlist format
            const playlists: Playlist[] = data.map((p: any) => ({
                playlistName: p.playlist_name,
                moodDescription: p.mood_description,
                vibeTags: p.vibe_tags,
                songs: p.playlist_songs
                    .sort((a: any, b: any) => a.position - b.position)
                    .map((s: any) => ({
                        title: s.title,
                        artist: s.artist,
                        spotifyUrl: s.spotify_url,
                        albumArt: s.album_art,
                        previewUrl: s.preview_url ?? null,
                    })),
                dbId: p.id,
            }));

            setSaved(playlists);
        } catch (err) {
            console.error('Failed to load from cloud:', err);
            loadFromLocal();
        }
    };

    const save = async (playlist: Playlist, vibeText?: string) => {
        if (session) {
            // Save to Supabase
            try {
                const res = await fetch(`${BASE_URL}/api/playlists/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        userId: session.user.id,
                        playlist,
                        vibeText: vibeText ?? '',
                    })
                });
                if (!res.ok) throw new Error('Failed to save to cloud');
                await loadFromCloud();
            } catch (err) {
                console.error('Cloud save failed:', err);
            }
        } else {
            // Save to local AsyncStorage
            try {
                const updated = [playlist, ...saved];
                setSaved(updated);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch { }
        }
    };

    const remove = async (playlistName: string) => {
        if (session) {
            // Find the playlist's db ID
            const playlist = saved.find(p => p.playlistName === playlistName) as any;
            if (!playlist?.dbId) return;

            try {
                await fetch(`${BASE_URL}/api/playlists/${playlist.dbId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${session.access_token}` }
                });
                await loadFromCloud();
            } catch (err) {
                console.error('Cloud delete failed:', err);
            }
        } else {
            // Remove from local AsyncStorage
            try {
                const updated = saved.filter(p => p.playlistName !== playlistName);
                setSaved(updated);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch { }
        }
    };

    return { saved, save, remove };
}