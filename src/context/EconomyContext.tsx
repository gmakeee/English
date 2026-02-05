import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface EconomyContextType {
    balance: number;
    updateBalance: (amount: number) => Promise<void>;
    isLoading: boolean;
}

const EconomyContext = createContext<EconomyContextType | undefined>(undefined);

export const EconomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [balance, setBalance] = useState(100);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Force type/query to bypass inference issue if present
                const { data } = await supabase
                    .from('profiles')
                    .select('balance')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setBalance((data as any).balance);
                }
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateBalance = async (amount: number) => {
        const newBalance = balance + amount;
        setBalance(newBalance);

        // Sync with DB
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await (supabase.from('profiles') as any).update({ balance: newBalance }).eq('id', user.id);
        }
    };

    return (
        <EconomyContext.Provider value={{ balance, updateBalance, isLoading }}>
            {children}
        </EconomyContext.Provider>
    );
};

export const useEconomy = () => {
    const context = useContext(EconomyContext);
    if (!context) throw new Error('useEconomy must be used within an EconomyProvider');
    return context;
};
