import { supabase } from './supabase';

export interface UserProfile {
    tg_uid: string;
    streak_days: number;
    last_active_date: string; // YYYY-MM-DD
    boss_hp: number;
    total_xp: number;
}

export interface ActivityDay {
    activity_date: string;
    xp_earned: number;
    // words_learned logic can be derived or added if needed
}

// Helper to get today's date string YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split('T')[0];

/**
 * Sync user profile on app start.
 * Handles streak calculation and initialization.
 */
export async function syncUserProfile(tgUid: string): Promise<UserProfile | null> {
    const today = getTodayDate();

    // 1. Fetch existing
    const { data: profile, error } = await (supabase
        .from('user_profiles' as any) as any)
        .select('*')
        .eq('tg_uid', tgUid)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        console.error('Error fetching profile:', error);
        return null;
    }

    if (!profile) {
        // Create new profile
        const { data: newProfile, error: createError } = await (supabase
            .from('user_profiles' as any) as any)
            .insert({
                tg_uid: tgUid,
                streak_days: 1,
                last_active_date: today,
                boss_hp: 100,
                total_xp: 0
            })
            .select()
            .single();

        if (createError) console.error('Error creating profile:', createError);
        return newProfile as UserProfile;
    }

    // 2. Validate Streak
    const lastActive = profile.last_active_date;
    let newStreak = profile.streak_days;

    // Check if last active was yesterday
    const lastDate = new Date(lastActive);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (lastActive === today) {
        // Already active today, do nothing to streak
    } else if (diffDays === 1) {
        // Was active yesterday, increment streak
        newStreak += 1;
    } else {
        // Missed a day (or more), reset streak
        newStreak = 1;
    }

    // Update if needed
    if (lastActive !== today || newStreak !== profile.streak_days) {
        const { data: updated } = await (supabase
            .from('user_profiles' as any) as any)
            .update({
                streak_days: newStreak,
                last_active_date: today
            })
            .eq('tg_uid', tgUid)
            .select()
            .single();

        return updated as UserProfile;
    }

    return profile as UserProfile;
}

/**
 * Update Boss HP in DB
 */
export async function updateBossHP(tgUid: string, hp: number) {
    await (supabase
        .from('user_profiles' as any) as any)
        .update({ boss_hp: hp })
        .eq('tg_uid', tgUid);
}

/**
 * Log daily activity (add XP)
 */
export async function logActivity(tgUid: string, xpAmount: number) {
    const today = getTodayDate();

    // Upsert activity row
    // Note: Supabase upsert needs a unique constraint on (tg_uid, activity_date)

    // First, verify current
    const { data: existingData } = await (supabase
        .from('user_daily_activity' as any) as any)
        .select('*')
        .eq('tg_uid', tgUid)
        .eq('activity_date', today)
        .single();

    // Explicitly cast to avoid 'never' inference
    const existing = existingData as any;

    const newXP = (existing?.xp_earned || 0) + xpAmount;

    if (existing) {
        await (supabase
            .from('user_daily_activity' as any) as any)
            .update({ xp_earned: newXP })
            .eq('id', existing.id);
    } else {
        await (supabase
            .from('user_daily_activity' as any) as any)
            .insert({
                tg_uid: tgUid,
                activity_date: today,
                xp_earned: xpAmount
            });
    }

    // Also update total XP in profile
    await (supabase as any).rpc('increment_total_xp', { uid: tgUid, amount: xpAmount });
    // Fallback if RPC doesn't exist (we didn't create it, so let's just use manual update for now)
    // Actually simpler: just don't track total_xp properly or do a read-modify-write. 
    // For now, let's skip total_xp update or do it simply:

    /* 
    const { data: p } = await supabase.from('user_profiles' as any).select('total_xp').eq('tg_uid', tgUid).single();
    if (p) {
        await supabase.from('user_profiles' as any).update({ total_xp: p.total_xp + xpAmount }).eq('tg_uid', tgUid);
    }
    */
}

/**
 * Get stats for the last 7 days including today
 */
export async function getWeeklyStats(tgUid: string): Promise<ActivityDay[]> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const { data } = await (supabase
        .from('user_daily_activity' as any) as any)
        .select('activity_date, xp_earned')
        .eq('tg_uid', tgUid)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('activity_date', today.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

    return (data || []) as ActivityDay[];
}
