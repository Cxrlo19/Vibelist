import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'vibelist_session';

export interface User {
    id: string;
    email: string;
}

export interface Session {
    access_token: string;
    user: User;
}

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const raw = await AsyncStorage.getItem(SESSION_KEY);
            if (raw) setSession(JSON.parse(raw));
        } catch { }
        finally { setLoading(false); }
    };

    const signIn = async (email: string, password: string) => {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Sign in failed');

        const newSession: Session = {
            access_token: data.session.access_token,
            user: { id: data.user.id, email: data.user.email },
        };

        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        setSession(newSession);
        return newSession;
    };

    const signUp = async (email: string, password: string) => {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Sign up failed');
        return data;
    };

    const signOut = async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        setSession(null);
    };

    return { session, loading, signIn, signUp, signOut };
}