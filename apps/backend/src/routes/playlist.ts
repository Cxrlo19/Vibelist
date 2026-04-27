import { Router, Request, Response } from 'express';
import { generatePlaylist } from '../services/groq';
import { enrichSongsWithSpotify, getArtistIds, getSpotifyRecommendations } from '../services/spotify';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    const { vibe } = req.body;

    if (!vibe || typeof vibe !== 'string') {
        return res.status(400).json({ error: 'Vibe is required' });
    }

    try {
        // Step 1: Generate playlist metadata + extract artists/audio features
        const playlist = await generatePlaylist(vibe);

        let songs;

        // Step 2: If artists were extracted, use Spotify recommendations
        if (playlist.extractedArtists && playlist.extractedArtists.length > 0) {
            console.log('Using Spotify recommendations for artists:', playlist.extractedArtists);

            const artistIds = await getArtistIds(playlist.extractedArtists);

            if (artistIds.length > 0 && playlist.audioFeatures) {
                songs = await getSpotifyRecommendations(
                    artistIds,
                    playlist.audioFeatures,
                );
            } else {
                // Fallback to enriching Groq songs if artist IDs not found
                songs = await enrichSongsWithSpotify(playlist.songs);
            }
        } else {
            // Step 3: No artists mentioned — enrich Groq songs with Spotify metadata
            console.log('No artists extracted, enriching Groq songs with Spotify');
            songs = await enrichSongsWithSpotify(playlist.songs);
        }

        return res.json({ ...playlist, songs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate playlist' });
    }
});

export default router;