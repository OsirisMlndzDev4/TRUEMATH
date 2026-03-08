import { supabase } from './supabase'

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
 * Guardar una puntuación.
 * @param {string} module - 'syntax' | 'finder'
 * @param {{ name: string, score: number }} entry
 */
export const saveScore = async (module, entry) => {
    const { error } = await supabase
        .from('scores')
        .insert({
            name: entry.name,
            score: entry.score,
            module,
        })

    if (error) {
        console.error('Error saving score:', error)
    }
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

/**
 * Limpiar puntuaciones.
 * @param {string} module - 'syntax' | 'truth' | 'finder' | 'all'
 */
export const clearScores = async (module) => {
    let query

    if (module === 'all') {
        // Borrar todo — Supabase .delete() requiere un filtro,
        // así que usamos un filtro que siempre es verdadero.
        query = supabase.from('scores').delete().gte('id', '00000000-0000-0000-0000-000000000000')
    } else {
        query = supabase.from('scores').delete().eq('module', module)
    }

    const { error } = await query
    if (error) {
        console.error('Error clearing scores:', error)
    }
}
