/**
 * ═══════════════════════════════════════════════════════
 *  TRUTH FINDER — Logic Engine
 *  Motor de evaluación lógica para generar tablas de verdad
 *  y validar respuestas del jugador.
 * ═══════════════════════════════════════════════════════
 */

/**
 * Genera todas las combinaciones de valores de verdad para n variables.
 * @param {string[]} vars — e.g. ['p','q','r']
 * @returns {Object[]} — array de objetos { p: true, q: false, r: true, ... }
 */
export function generateCombinations(vars) {
    const n = vars.length
    const total = Math.pow(2, n)
    const combos = []

    for (let i = 0; i < total; i++) {
        const row = {}
        for (let j = 0; j < n; j++) {
            // Invertido: empieza con V (true) → orden convencional de tablas
            row[vars[j]] = !Boolean((i >> (n - 1 - j)) & 1)
        }
        combos.push(row)
    }
    return combos
}

/**
 * Evalúa un operador lógico dado uno o dos operandos booleanos.
 * @param {string} op — '∧', '∨', '¬', '→', '↔'
 * @param {boolean} a — primer operando
 * @param {boolean} [b] — segundo operando (no usado en ¬)
 * @returns {boolean}
 */
export function evaluateOperator(op, a, b) {
    switch (op) {
        case '∧': return a && b
        case '∨': return a || b
        case '¬': return !a
        case '→': return !a || b    // p → q ≡ ¬p ∨ q
        case '↔': return a === b    // p ↔ q ≡ (p → q) ∧ (q → p)
        default:
            throw new Error(`Operador desconocido: ${op}`)
    }
}

/**
 * Evalúa un segmento dado una fila de asignación de variables
 * y los resultados previos de otros segmentos.
 * @param {Object} segment — { operator, operands }
 * @param {Object} assignment — { p: true, q: false, ... }
 * @param {Object} resolvedSegments — { seg1: true, seg2: false, ... }
 * @returns {boolean}
 */
export function evaluateSegment(segment, assignment, resolvedSegments) {
    const { operator, operands } = segment

    // Resolver el valor de un operando (puede ser variable base o segmento previo)
    const resolve = (operand) => {
        if (operand in assignment) return assignment[operand]
        if (operand in resolvedSegments) return resolvedSegments[operand]
        throw new Error(`Operando no resuelto: ${operand}`)
    }

    if (operator === '¬') {
        return evaluateOperator('¬', resolve(operands[0]))
    }
    return evaluateOperator(operator, resolve(operands[0]), resolve(operands[1]))
}

/**
 * Genera la tabla de verdad completa para un segmento específico.
 * @param {Object} segment — definición del segmento
 * @param {string[]} variables — variables de la fórmula completa
 * @param {Object[]} combinations — filas de asignación pre-generadas
 * @param {Object} allSegments — mapa { segId: segment } para resolver dependencias
 * @returns {{ columns: string[], rows: Object[] }}
 *   columns = lista de encabezados (variables relevantes + resultado)
 *   rows = array de { values: boolean[], result: boolean }
 */
export function generateSegmentTable(segment, variables, combinations, allSegments) {
    // Determinar qué variables base son relevantes para este segmento
    const relevantVars = getRelevantVariables(segment, allSegments, variables)

    const rows = combinations.map((combo) => {
        // Resolver todos los segmentos previos necesarios
        const resolved = {}
        resolveAllDependencies(segment, combo, allSegments, resolved)

        const result = evaluateSegment(segment, combo, resolved)
        const values = relevantVars.map((v) => combo[v])

        return { values, result }
    })

    return {
        columns: [...relevantVars, segment.label],
        rows,
    }
}

/**
 * Resuelve recursivamente todas las dependencias de segmento.
 */
function resolveAllDependencies(segment, assignment, allSegments, resolved) {
    for (const operand of segment.operands) {
        if (operand in allSegments && !(operand in resolved)) {
            const depSeg = allSegments[operand]
            // Resolver dependencias del dependiente primero
            resolveAllDependencies(depSeg, assignment, allSegments, resolved)
            resolved[operand] = evaluateSegment(depSeg, assignment, resolved)
        }
    }
}

/**
 * Obtiene las variables base relevantes para un segmento,
 * siguiendo recursivamente las dependencias.
 */
function getRelevantVariables(segment, allSegments, allVars) {
    const vars = new Set()

    function collect(seg) {
        for (const op of seg.operands) {
            if (allVars.includes(op)) {
                vars.add(op)
            } else if (op in allSegments) {
                collect(allSegments[op])
            }
        }
    }

    collect(segment)
    // Mantener el orden original de las variables
    return allVars.filter((v) => vars.has(v))
}

/**
 * Clasifica una fórmula basándose en sus resultados de tabla de verdad.
 * @param {boolean[]} results — array con todos los resultados de la tabla
 * @returns {'TAUTOLOGÍA' | 'CONTRADICCIÓN' | 'CONTINGENCIA'}
 */
export function classifyFormula(results) {
    const allTrue = results.every((r) => r === true)
    const allFalse = results.every((r) => r === false)

    if (allTrue) return 'TAUTOLOGÍA'
    if (allFalse) return 'CONTRADICCIÓN'
    return 'CONTINGENCIA'
}

/**
 * Convierte un boolean a la representación de ficha del juego.
 * @param {boolean} val
 * @returns {'V' | 'F'}
 */
export function boolToChip(val) {
    return val ? 'V' : 'F'
}

/**
 * Convierte una ficha del juego a boolean.
 * @param {'V' | 'F'} chip
 * @returns {boolean}
 */
export function chipToBool(chip) {
    return chip === 'V'
}
