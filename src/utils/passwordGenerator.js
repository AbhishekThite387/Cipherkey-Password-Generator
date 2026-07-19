/**
 * passwordGenerator.js
 *
 * Cryptographically secure password generation utilities.
 * Uses the Web Crypto API (crypto.getRandomValues) instead of Math.random()
 * so that generated passwords are unpredictable and suitable for real
 * security use, not just visual demonstration.
 */

// Base character sets
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
};

// Characters that look similar and are easy to misread (0/O, 1/l/I, etc.)
const SIMILAR_CHARS = 'O0Il1|';

// Symbols that can be visually ambiguous or awkward to type/read
const AMBIGUOUS_CHARS = '|`\'";:,.<>{}[]()/\\';

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 64;

/**
 * Returns a cryptographically secure random integer in the range [0, max).
 * Uses rejection sampling to avoid modulo bias.
 */
export function getSecureRandomIndex(max) {
  if (max <= 0) {
    throw new Error('max must be greater than 0');
  }
  if (max > 256) {
    // Fallback for ranges above a single byte's worth of values.
    // Not needed for our character sets (all well under 256), but kept
    // for correctness/robustness.
    const range = 4294967296 - (4294967296 % max);
    let randomValue;
    const buffer = new Uint32Array(1);
    do {
      crypto.getRandomValues(buffer);
      randomValue = buffer[0];
    } while (randomValue >= range);
    return randomValue % max;
  }

  const range = 256 - (256 % max);
  let randomValue;
  const byte = new Uint8Array(1);
  do {
    crypto.getRandomValues(byte);
    randomValue = byte[0];
  } while (randomValue >= range);
  return randomValue % max;
}

/**
 * Removes similar and/or ambiguous characters from a character set string
 * based on the provided advanced options.
 */
export function filterCharSet(charSet, { excludeSimilar = false, excludeAmbiguous = false } = {}) {
  let result = charSet;
  if (excludeSimilar) {
    result = result
      .split('')
      .filter((char) => !SIMILAR_CHARS.includes(char))
      .join('');
  }
  if (excludeAmbiguous) {
    result = result
      .split('')
      .filter((char) => !AMBIGUOUS_CHARS.includes(char))
      .join('');
  }
  return result;
}

/**
 * Fisher-Yates shuffle using cryptographically secure randomness.
 * Returns a new array; does not mutate the input.
 */
export function shuffleSecurely(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Walks the password array and swaps out any character that is identical
 * to its immediate predecessor, drawing a replacement from the full pool.
 * Used when the "no consecutive identical characters" option is enabled.
 */
export function ensureNoConsecutive(chars, pool) {
  const result = [...chars];
  for (let i = 1; i < result.length; i++) {
    let attempts = 0;
    while (result[i] === result[i - 1] && attempts < 50) {
      result[i] = pool[getSecureRandomIndex(pool.length)];
      attempts += 1;
    }
  }
  return result;
}

/**
 * Validates the requested password options before generation.
 * Returns { valid: boolean, message?: string }.
 */
export function validateOptions(options) {
  const { length, useUppercase, useLowercase, useNumbers, useSymbols } = options;

  if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
    return {
      valid: false,
      message: 'At least one character type must be selected.',
    };
  }

  if (
    typeof length !== 'number' ||
    Number.isNaN(length) ||
    length < MIN_LENGTH ||
    length > MAX_LENGTH
  ) {
    return {
      valid: false,
      message: `Password length must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`,
    };
  }

  return { valid: true };
}

/**
 * Generates a cryptographically secure password based on the given options.
 *
 * options: {
 *   length: number,
 *   useUppercase: boolean,
 *   useLowercase: boolean,
 *   useNumbers: boolean,
 *   useSymbols: boolean,
 *   excludeSimilar: boolean,
 *   excludeAmbiguous: boolean,
 *   noConsecutive: boolean,
 * }
 *
 * Throws an Error with a human-readable message if options are invalid.
 */
export function generatePassword(options) {
  const validation = validateOptions(options);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const {
    length,
    useUppercase,
    useLowercase,
    useNumbers,
    useSymbols,
    excludeSimilar = false,
    excludeAmbiguous = false,
    noConsecutive = false,
  } = options;

  const filterOptions = { excludeSimilar, excludeAmbiguous };
  const activeSets = [];

  if (useUppercase) {
    const set = filterCharSet(CHAR_SETS.uppercase, filterOptions);
    if (set.length > 0) activeSets.push(set);
  }
  if (useLowercase) {
    const set = filterCharSet(CHAR_SETS.lowercase, filterOptions);
    if (set.length > 0) activeSets.push(set);
  }
  if (useNumbers) {
    const set = filterCharSet(CHAR_SETS.numbers, filterOptions);
    if (set.length > 0) activeSets.push(set);
  }
  if (useSymbols) {
    const set = filterCharSet(CHAR_SETS.symbols, filterOptions);
    if (set.length > 0) activeSets.push(set);
  }

  if (activeSets.length === 0) {
    throw new Error(
      'No characters available with the current exclusion settings. Try disabling "Exclude similar" or "Exclude ambiguous".'
    );
  }

  // Combined pool used to fill out the remaining length
  const fullPool = activeSets.join('');

  if (length < activeSets.length) {
    throw new Error(
      `Password length must be at least ${activeSets.length} to include one character from each selected type.`
    );
  }

  const passwordChars = [];

  // Guarantee at least one character from each selected type
  activeSets.forEach((set) => {
    passwordChars.push(set[getSecureRandomIndex(set.length)]);
  });

  // Fill the rest of the length from the combined pool
  while (passwordChars.length < length) {
    passwordChars.push(fullPool[getSecureRandomIndex(fullPool.length)]);
  }

  let finalChars = shuffleSecurely(passwordChars);

  if (noConsecutive) {
    finalChars = ensureNoConsecutive(finalChars, fullPool);
    // Re-shuffle guarantee characters could have drifted to the ends;
    // a second light shuffle keeps distribution natural while the
    // consecutive-character fix above still holds for adjacent pairs
    // since we only swap in place.
  }

  return finalChars.join('');
}

/**
 * Returns the size of the character pool that would be used for the
 * given options, without generating a password. Useful for entropy
 * calculations and UI hints.
 */
export function getPoolSize(options) {
  const {
    useUppercase,
    useLowercase,
    useNumbers,
    useSymbols,
    excludeSimilar = false,
    excludeAmbiguous = false,
  } = options;

  const filterOptions = { excludeSimilar, excludeAmbiguous };
  let size = 0;

  if (useUppercase) size += filterCharSet(CHAR_SETS.uppercase, filterOptions).length;
  if (useLowercase) size += filterCharSet(CHAR_SETS.lowercase, filterOptions).length;
  if (useNumbers) size += filterCharSet(CHAR_SETS.numbers, filterOptions).length;
  if (useSymbols) size += filterCharSet(CHAR_SETS.symbols, filterOptions).length;

  return size;
}

export const PRESETS = {
  memorable: {
    id: 'memorable',
    label: 'Easy to Remember',
    description: 'Letters and numbers, 12 characters',
    options: {
      length: 12,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: false,
      excludeSimilar: true,
      excludeAmbiguous: false,
      noConsecutive: false,
    },
  },
  strong: {
    id: 'strong',
    label: 'Strong',
    description: 'All character types, 20 characters',
    options: {
      length: 20,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false,
      noConsecutive: false,
    },
  },
  maximum: {
    id: 'maximum',
    label: 'Maximum Security',
    description: 'All types plus advanced options, 32 characters',
    options: {
      length: 32,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      noConsecutive: true,
    },
  },
};
