import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';

function SkeletonBox({ width, height, style }: {
    width: number | string;
    height: number;
    style?: object;
}) {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius.sm,
                    backgroundColor: colors.surfaceElevated,
                    opacity,
                },
                style,
            ]}
        />
    );
}

export default function SkeletonLoader() {
    return (
        <View style={styles.container}>
            <SkeletonBox width="70%" height={40} />
            <SkeletonBox width="90%" height={16} style={{ marginTop: spacing.sm }} />
            <SkeletonBox width="60%" height={16} style={{ marginTop: spacing.xs }} />

            <View style={styles.tags}>
                <SkeletonBox width={80} height={28} style={{ borderRadius: radius.full }} />
                <SkeletonBox width={100} height={28} style={{ borderRadius: radius.full }} />
                <SkeletonBox width={90} height={28} style={{ borderRadius: radius.full }} />
            </View>

            <View style={styles.divider} />

            {[...Array(8)].map((_, i) => (
                <View key={i} style={styles.songRow}>
                    <SkeletonBox width={52} height={52} style={{ borderRadius: radius.sm }} />
                    <View style={styles.songInfo}>
                        <SkeletonBox width="60%" height={14} />
                        <SkeletonBox width="40%" height={12} style={{ marginTop: spacing.xs }} />
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: spacing.sm,
    },
    tags: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xl,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.sm,
    },
    songInfo: {
        flex: 1,
        gap: spacing.xs,
    },
});