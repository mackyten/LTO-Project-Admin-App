// /Users/angelo/Desktop/The LTO Project/admin_auto_fine/src/utils/enforcer_id_generator.ts

/**
 * Generates a unique Enforcer ID that embeds the month and year.
 * Format: ENF-YYYYMM-<8_random_chars>
 *
 * Examples:
 *  - ENF-202509-a1b2c3d4
 *
 * The prefix is based on the provided date (UTC by default),
 * and the random suffix ensures uniqueness.
 */

/**
 * Generate an enforcer ID.
 * @param date Optional Date to base the YYYYMM prefix on. Defaults to now (UTC).
 */
export function generateEnforcerId(date: Date = new Date()): string {
    // Use UTC year/month to avoid timezone surprises
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const prefix = `ENF-${year}${month}`;

    // Browser-safe random string (base62, length 8)
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    const array = new Uint8Array(8);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(array);
        for (let i = 0; i < array.length; i++) {
            rand += chars[array[i] % chars.length];
        }
    } else {
        // fallback for environments without crypto
        for (let i = 0; i < 8; i++) {
            rand += chars[Math.floor(Math.random() * chars.length)];
        }
    }

    return `${prefix}-${rand}`;
}

export default generateEnforcerId;