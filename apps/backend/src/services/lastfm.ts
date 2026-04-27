import axios from 'axios';

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export async function getSimilarArtists(artist: string): Promise<string[]> {
    try {
        const res = await axios.get(BASE_URL, {
            params: {
                method: 'artist.getSimilar',
                artist,
                api_key: process.env.LASTFM_API_KEY,
                format: 'json',
                limit: 5,
            }
        });

        const similar = res.data?.similarartists?.artist;
        if (!similar || !Array.isArray(similar)) return [];

        return similar.map((a: any) => a.name);
    } catch (err: any) {
        console.error(`Last.fm error for ${artist}:`, err?.response?.data || err.message);
        return [];
    }
}

export async function expandArtists(artists: string[]): Promise<string[]> {
    if (artists.length === 0) return [];

    // Get similar artists for each extracted artist
    const similarArrays = await Promise.all(
        artists.map(artist => getSimilarArtists(artist))
    );

    // Flatten and deduplicate
    const allSimilar = similarArrays.flat();
    const unique = [...new Set(allSimilar)];

    // Filter out artists already in the original list
    const expanded = unique.filter(
        a => !artists.map(x => x.toLowerCase()).includes(a.toLowerCase())
    );

    console.log(`Expanded artists: ${artists.join(', ')} → also similar to: ${expanded.slice(0, 5).join(', ')}`);

    // Return original artists + top 4 similar ones
    return [...artists, ...expanded.slice(0, 4)];
}