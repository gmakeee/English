// Special users configuration
// Users who see cute/romantic interface features
export const CUTE_MODE_USERNAMES = ['imaggedb'];
export const CUTE_MODE_IDS: number[] = [];

// Users who have DEV mode access (includes cute mode features)
export const DEV_MODE_USERNAMES = ['gmakeee'];
export const DEV_MODE_IDS = [475065505]; // Added your ID

// Check if user has cute mode access
export function hasCuteMode(id?: number, username?: string): boolean {
    if (id && CUTE_MODE_IDS.includes(id)) return true;
    if (id && DEV_MODE_IDS.includes(id)) return true; // Devs get cute mode too

    if (username) {
        const normalized = username.toLowerCase().replace('@', '');
        return CUTE_MODE_USERNAMES.includes(normalized) || DEV_MODE_USERNAMES.includes(normalized);
    }
    return false;
}

// Check if user has DEV mode access
export function hasDevMode(id?: number, username?: string): boolean {
    if (id && DEV_MODE_IDS.includes(id)) return true;

    if (username) {
        const normalized = username.toLowerCase().replace('@', '');
        return DEV_MODE_USERNAMES.includes(normalized);
    }
    return false;
}
