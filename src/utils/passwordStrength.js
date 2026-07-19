/**
 * passwordStrength.js
 *
 * Calculates password strength, entropy, and a human-readable strength
 * level based on length and character variety.
 */

const STRENGTH_LEVELS = [
  { max: 20, label: 'Very Weak', color: '#ef4444', var: '--strength-very-weak' },
  { max: 40, label: 'Weak', color: '#f97316', var: '--strength-weak' },
  { max: 60, label: 'Medium', color: '#eab308', var: '--strength-medium' },
  { max: 80, label: 'Strong', color: '#84cc16', var: '--strength-strong' },
  { max: Infinity, label: 'Very Strong', color: '#22c55e', var: '--strength-very-strong' },
];

/**
 * Returns the size of the character pool implied by a password's contents.
 * This is an estimate based on which categories appear in the password,
 * used purely for entropy math (not for generation).
 */
function estimatePoolSize(password) {
  let pool = 0;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 32;
  return pool;
}

/**
 * Calculates Shannon-style entropy in bits: log2(pool^length).
 */
export function calculateEntropy(password) {
  if (!password) return 0;
  const pool = estimatePoolSize(password);
  if (pool === 0) return 0;
  return Math.round(password.length * Math.log2(pool) * 10) / 10;
}

/**
 * Calculates an overall strength score (0-100+) and maps it to a
 * strength level with a label and color.
 *
 * Returns:
 * {
 *   score: number,
 *   percentage: number, // clamped 0-100 for progress bars
 *   strength: string,
 *   color: string,
 *   cssVar: string,
 *   entropy: number,
 * }
 */
export function calculateStrength(password) {
  if (!password) {
    return {
      score: 0,
      percentage: 0,
      strength: 'No Password',
      color: '#94a3b8',
      cssVar: '--text-secondary',
      entropy: 0,
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  // Length scoring: up to 70 points
  let lengthScore = 0;
  if (password.length >= 8) lengthScore += 20;
  if (password.length >= 12) lengthScore += 20;
  if (password.length >= 16) lengthScore += 20;
  if (password.length >= 20) lengthScore += 10;

  // Variety scoring: up to 100 points (25 per type)
  const varietyScore = varietyCount * 25;

  const score = lengthScore + varietyScore;
  const percentage = Math.min(100, score);

  const level = STRENGTH_LEVELS.find((entry) => score < entry.max) || STRENGTH_LEVELS[STRENGTH_LEVELS.length - 1];

  return {
    score,
    percentage,
    strength: level.label,
    color: level.color,
    cssVar: level.var,
    entropy: calculateEntropy(password),
  };
}

/**
 * Returns a more detailed breakdown of a password's strength attributes,
 * useful for informational/educational display.
 */
export function getStrengthDetails(password) {
  const base = calculateStrength(password);
  return {
    ...base,
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[^A-Za-z0-9]/.test(password),
    poolSize: estimatePoolSize(password),
  };
}

export function getEntropyDescription(entropyBits) {
  if (entropyBits >= 100) return 'Excellent — resistant to brute-force for the foreseeable future';
  if (entropyBits >= 70) return 'Very good — strong protection for most use cases';
  if (entropyBits >= 50) return 'Reasonable — acceptable for lower-risk accounts';
  if (entropyBits >= 30) return 'Weak — vulnerable to sustained brute-force attempts';
  return 'Very weak — crackable quickly with modern hardware';
}
