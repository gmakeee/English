import { IMPORTED_WORDS as A2_DECK } from './imported_words_a2';
import { IMPORTED_WORDS as B1_DECK } from './imported_words_b1';
import { IMPORTED_WORDS as B2_DECK } from './imported_words_b2';

// A2/B1 Level Word Database
// Words with Russian translations and example sentences

export interface Word {
    id: number;
    word: string;
    translation: string;
    example: string;
    options: string[]; // 4 options including correct answer
}

const MANUAL_WORDS: Word[] = [
    // Common Verbs
    { id: 1, word: "achieve", translation: "достигать", example: "She worked hard to achieve her goals.", options: ["достигать", "терять", "забывать", "начинать"] },
    { id: 2, word: "allow", translation: "разрешать", example: "My parents allow me to stay up late.", options: ["запрещать", "разрешать", "просить", "требовать"] },
    { id: 3, word: "appear", translation: "появляться", example: "The sun appeared from behind the clouds.", options: ["исчезать", "появляться", "светить", "прятаться"] },
    { id: 4, word: "avoid", translation: "избегать", example: "I try to avoid eating junk food.", options: ["избегать", "любить", "искать", "пробовать"] },
    { id: 5, word: "believe", translation: "верить", example: "I believe you can do it!", options: ["сомневаться", "верить", "спрашивать", "думать"] },
    { id: 6, word: "belong", translation: "принадлежать", example: "This book belongs to my sister.", options: ["принадлежать", "покупать", "продавать", "дарить"] },
    { id: 7, word: "borrow", translation: "занимать", example: "Can I borrow your pen?", options: ["одалживать", "занимать", "красть", "терять"] },
    { id: 8, word: "breathe", translation: "дышать", example: "Take a moment to breathe deeply.", options: ["дышать", "спать", "есть", "пить"] },
    { id: 9, word: "cancel", translation: "отменять", example: "They had to cancel the concert.", options: ["начинать", "отменять", "планировать", "переносить"] },
    { id: 10, word: "celebrate", translation: "праздновать", example: "We celebrate New Year with family.", options: ["праздновать", "работать", "грустить", "спать"] },

    // Common Adjectives
    { id: 11, word: "anxious", translation: "тревожный", example: "She felt anxious before the exam.", options: ["спокойный", "тревожный", "счастливый", "усталый"] },
    { id: 12, word: "available", translation: "доступный", example: "Is this seat available?", options: ["занятый", "доступный", "сломанный", "новый"] },
    { id: 13, word: "brave", translation: "смелый", example: "The brave firefighter saved the cat.", options: ["смелый", "трусливый", "злой", "добрый"] },
    { id: 14, word: "calm", translation: "спокойный", example: "Stay calm and don't panic.", options: ["нервный", "спокойный", "злой", "грустный"] },
    { id: 15, word: "careful", translation: "осторожный", example: "Be careful when crossing the street.", options: ["осторожный", "быстрый", "глупый", "смелый"] },
    { id: 16, word: "confident", translation: "уверенный", example: "She is confident in her abilities.", options: ["неуверенный", "уверенный", "грустный", "злой"] },
    { id: 17, word: "curious", translation: "любопытный", example: "The curious child asked many questions.", options: ["скучный", "любопытный", "тихий", "громкий"] },
    { id: 18, word: "delicious", translation: "вкусный", example: "This cake is absolutely delicious!", options: ["вкусный", "ужасный", "солёный", "кислый"] },
    { id: 19, word: "disappointed", translation: "разочарованный", example: "I was disappointed by the movie.", options: ["счастливый", "разочарованный", "удивлённый", "злой"] },
    { id: 20, word: "enormous", translation: "огромный", example: "They live in an enormous house.", options: ["маленький", "огромный", "старый", "новый"] },

    // Common Nouns
    { id: 21, word: "advantage", translation: "преимущество", example: "Speaking English is a big advantage.", options: ["недостаток", "преимущество", "проблема", "вопрос"] },
    { id: 22, word: "adventure", translation: "приключение", example: "Our trip was a real adventure.", options: ["скука", "приключение", "работа", "отдых"] },
    { id: 23, word: "advice", translation: "совет", example: "Can you give me some advice?", options: ["совет", "приказ", "вопрос", "ответ"] },
    { id: 24, word: "attitude", translation: "отношение", example: "She has a positive attitude.", options: ["отношение", "настроение", "характер", "мнение"] },
    { id: 25, word: "behavior", translation: "поведение", example: "His behavior was unacceptable.", options: ["поведение", "одежда", "внешность", "голос"] },
    { id: 26, word: "challenge", translation: "вызов", example: "Learning a new language is a challenge.", options: ["вызов", "отдых", "награда", "наказание"] },
    { id: 27, word: "childhood", translation: "детство", example: "I have happy memories of my childhood.", options: ["старость", "детство", "юность", "зрелость"] },
    { id: 28, word: "community", translation: "сообщество", example: "Our community is very friendly.", options: ["сообщество", "семья", "компания", "страна"] },
    { id: 29, word: "conversation", translation: "разговор", example: "We had an interesting conversation.", options: ["молчание", "разговор", "спор", "крик"] },
    { id: 30, word: "decision", translation: "решение", example: "It was a difficult decision to make.", options: ["решение", "проблема", "вопрос", "ответ"] },

    // More Verbs
    { id: 31, word: "complain", translation: "жаловаться", example: "He always complains about the weather.", options: ["хвалить", "жаловаться", "спрашивать", "отвечать"] },
    { id: 32, word: "contain", translation: "содержать", example: "This box contains old photos.", options: ["содержать", "терять", "искать", "прятать"] },
    { id: 33, word: "continue", translation: "продолжать", example: "Let's continue our lesson.", options: ["заканчивать", "продолжать", "начинать", "останавливать"] },
    { id: 34, word: "describe", translation: "описывать", example: "Can you describe your apartment?", options: ["описывать", "показывать", "прятать", "искать"] },
    { id: 35, word: "develop", translation: "развивать", example: "We need to develop new skills.", options: ["развивать", "терять", "забывать", "игнорировать"] },
    { id: 36, word: "discover", translation: "открывать", example: "Scientists discover new things every day.", options: ["закрывать", "открывать", "прятать", "терять"] },
    { id: 37, word: "encourage", translation: "поощрять", example: "Teachers encourage students to ask questions.", options: ["наказывать", "поощрять", "игнорировать", "критиковать"] },
    { id: 38, word: "expect", translation: "ожидать", example: "I expect you to be on time.", options: ["ожидать", "забывать", "игнорировать", "сомневаться"] },
    { id: 39, word: "explain", translation: "объяснять", example: "Can you explain this rule?", options: ["спрашивать", "объяснять", "молчать", "слушать"] },
    { id: 40, word: "improve", translation: "улучшать", example: "I want to improve my English.", options: ["ухудшать", "улучшать", "забывать", "игнорировать"] },

    // More Adjectives
    { id: 41, word: "essential", translation: "необходимый", example: "Water is essential for life.", options: ["ненужный", "необходимый", "опасный", "редкий"] },
    { id: 42, word: "excellent", translation: "отличный", example: "You did an excellent job!", options: ["ужасный", "отличный", "обычный", "скучный"] },
    { id: 43, word: "exhausted", translation: "измождённый", example: "I'm exhausted after the long trip.", options: ["бодрый", "измождённый", "счастливый", "злой"] },
    { id: 44, word: "fascinating", translation: "увлекательный", example: "The documentary was fascinating.", options: ["скучный", "увлекательный", "короткий", "длинный"] },
    { id: 45, word: "fortunate", translation: "удачливый", example: "We were fortunate to find tickets.", options: ["неудачливый", "удачливый", "грустный", "злой"] },
    { id: 46, word: "generous", translation: "щедрый", example: "He is very generous with his time.", options: ["жадный", "щедрый", "бедный", "богатый"] },
    { id: 47, word: "grateful", translation: "благодарный", example: "I'm grateful for your help.", options: ["неблагодарный", "благодарный", "злой", "грустный"] },
    { id: 48, word: "honest", translation: "честный", example: "She is always honest with me.", options: ["лживый", "честный", "скрытный", "злой"] },
    { id: 49, word: "incredible", translation: "невероятный", example: "The view was absolutely incredible.", options: ["обычный", "невероятный", "скучный", "маленький"] },
    { id: 50, word: "independent", translation: "независимый", example: "She is very independent.", options: ["зависимый", "независимый", "слабый", "глупый"] },
];

