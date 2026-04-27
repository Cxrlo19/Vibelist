import axios from 'axios';
import type { Playlist } from '@vibelist/types';

export async function generatePlaylist(vibe: string): Promise<Playlist> {
    const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert music curator and assistant. Analyze the vibe input and return a JSON object with:
- playlistName: creative, evocative playlist name
- moodDescription: 1-2 sentence poetic description that captures the feeling
- vibeTags: array of 3 specific hashtag strings
- extractedArtists: array of any artist names explicitly mentioned in the input (empty array if none)
- audioFeatures: object with { energy: 0-1, valence: 0-1, tempo: 60-180 } that matches the vibe
- songs: array of 10 objects with { title, artist } — if artists were mentioned, include their songs AND similar artists. If no artists mentioned, curate songs that fit the vibe. Avoid generic overplayed choices.

Return ONLY valid JSON, no markdown, no backticks, no explanation.`
                },
                {
                    role: 'user',
                    content: `Vibe: "${vibe}"`
                }
            ],
            temperature: 0.92,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            }
        }
    );

    const raw = response.data.choices[0].message.content;
    return JSON.parse(raw);
}