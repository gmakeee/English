import React, { useEffect } from 'react';
import BottomNav from './BottomNav';
import HeartFab from './HeartFab';
import { Toaster } from 'react-hot-toast';
import { useUser } from '../context/UserContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isCuteMode } = useUser();

    useEffect(() => {
        // Initialize Telegram Web App
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            // Ensure color scheme matches
            // tg.setHeaderColor(tg.themeParams.bg_color); // Optional polish
        }
    }, []);

    return (
        <div className="min-h-screen bg-tg-bg text-tg-text font-sans pb-20">
            <Toaster position="top-center"
                toastOptions={{
                    style: {
                        background: 'var(--tg-theme-secondary-bg-color)',
                        color: 'var(--tg-theme-text-color)',
                    }
                }}
            />
            <main className="container mx-auto px-4 py-4 max-w-md">
                {children}
            </main>
            {isCuteMode && <HeartFab />}
            <BottomNav />
        </div>
    );
};

export default Layout;
