import { useState, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

interface BossContextType {
    bossHP: number;
    damageBoss: () => void;
    resetBoss: () => void;
    isDefeated: boolean;
}

const BossContext = createContext<BossContextType | undefined>(undefined);

export const BossProvider = ({ children }: { children: ReactNode }) => {
    // We need user ID to save boss HP. But BossProvider might be OUTSIDE UserProvider?
    // Usually providers provided in App.tsx. UserProvider should wrap BossProvider generally.
    // Let's assume UserProvider > BossProvider.
    // We can't import useUser here if validation fails, so let's import the context directly or assume ID passed?
    // Better: Make BossProvider consume UserContext.

    // Actually, to avoid circular deps or complex refactors, let's just use `(window as any).Telegram...` or similar if needed, 
    // BUT strictly, we should use useUser().
    // Let's try importing useUser.

    const [bossHP, setBossHP] = useState(100); // Start with 100 for persistence logic (or 5?) 
    // User asked for "Boss HP kept in DB".
    const [isDefeated, setIsDefeated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        // Wait for user ID to be available
        const checkUser = async () => {
            // We can duplicate the logic or better, wait for UserContext?
            // Simplest: Check window.Telegram or wait.
            // But we are inside React.

            // Dynamic import to avoid cycles?
            const { supabase } = await import('../lib/supabase');

            // Try to get user from local dev or telegram
            const tg = (window as any).Telegram?.WebApp;
            let uid = tg?.initDataUnsafe?.user?.id?.toString();

            if (!uid && import.meta.env.DEV) uid = '123456789';

            if (uid) {
                setUserId(uid);
                const { data } = await (supabase.from('user_profiles' as any) as any)
                    .select('boss_hp')
                    .eq('tg_uid', uid)
                    .single();

                if (data) {
                    setBossHP(data.boss_hp);
                    if (data.boss_hp <= 0) setIsDefeated(true);
                }
            }
        };
        checkUser();
    }, []);

    const damageBoss = () => {
        if (isDefeated) return;

        setBossHP(prev => {
            const newHP = Math.max(0, prev - 1);
            if (newHP <= 0) setIsDefeated(true);

            // Persist
            if (userId) {
                import('../lib/userStats').then(({ updateBossHP }) => {
                    updateBossHP(userId, newHP);
                });
            }
            return newHP;
        });
    };

    const resetBoss = () => {
        const newHP = 100; // Reset to full? Or 5? User didn't specify reset amount, but usually full.
        setBossHP(newHP);
        setIsDefeated(false);
        if (userId) {
            import('../lib/userStats').then(({ updateBossHP }) => {
                updateBossHP(userId, newHP);
            });
        }
    };

    return (
        <BossContext.Provider value={{ bossHP, damageBoss, resetBoss, isDefeated }}>
            {children}
        </BossContext.Provider>
    );
};

export const useBoss = () => {
    const context = useContext(BossContext);
    if (!context) throw new Error('useBoss must be used within BossProvider');
    return context;
};
