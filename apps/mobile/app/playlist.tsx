import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { Playlist } from '@vibelist/types';
import { useSavedPlaylists } from '../hooks/useSavedPlaylists';
import AnimatedSongCard from '../components/AnimatedSongCard';
import SkeletonLoader from '../components/SkeletonLoader';

export default function PlaylistScreen() {
    const { data } = useLocalSearchParams<{ data: string }>();
    const router = useRouter();
    const playlist: Playlist = JSON.parse(data);
    const { save, saved } = useSavedPlaylists();
    const isSaved = saved.some(p => p.playlistName === playlist.playlistName);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

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

                    {/* Save button */}
                    <TouchableOpacity
                        style={[styles.saveButton, isSaved && styles.saveButtonSaved]}
                        onPress={() => save(playlist)}
                        disabled={isSaved}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextSaved]}>
                            {isSaved ? '✓ saved' : '+ save playlist'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Songs */}
                <View style={styles.songs}>
                    {ready
                        ? playlist.songs.map((song, index) => (
                            <AnimatedSongCard key={index} song={song} index={index} />
                        ))
                        : <SkeletonLoader />
                    }
                </View>
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
    saveButton: {
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: radius.full,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        alignSelf: 'flex-start',
        marginTop: spacing.xs,
    },
    saveButtonSaved: {
        backgroundColor: colors.accent,
    },
    saveButtonText: {
        fontFamily: fonts.bodyMedium,
        fontSize: 13,
        color: colors.accent,
    },
    saveButtonTextSaved: {
        color: colors.background,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xl,
    },
    songs: {
        gap: spacing.sm,
    },
});