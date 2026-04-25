import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

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
        <>
        <StatusBar style= "light" />
        <Stack
        screenOptions={
        {
            headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            animation: 'fade_from_bottom',
        }
    }
      />
        </>
  );
}