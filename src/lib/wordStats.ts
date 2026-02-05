import { supabase } from './supabase';

interface WordStats {
    tg_uid: string;
    word_id: number;
    correct_count: number;
    wrong_count: number;
    consecutive_correct?: number;
    last_seen: string;
    is_learned: boolean;
}

// Type assertion helper since user_word_stats isn't in generated types yet
const getTable = () => supabase.from('user_word_stats' as any) as any;

/**
 * Record an answer for word stats tracking
 */
export async function recordAnswer(
    tgUid: string,
    wordId: number,
    isCorrect: boolean
): Promise<void> {
    // Try to get existing stats
    const { data: existing } = await getTable()
        .select('*')
        .eq('tg_uid', tgUid)
        .eq('word_id', wordId)
        .single() as { data: WordStats | null };

    if (existing) {
        // Update existing record
        const newCorrect = isCorrect ? existing.correct_count + 1 : existing.correct_count;
        const newWrong = isCorrect ? existing.wrong_count : existing.wrong_count + 1;
        const newConsecutive = isCorrect ? (existing.consecutive_correct || 0) + 1 : 0;



        // Logic: 
        // Learned if consecutive correct >= 3
        // (User rule: if 3 times correctly press -> learned)
        const isLearned = newConsecutive >= 3;

        await getTable()
            .update({
                correct_count: newCorrect,
                wrong_count: newWrong,
                consecutive_correct: newConsecutive,
                last_seen: new Date().toISOString(),
                is_learned: isLearned, // Can re-learn if previously unlearned? Yes.
            } as any)
            .eq('tg_uid', tgUid)
            .eq('word_id', wordId);
    } else {
        // Insert new record

        await getTable()
            .insert({
                tg_uid: tgUid,
                word_id: wordId,
                correct_count: isCorrect ? 1 : 0,
                wrong_count: isCorrect ? 0 : 1,
                consecutive_correct: isCorrect ? 1 : 0,
                last_seen: new Date().toISOString(),
                is_learned: false,
            } as any);
    }

    // Log activity (XP) for chart
    if (isCorrect) {
        // Dynamic import to avoid circular dependency issues if any
        import('./userStats').then(({ logActivity }) => {
            logActivity(tgUid, 10); // 10 XP per correct word
        });
    }
}

/**
 * Get all learned words for a user
 */
export async function getLearnedWords(tgUid: string): Promise<WordStats[]> {
    const { data, error } = await getTable()
        .select('*')
        .eq('tg_uid', tgUid)
        .eq('is_learned', true)
        .order('last_seen', { ascending: false }) as { data: WordStats[] | null; error: any };

    if (error) {
        console.error('Error fetching learned words:', error);
        return [];
    }

    return data || [];
}

/**
 * Get words with most mistakes for targeted practice
 */
export async function getMistakeWords(
    tgUid: string,
    limit: number = 20
): Promise<WordStats[]> {
    const { data, error } = await getTable()
        .select('*')
        .eq('tg_uid', tgUid)
        .gte('wrong_count', 3) // User rule: 3 mistakes -> falls to mistakes
        .eq('is_learned', false)
        .order('wrong_count', { ascending: false })
        .limit(limit) as { data: WordStats[] | null; error: any };

    if (error) {
        console.error('Error fetching mistake words:', error);
        return [];
    }

    return data || [];
}

/**
 * Get user statistics summary
 */
export async function getUserStatsSummary(tgUid: string): Promise<{
    totalWords: number;
    learnedWords: number;
    accuracy: number;
}> {
    const { data, error } = await getTable()
        .select('correct_count, wrong_count, is_learned')
        .eq('tg_uid', tgUid) as { data: WordStats[] | null; error: any };

    if (error || !data) {
        return { totalWords: 0, learnedWords: 0, accuracy: 0 };
    }

    const totalWords = data.length;
    const learnedWords = data.filter(w => w.is_learned).length;
    const totalCorrect = data.reduce((sum, w) => sum + w.correct_count, 0);
    const totalAnswers = data.reduce((sum, w) => sum + w.correct_count + w.wrong_count, 0);
    const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

    return { totalWords, learnedWords, accuracy };
}

/**
 * Clear all stats for a user (DEV only)
 */
export async function clearUserStats(tgUid: string): Promise<boolean> {
    const { error } = await getTable()
        .delete()
        .eq('tg_uid', tgUid);

    if (error) {
        console.error('Error clearing stats:', error);
        return false;
    }

    return true;
}

/**
 * Clear all stats for all users (DEV only)
 */
export async function clearAllStats(): Promise<boolean> {
    const { error } = await getTable()
        .delete()
        .neq('tg_uid', '');

    if (error) {
        console.error('Error clearing all stats:', error);
        return false;
    }

    return true;
}
