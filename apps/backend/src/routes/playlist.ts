import { Router, Request, Response } from 'express';
import { generatePlaylist } from '../services/groq';
import { enrichSongsWithSpotify } from '../services/spotify';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    const { vibe } = req.body;

    if (!vibe || typeof vibe !== 'string') {
        return res.status(400).json({ error: 'Vibe is required' });
    }

    try {
        const playlist = await generatePlaylist(vibe);
        const enrichedSongs = await enrichSongsWithSpotify(playlist.songs);
        return res.json({ ...playlist, songs: enrichedSongs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate playlist' });
    }
});

export default router;