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
                    content: `You are a music curator. Given a vibe or mood, return a JSON object with:
          - playlistName: creative playlist name
          - moodDescription: 1-2 sentence poetic description
          - vibeTags: array of 3 hashtag strings
          - songs: array of 8 objects with { title, artist }
          Return ONLY valid JSON, no markdown, no backticks.`
                },
                {
                    role: 'user',
                    content: `Vibe: "${vibe}"`
                }
            ],
            temperature: 0.85,
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