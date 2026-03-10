import { supabase } from './supabase'

const VALID_MODULES = ['syntax', 'finder']
const MAX_SCORE = 5000
const MAX_NAME_LEN = 12
const NAME_RE = /^[A-Z0-9_]+$/

/**
 * Obtener puntuaciones por módulo.
 * @param {string} module - 'syntax' | 'truth' | 'finder'
 * @returns {Promise<Array>}
 */
export const getScores = async (module) => {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('module', module)
        .order('score', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching scores:', error)
        return []
    }
    return data
}

/**
 * Verificar si un nombre ya existe en el leaderboard de un módulo.
 * @param {string} module - 'syntax' | 'finder'
 * @param {string} name - nombre en MAYÚSCULAS
 * @returns {Promise<boolean>}
 */
export const checkNameExists = async (module, name) => {
    const { data, error } = await supabase
        .from('scores')
        .select('id')
        .eq('module', module)
        .eq('name', name)
        .limit(1)

    if (error) {
        console.error('Error checking name:', error)
        return false
    }
    return data.length > 0
}

/**
 * Guardar una puntuación (con validación pre-envío).
 * @param {string} module - 'syntax' | 'finder'
 * @param {{ name: string, score: number, difficulty?: string }} entry
 * @returns {Promise<boolean>} true si se guardó correctamente
 */
export const saveScore = async (module, entry) => {
    if (!VALID_MODULES.includes(module)) return false
    if (typeof entry.score !== 'number' || entry.score < 0 || entry.score > MAX_SCORE) return false
    if (!entry.name || entry.name.length > MAX_NAME_LEN || !NAME_RE.test(entry.name)) return false

    const row = {
        name: entry.name,
        score: Math.round(entry.score),
        module,
    }
    if (entry.difficulty) {
        row.difficulty = entry.difficulty
    }

    const { error } = await supabase
        .from('scores')
        .insert(row)

    if (error) {
        console.error('Error saving score:', error)
        return false
    }
    return true
}

/**
 * Obtener todas las puntuaciones (todos los módulos).
 * @returns {Promise<Array>}
 */
export const getAllScores = async () => {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching all scores:', error)
        return []
    }
    return data
}

