import { useEffect, useRef } from 'react';
import {
    Animated, TouchableOpacity, View,
    Text, Image, StyleSheet, Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Song } from '@vibelist/types';
import { colors, fonts, spacing, radius } from '../constants/theme';

const GRADIENTS: [string, string][] = [
    ['#C8F060', '#4A7C00'],
    ['#FF6B6B', '#8B0000'],
    ['#6B9FFF', '#00008B'],
    ['#FFB86B', '#8B4500'],
    ['#D06BFF', '#4B0082'],
    ['#6BFFE0', '#006B5A'],
    ['#FF6BC8', '#8B0057'],
    ['#FFF06B', '#8B7800'],
];

function AlbumPlaceholder({ index }: { index: number }) {
    const [start, end] = GRADIENTS[index % GRADIENTS.length];
    return (
        <LinearGradient
            colors={[start, end]}
            style={styles.albumArt}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text style={styles.albumPlaceholder}>
                {String(index + 1).padStart(2, '0')}
            </Text>
        </LinearGradient>
    );
}

export default function AnimatedSongCard({ song, index }: { song: Song; index: number }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {
        if (song.spotifyUrl) {
            Linking.openURL(song.spotifyUrl);
        } else {
            const query = encodeURIComponent(`${song.title} ${song.artist}`);
            Linking.openURL(`https://open.spotify.com/search/${query}`);
        }
    };

    return (
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            <TouchableOpacity style={styles.songCard} onPress={handlePress} activeOpacity={0.7}>
                {song.albumArt
                    ? <Image source={{ uri: song.albumArt }} style={[styles.albumArt, styles.albumImage]} />
                    : <AlbumPlaceholder index={index} />
                }
                <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                </View>
                <Text style={styles.arrow}>↗</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
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
        color: '#0A0A0F',
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