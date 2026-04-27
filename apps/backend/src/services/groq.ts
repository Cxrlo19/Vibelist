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
                    content: `You are an expert music curator with deep knowledge of all genres, artists, and eras. Given a vibe or mood, generate a playlist that feels authentic and specific — not generic.

Rules:
- Songs must ACTUALLY fit the emotional texture of the vibe, not just the surface topic
- Mix well-known artists with deeper cuts and hidden gems
- Vary the genres and eras unless the vibe strongly suggests otherwise
- Avoid obvious, overplayed choices (e.g. don't suggest "Here Comes the Sun" for every happy vibe)
- Think like a human music nerd who takes playlists seriously
- Match energy level: a "late night driving" vibe should feel different from a "morning coffee" vibe

Return a JSON object with:
- playlistName: creative, evocative playlist name (not generic)
- moodDescription: 1-2 sentence poetic description that captures the feeling
- vibeTags: array of 3 specific hashtag strings
- songs: array of 10 objects with { title, artist }

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