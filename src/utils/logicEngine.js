/**
 * Compare two token arrays for exact match.
 * Normalizes whitespace and trims each token.
 */
export const compareTokenArrays = (playerTokens, solutionTokens) => {
    if (playerTokens.length !== solutionTokens.length) return false
    return playerTokens.every((token, i) => token.trim() === solutionTokens[i].trim())
}

/**
 * Format a token array as a readable formula string.
 */
export const formatFormula = (tokens) => {
    return tokens.join(' ')
}

/**
 * Max possible scores per module+difficulty.
 * Syntax: easy=10ex*75, medium=15ex*120, hard=12ex*250
 */
const MAX_SCORES = {
    syntax: { facil: 750, medio: 1800, dificil: 3000 },
    finder: { facil: 1000, medio: 1500, dificil: 2000 },
}
const FALLBACK_MAX = 1000

/**
 * Get the grade based on score as a percentage of the max possible.
 * @param {number} score
 * @param {string} [module] - 'syntax' | 'finder'
 * @param {string} [difficulty] - 'facil' | 'medio' | 'dificil'
 */
export const getGrade = (score, module, difficulty) => {
    const maxScore = (module && difficulty && MAX_SCORES[module]?.[difficulty]) || FALLBACK_MAX
    const pct = score / maxScore

    if (pct >= 0.85) return { title: 'MASTER LOGICIAN', color: '#FFD700' }
    if (pct >= 0.65) return { title: 'LOGICIAN', color: '#00FFFF' }
    if (pct >= 0.40) return { title: 'ANALYST', color: '#00FF41' }
    return { title: 'NOVICE', color: '#FF00FF' }
}

/**
 * Calculate truth matrix score based on time taken.
 * Adjusted for progressive time limits (60s / 120s / 150s).
 * @param {number} elapsed - seconds since round started
 * @returns {number} points
 */
export const calculateTimeScore = (elapsed) => {
    if (elapsed <= 15) return 150
    if (elapsed <= 45) return 100
    if (elapsed <= 90) return 50
    return 25
}
