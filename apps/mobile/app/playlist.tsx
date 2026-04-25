import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, Linking, Image
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { Playlist, Song } from '@vibelist/types';

export default function PlaylistScreen() {
    const { data } = useLocalSearchParams<{ data: string }>();
    const router = useRouter();
    const playlist: Playlist = JSON.parse(data);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Back button */}
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Text style={styles.backText}>← new vibe</Text>
                </TouchableOpacity>

                {/* Playlist header */}
                <View style={styles.header}>
                    <Text style={styles.playlistName}>{playlist.playlistName}</Text>
                    <Text style={styles.moodDescription}>{playlist.moodDescription}</Text>

                    {/* Vibe tags */}
                    <View style={styles.tags}>
                        {playlist.vibeTags.map((tag) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Songs */}
                <View style={styles.songs}>
                    {playlist.songs.map((song, index) => (
                        <SongCard key={index} song={song} index={index} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function SongCard({ song, index }: { song: Song; index: number }) {
    const handlePress = () => {
        if (song.spotifyUrl) {
            Linking.openURL(song.spotifyUrl);
        } else {
            const query = encodeURIComponent(`${song.title} ${song.artist}`);
            Linking.openURL(`https://open.spotify.com/search/${query}`);
        }
    };

    return (
        <TouchableOpacity style={styles.songCard} onPress={handlePress} activeOpacity={0.7}>
            {/* Album art or placeholder */}
            <View style={styles.albumArt}>
                {song.albumArt
                    ? <Image source={{ uri: song.albumArt }} style={styles.albumImage} />
                    : <Text style={styles.albumPlaceholder}>{String(index + 1).padStart(2, '0')}</Text>
                }
            </View>

            {/* Song info */}
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
            </View>

            {/* Spotify arrow */}
            <Text style={styles.arrow}>↗</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        paddingHorizontal: spacing.lg,
        paddingTop: 60,
        paddingBottom: spacing.xxl,
    },
    back: {
        marginBottom: spacing.xl,
    },
    backText: {
        fontFamily: fonts.body,
        fontSize: 14,
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    header: {
        gap: spacing.md,
    },
    playlistName: {
        fontFamily: fonts.display,
        fontSize: 36,
        color: colors.textPrimary,
        lineHeight: 44,
        letterSpacing: -0.5,
    },
    moodDescription: {
        fontFamily: fonts.body,
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    tag: {
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    tagText: {
        fontFamily: fonts.bodyMedium,
        fontSize: 12,
        color: colors.accent,
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xl,
    },
    songs: {
        gap: spacing.sm,
    },
    songCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        gap: spacing.md,
    },
    albumArt: {
        width: 52,
        height: 52,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    albumImage: {
        width: 52,
        height: 52,
    },
    albumPlaceholder: {
        fontFamily: fonts.display,
        fontSize: 16,
        color: colors.accent,
    },
    songInfo: {
        flex: 1,
        gap: 3,
    },
    songTitle: {
        fontFamily: fonts.bodyMedium,
        fontSize: 15,
        color: colors.textPrimary,
    },
    songArtist: {
        fontFamily: fonts.body,
        fontSize: 13,
        color: colors.textSecondary,
    },
    arrow: {
        fontFamily: fonts.body,
        fontSize: 18,
        color: colors.textSecondary,
    },
});