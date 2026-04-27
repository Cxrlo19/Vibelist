import { Router, Request, Response } from 'express';
import { generatePlaylist } from '../services/groq';
import { enrichSongsWithSpotify } from '../services/spotify';
import { expandArtists } from '../services/lastfm';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    const { vibe } = req.body;

    if (!vibe || typeof vibe !== 'string') {
        return res.status(400).json({ error: 'Vibe is required' });
    }

    try {
        // Step 1: Quick first pass to extract artists
        const initial = await generatePlaylist(vibe);

        let expandedArtists: string[] = [];

        // Step 2: If artists were mentioned, expand with Last.fm similar artists
        if (initial.extractedArtists && initial.extractedArtists.length > 0) {
            expandedArtists = await expandArtists(initial.extractedArtists);
        }

        // Step 3: Generate full playlist with expanded artist context
        const playlist = expandedArtists.length > 0
            ? await generatePlaylist(vibe, expandedArtists)
            : initial;

        // Step 4: Enrich songs with Spotify metadata
        const enrichedSongs = await enrichSongsWithSpotify(playlist.songs);

        return res.json({ ...playlist, songs: enrichedSongs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate playlist' });
    }
});

export default router;