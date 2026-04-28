import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../constants/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { session, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!session && !inAuthGroup) {
            router.replace('/auth/signin');
        } else if (session && inAuthGroup) {
            router.replace('/');
        }
    }, [session, loading, segments]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'fade_from_bottom',
            }}
        />
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        PlayfairDisplay_700Bold,
        PlayfairDisplay_700Bold_Italic,
        DMSans_400Regular,
        DMSans_500Medium,
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <AuthProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
        </AuthProvider>
    );
}