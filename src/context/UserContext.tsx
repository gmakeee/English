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
}

const UserContext = createContext<UserContextType>({
    user: null,
    userId: null,
    username: undefined,
    firstName: 'Гость',
    isCuteMode: false,
    isDevMode: false,
    isLoading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Try to get user from Telegram WebApp
        const tg = (window as any).Telegram?.WebApp;

        if (tg?.initDataUnsafe?.user) {
            const tgUser = tg.initDataUnsafe.user as TelegramUser;
            setUser(tgUser);
        }

        setIsLoading(false);
    }, []);

    const userId = user?.id?.toString() ?? null;
    const username = user?.username ?? undefined;
    const firstName = user?.first_name || 'Гость';
    const isCuteMode = hasCuteMode(username);
    const isDevMode = hasDevMode(username);

    return (
        <UserContext.Provider value={{
            user,
            userId,
            username,
            firstName,
            isCuteMode,
            isDevMode,
            isLoading,
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
