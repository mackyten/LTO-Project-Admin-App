/**
 * /Users/angelo/Desktop/The LTO Project/admin_auto_fine/src/utils/query_key_generator.ts
 *
 * Generates progressive uppercase prefixes of a given string.
 *
 * Example:
 *   generateQueryKeyPrefixes("Angelo ME")
 *   // -> ["A","AN","ANG","ANGE","ANGEL","ANGELO","ANGELO M","ANGELO ME"]
 */

export function generateQueryKeyPrefixes(input: string): string[] {
    const normalized = String(input ?? '').trim();
    if (normalized.length === 0) return [];

    const upper = normalized.toUpperCase();
    const prefixes: string[] = [];
    for (let i = 1; i <= upper.length; i++) {
        prefixes.push(upper.slice(0, i));
    }
    return prefixes;
}

export default generateQueryKeyPrefixes;