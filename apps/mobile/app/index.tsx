import { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ActivityIndicator, Alert, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { generatePlaylist } from '../services/api';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const EXAMPLE_VIBES = [
    'driving at 3am in the rain',
    'sunday morning making coffee alone',
    'last day of summer',
    'falling in love in a foreign city',
];

export default function HomeScreen() {
    const [vibe, setVibe] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pulse = useRef(new Animated.Value(1)).current;
    const { signOut } = useAuth();

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulse, {
                        toValue: 0.85,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulse, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            Animated.timing(pulse, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    const handleGenerate = async () => {
        if (!vibe.trim()) return;
        setLoading(true);
        try {
            const playlist = await generatePlaylist(vibe.trim());
            router.push({
                pathname: '/playlist',
                params: {
                    data: JSON.stringify(playlist),
                    vibeText: vibe.trim()
                }
            });
        } catch {
            Alert.alert('Error', 'Could not generate playlist. Is your backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background orb */}
            <LinearGradient
                colors={['#C8F06022', '#0A0A0F00']}
                style={styles.orb}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>vibelist</Text>
                    <Text style={styles.tagline}>describe a feeling.{'\n'}get a soundtrack.</Text>

                    <TouchableOpacity onPress={() => router.push('/saved')} style={styles.savedLink}>
                        <Text style={styles.savedLinkText}>saved vibes →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={signOut} style={styles.signOutLink}>
                        <Text style={styles.signOutText}>sign out</Text>
                    </TouchableOpacity>

                </View>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="what's the vibe..."
                        placeholderTextColor={colors.textSecondary}
                        value={vibe}
                        onChangeText={setVibe}
                        multiline
                        maxLength={150}
                        returnKeyType="done"
                    />
                    {/* Pulsing animated button */}
                    <Animated.View style={{ transform: [{ scale: pulse }] }}>
                        <TouchableOpacity
                            style={[styles.button, !vibe.trim() && styles.buttonDisabled]}
                            onPress={handleGenerate}
                            disabled={loading || !vibe.trim()}
                            activeOpacity={0.8}
                        >
                            {loading
                                ? <ActivityIndicator color={colors.background} />
                                : <Text style={styles.buttonText}>generate</Text>
                            }
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Example vibes */}
                <View style={styles.examples}>
                    <Text style={styles.examplesLabel}>try something like</Text>
                    {EXAMPLE_VIBES.map((example) => (
                        <TouchableOpacity
                            key={example}
                            onPress={() => setVibe(example)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.exampleItem}>"{example}"</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    orb: {
        position: 'absolute',
        top: -100,
        left: -100,
        right: -100,
        height: 500,
        borderRadius: 999,
    },
    inner: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 80,
        paddingBottom: spacing.xl,
        justifyContent: 'space-between',
    },
    header: {
        gap: spacing.md,
    },
    logo: {
        fontFamily: fonts.displayItalic,
        fontSize: 42,
        color: colors.accent,
        letterSpacing: -1,
    },
    tagline: {
        fontFamily: fonts.body,
        fontSize: 18,
        color: colors.textSecondary,
        lineHeight: 26,
    },
    savedLink: {
        alignSelf: 'flex-start',
    },
    savedLinkText: {
        fontFamily: fonts.body,
        fontSize: 13,
        color: colors.textSecondary,
    },
    inputContainer: {
        gap: spacing.md,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        fontFamily: fonts.body,
        fontSize: 16,
        color: colors.textPrimary,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: colors.accent,
        borderRadius: radius.full,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: colors.background,
        letterSpacing: 0.5,
    },
    examples: {
        gap: spacing.sm,
    },
    examplesLabel: {
        fontFamily: fonts.body,
        fontSize: 12,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: spacing.xs,
    },
    exampleItem: {
        fontFamily: fonts.displayItalic,
        fontSize: 14,
        color: colors.textSecondary,
        paddingVertical: spacing.xs,
    },
    signOutLink: {
        alignSelf: 'flex-end',
    },
    signOutText: {
        fontFamily: fonts.body,
        fontSize: 13,
        color: colors.textSecondary,
    },
});