import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Playlist } from '@vibelist/types';

const STORAGE_KEY = 'saved_playlists';

export function useSavedPlaylists() {
    const [saved, setSaved] = useState<Playlist[]>([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) setSaved(JSON.parse(raw));
        } catch { }
    };

    const save = async (playlist: Playlist) => {
        try {
            const updated = [playlist, ...saved];
            setSaved(updated);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch { }
    };

    const remove = async (playlistName: string) => {
        try {
            const updated = saved.filter(p => p.playlistName !== playlistName);
            setSaved(updated);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch { }
    };

    return { saved, save, remove };
}