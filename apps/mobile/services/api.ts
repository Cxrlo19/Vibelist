import { Playlist } from "@vibelist/types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
console.log('BASE_URL', BASE_URL);

export async function generatePlaylist(vibe: string): Promise<Playlist> {

    const response = await fetch(`${BASE_URL}/api/playlist/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate playlist');
    }

    return response.json();
}