// Re-map IDs to avoid conflicts
// A2: 10000+
// B1: 20000+
// B2: 30000+
const A2_MAPPED = A2_DECK.map(w => ({ ...w, id: 10000 + w.id }));
const B1_MAPPED = B1_DECK.map(w => ({ ...w, id: 20000 + w.id }));
const B2_MAPPED = B2_DECK.map(w => ({ ...w, id: 30000 + w.id }));

export const WORDS_A2_B1: Word[] = [
    ...MANUAL_WORDS,
    ...A2_MAPPED,
    ...B1_MAPPED,
    ...B2_MAPPED
];

// Sentences for Fill-in-the-Blank game
export interface SentenceGap {
    id: number;
    sentence: string; // Use ___ for the gap
    correctWord: string;
    options: string[];
}

export const SENTENCES_FILL_GAP: SentenceGap[] = [
    { id: 1, sentence: "I need to ___ my English skills.", correctWord: "improve", options: ["improve", "forget", "ignore", "lose"] },
    { id: 2, sentence: "She was ___ to hear the good news.", correctWord: "delighted", options: ["sad", "delighted", "angry", "bored"] },
    { id: 3, sentence: "Can you ___ the situation to me?", correctWord: "explain", options: ["explain", "hide", "forget", "ignore"] },
    { id: 4, sentence: "The movie was absolutely ___.", correctWord: "fascinating", options: ["boring", "fascinating", "short", "quiet"] },
    { id: 5, sentence: "I'm ___ for all your help.", correctWord: "grateful", options: ["angry", "grateful", "sad", "tired"] },
    { id: 6, sentence: "We need to make a ___ soon.", correctWord: "decision", options: ["mistake", "decision", "problem", "question"] },
    { id: 7, sentence: "She has a very positive ___.", correctWord: "attitude", options: ["attitude", "problem", "mistake", "question"] },
    { id: 8, sentence: "This is an ___ opportunity.", correctWord: "excellent", options: ["terrible", "excellent", "boring", "small"] },
    { id: 9, sentence: "He is very ___ with his money.", correctWord: "generous", options: ["greedy", "generous", "poor", "angry"] },
    { id: 10, sentence: "Learning a new language is a ___.", correctWord: "challenge", options: ["rest", "challenge", "game", "joke"] },
    { id: 11, sentence: "I ___ in your abilities.", correctWord: "believe", options: ["doubt", "believe", "forget", "ignore"] },
    { id: 12, sentence: "The children were very ___ about the trip.", correctWord: "excited", options: ["bored", "excited", "sad", "angry"] },
    { id: 13, sentence: "Please ___ carefully when crossing the road.", correctWord: "look", options: ["run", "look", "jump", "sleep"] },
    { id: 14, sentence: "She ___ to the music quietly.", correctWord: "listened", options: ["spoke", "listened", "shouted", "sang"] },
    { id: 15, sentence: "We ___ the party last night.", correctWord: "enjoyed", options: ["hated", "enjoyed", "forgot", "missed"] },
];

