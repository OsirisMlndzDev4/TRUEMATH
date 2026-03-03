/**
 * ═══════════════════════════════════════════════════════
 *  TRUTH FINDER — Level Definitions
 *  Cada nivel es una fórmula lógica que el jugador debe
 *  "desencriptar" paso a paso completando sub-tablas.
 * ═══════════════════════════════════════════════════════
 */

export const finderLevels = [
    // ── NIVEL 1: Fórmula simple, 2 variables ──
    {
        id: 1,
        title: 'MENSAJE INTERCEPTADO #001',
        difficulty: 'BÁSICO',
        formulaStr: 'p ∧ q',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
        // Sub-segmentos a resolver de izquierda a derecha
        segments: [
            {
                id: 'seg1',
                label: 'p ∧ q',
                operator: '∧',
                operands: ['p', 'q'],
                description: 'Conjunción de p y q',
            },
        ],
    },

    // ── NIVEL 2: 3 variables, un NOT ──
    {
        id: 2,
        title: 'MENSAJE INTERCEPTADO #002',
        difficulty: 'INTERMEDIO',
        formulaStr: '(p ∨ q) ∧ ¬r',
        variables: ['p', 'q', 'r'],
        classification: 'CONTINGENCIA',
        // Orden izquierda → derecha: primero (p ∨ q), luego ¬r, luego la conjunción
        segments: [
            {
                id: 'seg1',
                label: 'p ∨ q',
                operator: '∨',
                operands: ['p', 'q'],
                description: 'Disyunción de p y q',
            },
            {
                id: 'seg2',
                label: '¬r',
                operator: '¬',
                operands: ['r'],
                description: 'Negación de r',
            },
            {
                id: 'seg3',
                label: '(p ∨ q) ∧ ¬r',
                operator: '∧',
                operands: ['seg1', 'seg2'],
                description: 'Conjunción del resultado anterior con ¬r',
            },
        ],
    },

    // ── NIVEL 3: Encadenamiento de implicaciones ──
    {
        id: 3,
        title: 'MENSAJE INTERCEPTADO #003',
        difficulty: 'AVANZADO',
        formulaStr: '(p → q) ∧ (q → r)',
        variables: ['p', 'q', 'r'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: 'p → q',
                operator: '→',
                operands: ['p', 'q'],
                description: 'Implicación de p hacia q',
            },
            {
                id: 'seg2',
                label: 'q → r',
                operator: '→',
                operands: ['q', 'r'],
                description: 'Implicación de q hacia r',
            },
            {
                id: 'seg3',
                label: '(p → q) ∧ (q → r)',
                operator: '∧',
                operands: ['seg1', 'seg2'],
                description: 'Conjunción de ambas implicaciones',
            },
        ],
    },

    // ── NIVEL 4: Fórmula compleja con bicondicional ──
    {
        id: 4,
        title: 'MENSAJE INTERCEPTADO #004',
        difficulty: 'EXPERTO',
        formulaStr: '(p ↔ q) ∨ (¬p ∧ r)',
        variables: ['p', 'q', 'r'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: 'p ↔ q',
                operator: '↔',
                operands: ['p', 'q'],
                description: 'Bicondicional entre p y q',
            },
            {
                id: 'seg2',
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
            {
                id: 'seg3',
                label: '¬p ∧ r',
                operator: '∧',
                operands: ['seg2', 'r'],
                description: 'Conjunción de ¬p con r',
            },
            {
                id: 'seg4',
                label: '(p ↔ q) ∨ (¬p ∧ r)',
                operator: '∨',
                operands: ['seg1', 'seg3'],
                description: 'Disyunción del bicondicional con la conjunción',
            },
        ],
    },
]
