// Free Dictionary API - No key required
// Docs: https://dictionaryapi.dev/

export interface DictionaryEntry {
    word: string;
    phonetic?: string;
    phonetics: {
        text?: string;
        audio?: string;
    }[];
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example?: string;
            synonyms?: string[];
            antonyms?: string[];
        }[];
    }[];
}

/**
 * Get full dictionary entry for a word
 */
export async function getWordDetails(word: string): Promise<DictionaryEntry | null> {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );
        if (!response.ok) return null;
        const data: DictionaryEntry[] = await response.json();
        return data[0] || null;
    } catch (error) {
        console.error('Dictionary API error:', error);
        return null;
    }
}

/**
 * Get the definition of a word
 */
export async function getDefinition(word: string): Promise<string | null> {
    const entry = await getWordDetails(word);
    if (!entry || !entry.meanings.length) return null;
    return entry.meanings[0].definitions[0]?.definition || null;
}

/**
 * Get example sentence for a word
 */
export async function getExample(word: string): Promise<string | null> {
    const entry = await getWordDetails(word);
    if (!entry) return null;

    for (const meaning of entry.meanings) {
        for (const def of meaning.definitions) {
            if (def.example) return def.example;
        }
    }
    return null;
}

/**
 * Get audio pronunciation URL
 */
export async function getAudioUrl(word: string): Promise<string | null> {
    const entry = await getWordDetails(word);
    if (!entry) return null;

    for (const phonetic of entry.phonetics) {
        if (phonetic.audio) return phonetic.audio;
    }
    return null;
}

/**
 * Play pronunciation of a word (using API audio if available, fallback to TTS)
 */
export async function pronounceWord(word: string): Promise<void> {
    const audioUrl = await getAudioUrl(word);

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
    } else {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}
