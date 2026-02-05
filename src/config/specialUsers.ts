// Special users configuration
// Users who see cute/romantic interface features
export const CUTE_MODE_USERS = ['imaggedb'];

// Users who have DEV mode access (includes cute mode features)
export const DEV_MODE_USERS = ['gmakeee'];

// Check if username has cute mode access
export function hasCuteMode(username?: string): boolean {
    if (!username) return false;
    const normalizedUsername = username.toLowerCase().replace('@', '');
    return CUTE_MODE_USERS.includes(normalizedUsername) || DEV_MODE_USERS.includes(normalizedUsername);
}

// Check if username has DEV mode access
export function hasDevMode(username?: string): boolean {
    if (!username) return false;
    const normalizedUsername = username.toLowerCase().replace('@', '');
    return DEV_MODE_USERS.includes(normalizedUsername);
}
