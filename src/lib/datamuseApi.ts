// Datamuse API - Completely FREE, no key required
// Docs: https://www.datamuse.com/api/

export interface DatamuseWord {
    word: string;
    score: number;
    tags?: string[]; // e.g., ["n"] for noun
}

/**
 * Get words that mean similar to the input word (synonyms)
 */
export async function getSynonyms(word: string): Promise<string[]> {
    try {
        const response = await fetch(
            `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=10`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(w => w.word);
    } catch (error) {
        console.error('Datamuse synonyms error:', error);
        return [];
    }
}

/**
 * Get words that rhyme with the input word
 */
export async function getRhymes(word: string): Promise<string[]> {
    try {
        const response = await fetch(
            `https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=10`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(w => w.word);
    } catch (error) {
        console.error('Datamuse rhymes error:', error);
        return [];
    }
}

/**
 * Get words that are often used in the same context
 */
export async function getRelatedWords(word: string): Promise<string[]> {
    try {
        const response = await fetch(
            `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=10`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(w => w.word);
    } catch (error) {
        console.error('Datamuse related error:', error);
        return [];
    }
}

/**
 * Get words that sound like the input (for spelling hints)
 */
export async function getSoundsLike(word: string): Promise<string[]> {
    try {
        const response = await fetch(
            `https://api.datamuse.com/words?sl=${encodeURIComponent(word)}&max=5`
        );
        if (!response.ok) return [];
        const data: DatamuseWord[] = await response.json();
        return data.map(w => w.word);
    } catch (error) {
        console.error('Datamuse sounds-like error:', error);
        return [];
    }
}

/**
 * Generate wrong options for quiz based on related/similar words
 */
export async function generateWrongOptions(correctWord: string, count: number = 3): Promise<string[]> {
    const related = await getRelatedWords(correctWord);
    // Shuffle and take first N
    const shuffled = related.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
