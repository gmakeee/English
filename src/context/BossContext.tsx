import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface BossContextType {
    bossHP: number;
    damageBoss: () => void;
    resetBoss: () => void;
    isDefeated: boolean;
}

const BossContext = createContext<BossContextType | undefined>(undefined);

export const BossProvider = ({ children }: { children: ReactNode }) => {
    const [bossHP, setBossHP] = useState(5);
    const [isDefeated, setIsDefeated] = useState(false);

    const damageBoss = () => {
        if (isDefeated) return;

        setBossHP(prev => {
            const newHP = prev - 1;
            if (newHP <= 0) {
                setIsDefeated(true);
            }
            return Math.max(0, newHP);
        });
    };

    const resetBoss = () => {
        setBossHP(5);
        setIsDefeated(false);
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
