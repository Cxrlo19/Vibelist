export interface Song {
    title: string;
    artist: string;
    spotifyUrl: string | null;
    albumArt: string | null;
    previewUrl: string | null;
}

export interface Playlist {
    playlistName: string;
    moodDescription: string;
    vibeTags: string[];
    songs: Song[];
}

export interface GenerateRequest {
    vibe: string;
}

export interface GenerateResponse extends Playlist { }