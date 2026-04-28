import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing, radius } from '../../constants/theme';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) return;
        setLoading(true);
        try {
            await signIn(email.trim(), password);
            router.replace('/');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
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
                <View style={styles.header}>
                    <Text style={styles.logo}>vibelist</Text>
                    <Text style={styles.tagline}>welcome back</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        placeholderTextColor={colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={[styles.button, (!email.trim() || !password.trim()) && styles.buttonDisabled]}
                        onPress={handleSignIn}
                        disabled={loading || !email.trim() || !password.trim()}
                        activeOpacity={0.8}
                    >
                        {loading
                            ? <ActivityIndicator color={colors.background} />
                            : <Text style={styles.buttonText}>sign in</Text>
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                    <Text style={styles.switchText}>
                        don't have an account? <Text style={styles.switchLink}>sign up</Text>
                    </Text>
                </TouchableOpacity>
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
    },
    form: {
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
    },
    button: {
        backgroundColor: colors.accent,
        borderRadius: radius.full,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginTop: spacing.sm,
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
    switchText: {
        fontFamily: fonts.body,
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    switchLink: {
        color: colors.accent,
        fontFamily: fonts.bodyMedium,
    },
});