// Words for Dictation (listening) game - simpler words
export const DICTATION_WORDS = [
    "beautiful", "important", "different", "interesting", "comfortable",
    "wonderful", "dangerous", "necessary", "impossible", "incredible",
    "available", "expensive", "delicious", "fantastic", "excellent",
    "adventure", "chocolate", "hospital", "restaurant", "apartment",
    "yesterday", "tomorrow", "together", "remember", "understand",
];

// Helper function to shuffle array
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Helper to ensure word has valid options
function ensureOptions(word: Word, allWords: Word[]): Word {
    // Check if options are valid (not placeholders and length is 4)
    const validOptions = word.options &&
        word.options.length === 4 &&
        !word.options.includes("...") &&
        new Set(word.options).size === 4;

    if (validOptions) return word;

    // Generate new options
    const correctScale = word.translation;
    const otherWords = allWords.filter(w => w.id !== word.id);
    const randomWrong = shuffleArray(otherWords).slice(0, 3).map(w => w.translation);

    // Combine and shuffle
    const newOptions = shuffleArray([correctScale, ...randomWrong]);

    return { ...word, options: newOptions };
}

// Get random words for quiz with hydrated options
export function getRandomWords(count: number): Word[] {
    const shuffled = shuffleArray(WORDS_A2_B1);
    const selected = shuffled.slice(0, count);

    // Ensure all selected words have valid options
    return selected.map(w => ensureOptions(w, WORDS_A2_B1));
}

// Get random sentences for fill-gap game
export function getRandomSentences(count: number): SentenceGap[] {
    return shuffleArray(SENTENCES_FILL_GAP).slice(0, count);
}

// Get random dictation words
export function getRandomDictationWords(count: number): string[] {
    return shuffleArray(DICTATION_WORDS).slice(0, count);
}
