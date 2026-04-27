import axios from 'axios';
import type { Song } from '@vibelist/types';

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getSpotifyToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

    const credentials = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const res = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    cachedToken = res.data.access_token;
    tokenExpiry = Date.now() + res.data.expires_in * 1000;
    console.log('Spotify token fetched successfully:', cachedToken!.slice(0, 10) + '...');
    return cachedToken!;
}

export async function getArtistIds(artists: string[]): Promise<string[]> {
    const token = await getSpotifyToken();

    const ids = await Promise.all(
        artists.slice(0, 3).map(async (artist) => {
            try {
                const res = await axios.get('https://api.spotify.com/v1/search', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { q: artist, type: 'artist', limit: 1 }
                });
                const found = res.data.artists.items[0];
                console.log(`Found artist: ${found?.name} (${found?.id})`);
                return found?.id ?? null;
            } catch (err: any) {
                console.error(`Error finding artist ${artist}:`, err?.response?.data || err.message);
                return null;
            }
        })
    );

    return ids.filter(Boolean) as string[];
}

export async function getSpotifyRecommendations(
    artistIds: string[],
    audioFeatures: { energy: number; valence: number; tempo: number },
): Promise<Song[]> {
    const token = await getSpotifyToken();

    try {
        const res = await axios.get('https://api.spotify.com/v1/recommendations', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                seed_artists: artistIds.slice(0, 3).join(','),
                target_energy: audioFeatures.energy,
                target_valence: audioFeatures.valence,
                target_tempo: audioFeatures.tempo,
                limit: 10,
            },
        });

        return res.data.tracks.map((track: any) => ({
            title: track.name,
            artist: track.artists[0].name,
            spotifyUrl: track.external_urls.spotify ?? null,
            albumArt: track.album.images[1]?.url ?? null,
            previewUrl: track.preview_url ?? null,
        }));
    } catch (err: any) {
        console.error('Spotify recommendations error:',
            JSON.stringify(err?.response?.data, null, 2) || err.message
        );
        console.error('Status:', err?.response?.status);
        console.error('Params sent:', {
            seed_artists: artistIds.slice(0, 3).join(','),
            target_energy: audioFeatures.energy,
            target_valence: audioFeatures.valence,
            target_tempo: audioFeatures.tempo,
            limit: 10,
        });
        return [];
    }
}

export async function enrichSongsWithSpotify(
    songs: { title: string; artist: string }[]
): Promise<Song[]> {
    const token = await getSpotifyToken();

    return Promise.all(
        songs.map(async (song) => {
            try {
                const res = await axios.get('https://api.spotify.com/v1/search', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        q: `track:${song.title} artist:${song.artist}`,
                        type: 'track',
                        limit: 1
                    }
                });

                const track = res.data.tracks.items[0];
                return {
                    ...song,
                    spotifyUrl: track?.external_urls?.spotify ?? null,
                    albumArt: track?.album?.images?.[1]?.url ?? null,
                    previewUrl: track?.preview_url ?? null,
                };
            } catch (err: any) {
                console.error(`Spotify error for ${song.title} :`, err?.response?.data || err.message);
                return { ...song, spotifyUrl: null, albumArt: null, previewUrl: null };
            }
        })
    );
}