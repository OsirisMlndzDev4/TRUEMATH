const STORAGE_PREFIX = 'truemath_'

export const getScores = (module) => {
    try {
        return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${module}`) || '[]')
    } catch {
        return []
    }
}

export const saveScore = (module, entry) => {
    const scores = getScores(module)
    scores.push({
        ...entry,
        date: new Date().toLocaleDateString('es-LA'),
        module,
    })
    scores.sort((a, b) => b.score - a.score)
    localStorage.setItem(`${STORAGE_PREFIX}${module}`, JSON.stringify(scores.slice(0, 50)))
}

export const getAllScores = () => {
    const syntax = getScores('syntax').map((s) => ({ ...s, module: 'syntax' }))
    const truth = getScores('truth').map((s) => ({ ...s, module: 'truth' }))
    return [...syntax, ...truth].sort((a, b) => b.score - a.score)
}

export const clearScores = (module) => {
    if (module === 'all') {
        localStorage.removeItem(`${STORAGE_PREFIX}syntax`)
        localStorage.removeItem(`${STORAGE_PREFIX}truth`)
    } else {
        localStorage.removeItem(`${STORAGE_PREFIX}${module}`)
    }
}
