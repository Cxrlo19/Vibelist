import { Router, Request, Response } from 'express';
import getSupabase from '../services/supabase';

const router = Router();

// Save a playlist
router.post('/save', async (req: Request, res: Response) => {
    const { userId, playlist, vibeText } = req.body;

    if (!userId || !playlist) {
        return res.status(400).json({ error: 'userId and playlist required' });
    }

    const { data: savedPlaylist, error: playlistError } = await getSupabase()
        .from('playlists')
        .insert({
            user_id: userId,
            playlist_name: playlist.playlistName,
            mood_description: playlist.moodDescription,
            vibe_text: vibeText,
            vibe_tags: playlist.vibeTags,
        })
        .select()
        .single();

    if (playlistError) return res.status(400).json({ error: playlistError.message });

    const songs = playlist.songs.map((song: any, index: number) => ({
        playlist_id: savedPlaylist.id,
        title: song.title,
        artist: song.artist,
        spotify_url: song.spotifyUrl,
        album_art: song.albumArt,
        position: index,
    }));

    const { error: songsError } = await getSupabase()
        .from('playlist_songs')
        .insert(songs);

    if (songsError) return res.status(400).json({ error: songsError.message });

    return res.json({ success: true, playlistId: savedPlaylist.id });
});

// Get user's playlists
router.get('/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;

    const { data, error } = await getSupabase()
        .from('playlists')
        .select(`
            *,
            playlist_songs (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
});

// Delete a playlist
router.delete('/:playlistId', async (req: Request, res: Response) => {
    const { playlistId } = req.params;

    const { error } = await getSupabase()
        .from('playlists')
        .delete()
        .eq('id', playlistId);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
});

export default router;