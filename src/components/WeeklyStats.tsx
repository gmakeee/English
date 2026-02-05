import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getWeeklyStats } from '../lib/userStats';
import type { ActivityDay } from '../lib/userStats';

const WeeklyStats = () => {
    const { userId } = useUser();
    const [stats, setStats] = useState<ActivityDay[]>([]);
    const [maxXP, setMaxXP] = useState(0);

    useEffect(() => {
        if (!userId) return;

        getWeeklyStats(userId).then(data => {
            // Fill in missing days
            const today = new Date();
            const filledStats: ActivityDay[] = [];

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const dayStat = data.find(d => d.activity_date === dateStr);
                filledStats.push(dayStat || { activity_date: dateStr, xp_earned: 0 });
            }

            setStats(filledStats);
            setMaxXP(Math.max(...filledStats.map(s => s.xp_earned), 10)); // Min max 10 to avoid 0 height
        });
    }, [userId]);

    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="bg-tg-secondary-bg p-6 rounded-xl border border-[--tg-theme-hint-color]/10">
            <h3 className="font-bold mb-6">Activity</h3>

            <div className="flex justify-between items-end h-32 gap-2">
                {stats.map((day) => {
                    const heightPercent = (day.xp_earned / maxXP) * 100;

                    return (
                        <div key={day.activity_date} className="flex flex-col items-center flex-1 gap-2">
                            <div className="relative w-full h-full flex items-end justify-center group">
                                {/* Tooltip */}
                                <div className="absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {day.xp_earned} XP
                                </div>

                                {/* Background bar (hatched/faded) */}
                                <div className="absolute inset-0 bg-tg-button/5 rounded-t-lg mx-1" />

                                {/* Active bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercent}%` }}
                                    className="w-full mx-1 bg-tg-button rounded-t-lg relative z-0"
                                    style={{ minHeight: day.xp_earned > 0 ? '4px' : '0' }}
                                />
                            </div>
                            <span className="text-xs text-tg-hint">{getDayName(day.activity_date)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyStats;
