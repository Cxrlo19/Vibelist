import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSavedPlaylists } from '../hooks/useSavedPlaylists';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { Playlist } from '@vibelist/types';

export default function SavedScreen() {
    const { saved, remove } = useSavedPlaylists();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Text style={styles.backText}>← back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>saved vibes</Text>

                {saved.length === 0 && (
                    <Text style={styles.empty}>no saved playlists yet</Text>
                )}

                {saved.map((playlist: Playlist, index: number) => (
                    <View key={index} style={styles.card}>
                        <TouchableOpacity
                            style={styles.cardContent}
                            onPress={() => router.push({
                                pathname: '/playlist',
                                params: { data: JSON.stringify(playlist) }
                            })}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.playlistName}>{playlist.playlistName}</Text>
                            <Text style={styles.songCount}>{playlist.songs.length} songs</Text>
                            <View style={styles.tags}>
                                {playlist.vibeTags.map(tag => (
                                    <Text key={tag} style={styles.tag}>{tag}</Text>
                                ))}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => remove(playlist.playlistName)}
                            style={styles.deleteButton}
                        >
                            <Text style={styles.deleteText}>remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
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
    },
    title: {
        fontFamily: fonts.display,
        fontSize: 36,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
    },
    empty: {
        fontFamily: fonts.body,
        fontSize: 15,
        color: colors.textSecondary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    cardContent: {
        gap: spacing.xs,
    },
    playlistName: {
        fontFamily: fonts.display,
        fontSize: 20,
        color: colors.textPrimary,
    },
    songCount: {
        fontFamily: fonts.body,
        fontSize: 13,
        color: colors.textSecondary,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    tag: {
        fontFamily: fonts.body,
        fontSize: 12,
        color: colors.accent,
    },
    deleteButton: {
        alignSelf: 'flex-start',
    },
    deleteText: {
        fontFamily: fonts.body,
        fontSize: 12,
        color: colors.coral,
    },
});