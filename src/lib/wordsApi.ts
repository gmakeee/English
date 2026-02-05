// WordsAPI Service
// Free tier: 2,500 requests/day via RapidAPI

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'wordsapiv1.p.rapidapi.com';

export interface WordDetails {
    word: string;
    results?: {
        definition: string;
        partOfSpeech: string;
        synonyms?: string[];
        examples?: string[];
    }[];
    pronunciation?: {
        all?: string;
    };
    syllables?: {
        count: number;
        list: string[];
    };
}

export async function getWordDetails(word: string): Promise<WordDetails | null> {
    if (!RAPIDAPI_KEY) {
        console.warn('RAPIDAPI_KEY not set, WordsAPI disabled');
        return null;
    }

    try {
        const response = await fetch(`https://${RAPIDAPI_HOST}/words/${encodeURIComponent(word)}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST,
            },
        });

        if (!response.ok) {
            console.error('WordsAPI error:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('WordsAPI fetch error:', error);
        return null;
    }
}

export async function getRandomWord(): Promise<WordDetails | null> {
    if (!RAPIDAPI_KEY) {
        return null;
    }

    try {
        const response = await fetch(`https://${RAPIDAPI_HOST}/words/?random=true`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST,
            },
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('WordsAPI random word error:', error);
        return null;
    }
}

export async function getSynonyms(word: string): Promise<string[]> {
    if (!RAPIDAPI_KEY) {
        return [];
    }

    try {
        const response = await fetch(`https://${RAPIDAPI_HOST}/words/${encodeURIComponent(word)}/synonyms`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST,
            },
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.synonyms || [];
    } catch (error) {
        console.error('WordsAPI synonyms error:', error);
        return [];
    }
}
