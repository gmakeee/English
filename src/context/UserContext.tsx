import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { hasCuteMode, hasDevMode } from '../config/specialUsers';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface UserContextType {
    user: TelegramUser | null;
    userId: string | null;
    username: string | undefined;
    firstName: string;
    isCuteMode: boolean;
    isDevMode: boolean;
    isLoading: boolean;
    streak: number;
}

const UserContext = createContext<UserContextType>({
    user: null,
    userId: null,
    username: undefined,
    firstName: 'Гость',
    isCuteMode: false,
    isDevMode: false,
    isLoading: true,
    streak: 0,
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        // Try to get user from Telegram WebApp
        const tg = (window as any).Telegram?.WebApp;

        if (tg?.initDataUnsafe?.user) {
            const tgUser = tg.initDataUnsafe.user as TelegramUser;
            setUser(tgUser);
        } else if (import.meta.env.DEV) {
            // Mock user for local development
            console.log('DEV Mode: Using mock Telegram user');
            setUser({
                id: 123456789,
                first_name: "Dev User",
                username: "gmakeee",
                language_code: "en"
            });
        }
        setIsLoading(false);
    }, []);

    // Sync profile when user is set
    useEffect(() => {
        if (!user?.id) return;

        import('../lib/userStats').then(({ syncUserProfile }) => {
            syncUserProfile(user.id.toString()).then(profile => {
                if (profile) {
                    setStreak(profile.streak_days);
                }
            });
        });
    }, [user?.id]);

    const userId = user?.id?.toString() ?? null;
    const username = user?.username ?? undefined;
    const firstName = user?.first_name || 'Гость';
    const isCuteMode = hasCuteMode(user?.id, username);
    const isDevMode = hasDevMode(user?.id, username);

    return (
        <UserContext.Provider value={{
            user,
            userId,
            username,
            firstName,
            isCuteMode,
            isDevMode,
            isLoading,
            streak,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
