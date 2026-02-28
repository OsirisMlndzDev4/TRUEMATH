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
 * Get the grade based on score.
 */
export const getGrade = (score) => {
    if (score >= 1000) return { title: 'MASTER LOGICIAN', color: '#FFD700' }
    if (score >= 700) return { title: 'LOGICIAN', color: '#00FFFF' }
    if (score >= 300) return { title: 'ANALYST', color: '#00FF41' }
    return { title: 'NOVICE', color: '#FF00FF' }
}

/**
 * Calculate truth matrix score based on time taken.
 * @param {number} elapsed - seconds since round started
 * @returns {number} points
 */
export const calculateTimeScore = (elapsed) => {
    if (elapsed <= 8) return 150
    if (elapsed <= 15) return 100
    if (elapsed <= 20) return 50
    return 0
}
