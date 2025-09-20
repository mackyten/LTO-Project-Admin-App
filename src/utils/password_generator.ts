import * as nodeCrypto from 'crypto';

// src/utils/password_generator.ts
// GitHub Copilot
// Secure, configurable password generator

export interface PasswordOptions {
    length?: number;
    includeLower?: boolean;
    includeUpper?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    avoidAmbiguous?: boolean;
    requireEachSelectedType?: boolean;
    extraChars?: string; // any additional characters to include in the pool
}

const DEFAULTS: Required<PasswordOptions> = {
    length: 16,
    includeLower: true,
    includeUpper: true,
    includeNumbers: true,
    includeSymbols: true,
    avoidAmbiguous: true,
    requireEachSelectedType: true,
    extraChars: '',
};

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = `!@#$%^&*()-_=+[]{};:,.<>/?~\`|\\'"`;

const AMBIGUOUS = new Set(['l', 'I', '1', 'O', '0', '|', '/', '\\', '`', '"', "'"]);

function buildPools(opts: Required<PasswordOptions>) {
    const pools: string[] = [];
    if (opts.includeLower) pools.push(LOWER);
    if (opts.includeUpper) pools.push(UPPER);
    if (opts.includeNumbers) pools.push(NUMBERS);
    if (opts.includeSymbols) pools.push(SYMBOLS);
    if (opts.extraChars) pools.push(opts.extraChars);

    let combined = pools.join('');
    if (opts.avoidAmbiguous) {
        combined = Array.from(combined).filter((c) => !AMBIGUOUS.has(c)).join('');
    }
    return { pools, combined };
}

// cross-env secure random int [0, maxExclusive)
function secureRandomInt(maxExclusive: number): number {
    if (maxExclusive <= 0) throw new Error('maxExclusive must be > 0');

    // Try Web Crypto
        const globalWithCrypto = globalThis as unknown as { crypto?: { getRandomValues: (arr: Uint32Array) => void } };
        const globalCrypto = globalWithCrypto.crypto;
        if (globalCrypto && typeof globalCrypto.getRandomValues === 'function') {
            const uint32 = new Uint32Array(1);
            const maxUint32 = 0xffffffff;
            const range = maxExclusive;
            const limit = Math.floor((maxUint32 + 1) / range) * range;
            while (true) {
                globalCrypto.getRandomValues(uint32);
                const r = uint32[0];
                if (r < limit) return r % range;
            }
        }

    // Try Node crypto
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const buf = Buffer.allocUnsafe(4);
        const range = maxExclusive;
        const maxUint32 = 0xffffffff;
        const limit = Math.floor((maxUint32 + 1) / range) * range;
        while (true) {
            nodeCrypto.randomFillSync(buf);
            const r = buf.readUInt32LE(0);
            if (r < limit) return r % range;
        }
    } catch {
        // fallback insecure Math.random (very last resort)
        return Math.floor(Math.random() * maxExclusive);
    }
}

export function generatePassword(options?: PasswordOptions): string {
    const opts: Required<PasswordOptions> = { ...DEFAULTS, ...(options || {}) };

    const { pools, combined } = buildPools(opts);

    if (!combined) throw new Error('No characters available to build password. Enable at least one character type or provide extraChars.');

    if (opts.length <= 0) throw new Error('Password length must be greater than 0.');

    const out: string[] = [];

    // If requiring at least one char from each selected pool, reserve slots
    const requiredChars: string[] = [];
    if (opts.requireEachSelectedType) {
        for (const pool of pools) {
            // skip empty pools (e.g., extraChars could be empty)
            let candidatePool = pool;
            if (opts.avoidAmbiguous) {
                candidatePool = Array.from(candidatePool).filter((c) => !AMBIGUOUS.has(c)).join('');
            }
            if (!candidatePool) continue;
            const idx = secureRandomInt(candidatePool.length);
            requiredChars.push(candidatePool[idx]);
        }
    }

    const remaining = opts.length - requiredChars.length;
    for (let i = 0; i < remaining; i++) {
        const idx = secureRandomInt(combined.length);
        out.push(combined[idx]);
    }

    // insert required chars and shuffle to avoid predictable positions
    const finalChars = out.concat(requiredChars);
    // Fisher-Yates shuffle using secureRandomInt
    for (let i = finalChars.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        const tmp = finalChars[i];
        finalChars[i] = finalChars[j];
        finalChars[j] = tmp;
    }

    return finalChars.join('');
}

export default generatePassword;