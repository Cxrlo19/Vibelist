export interface Song {
    title: string;
    artist: string;
    spotifyUrl: string | null;
    albumArt: string | null;
    previewUrl: string | null;
}

export interface AudioFeatures {
    energy: number;
    valence: number;
    tempo: number;
}

export interface Playlist {
    playlistName: string;
    moodDescription: string;
    vibeTags: string[];
    songs: Song[];
    extractedArtists?: string[];
    audioFeatures?: AudioFeatures;
    dbId?: string;
}

export interface GenerateRequest {
    vibe: string;
}

export interface GenerateResponse extends Playlist { }