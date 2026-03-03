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

    // ── NIVEL 5: Tautología clásica ──
    {
        id: 5,
        title: 'MENSAJE INTERCEPTADO #005',
        difficulty: 'BÁSICO',
        formulaStr: 'p ∨ ¬p',
        variables: ['p'],
        classification: 'TAUTOLOGÍA',
        segments: [
            {
                id: 'seg1',
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
            {
                id: 'seg2',
                label: 'p ∨ ¬p',
                operator: '∨',
                operands: ['p', 'seg1'],
                description: 'Disyunción de p con su negación',
            },
        ],
    },

    // ── NIVEL 6: Contradicción clásica ──
    {
        id: 6,
        title: 'MENSAJE INTERCEPTADO #006',
        difficulty: 'BÁSICO',
        formulaStr: 'p ∧ ¬p',
        variables: ['p'],
        classification: 'CONTRADICCIÓN',
        segments: [
            {
                id: 'seg1',
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
            {
                id: 'seg2',
                label: 'p ∧ ¬p',
                operator: '∧',
                operands: ['p', 'seg1'],
                description: 'Conjunción de p con su negación',
            },
        ],
    },

    // ── NIVEL 7: Tautología con implicaciones cruzadas ──
    // (p → q) ∨ (q → p) es siempre verdadero
    {
        id: 7,
        title: 'MENSAJE INTERCEPTADO #007',
        difficulty: 'INTERMEDIO',
        formulaStr: '(p → q) ∨ (q → p)',
        variables: ['p', 'q'],
        classification: 'TAUTOLOGÍA',
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
                label: 'q → p',
                operator: '→',
                operands: ['q', 'p'],
                description: 'Implicación de q hacia p',
            },
            {
                id: 'seg3',
                label: '(p → q) ∨ (q → p)',
                operator: '∨',
                operands: ['seg1', 'seg2'],
                description: 'Disyunción de ambas implicaciones',
            },
        ],
    },

    // ── NIVEL 8: Ley de De Morgan — Tautología (bicondicional) ──
    // ¬(p ∧ q) ↔ (¬p ∨ ¬q) es siempre verdadero
    {
        id: 8,
        title: 'MENSAJE INTERCEPTADO #008',
        difficulty: 'INTERMEDIO',
        formulaStr: '¬(p ∧ q) ↔ (¬p ∨ ¬q)',
        variables: ['p', 'q'],
        classification: 'TAUTOLOGÍA',
        segments: [
            {
                id: 'seg1',
                label: 'p ∧ q',
                operator: '∧',
                operands: ['p', 'q'],
                description: 'Conjunción de p y q',
            },
            {
                id: 'seg2',
                label: '¬(p ∧ q)',
                operator: '¬',
                operands: ['seg1'],
                description: 'Negación de la conjunción',
            },
            {
                id: 'seg3',
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
            {
                id: 'seg4',
                label: '¬q',
                operator: '¬',
                operands: ['q'],
                description: 'Negación de q',
            },
            {
                id: 'seg5',
                label: '¬p ∨ ¬q',
                operator: '∨',
                operands: ['seg3', 'seg4'],
                description: 'Disyunción de las negaciones',
            },
            {
                id: 'seg6',
                label: '¬(p ∧ q) ↔ (¬p ∨ ¬q)',
                operator: '↔',
                operands: ['seg2', 'seg5'],
                description: 'Bicondicional: De Morgan verificado',
            },
        ],
    },

    // ── NIVEL 9: Refutación por contraejemplo — Contradicción ──
    // (p → q) ∧ (p ∧ ¬q) = asume la implicación Y su violación
    {
        id: 9,
        title: 'MENSAJE INTERCEPTADO #009',
        difficulty: 'AVANZADO',
        formulaStr: '(p → q) ∧ (p ∧ ¬q)',
        variables: ['p', 'q'],
        classification: 'CONTRADICCIÓN',
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
                label: '¬q',
                operator: '¬',
                operands: ['q'],
                description: 'Negación de q',
            },
            {
                id: 'seg3',
                label: 'p ∧ ¬q',
                operator: '∧',
                operands: ['p', 'seg2'],
                description: 'Conjunción de p con la negación de q',
            },
            {
                id: 'seg4',
                label: '(p → q) ∧ (p ∧ ¬q)',
                operator: '∧',
                operands: ['seg1', 'seg3'],
                description: 'Conjunción de la implicación con su violación',
            },
        ],
    },

    // ── NIVEL 10: Transitividad de la implicación — Tautología ──
    // ((p → q) ∧ (q → r)) → (p → r) es siempre verdadero
    {
        id: 10,
        title: 'MENSAJE INTERCEPTADO #010',
        difficulty: 'EXPERTO',
        formulaStr: '((p → q) ∧ (q → r)) → (p → r)',
        variables: ['p', 'q', 'r'],
        classification: 'TAUTOLOGÍA',
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
            {
                id: 'seg4',
                label: 'p → r',
                operator: '→',
                operands: ['p', 'r'],
                description: 'Implicación de p hacia r (conclusión)',
            },
            {
                id: 'seg5',
                label: '((p → q) ∧ (q → r)) → (p → r)',
                operator: '→',
                operands: ['seg3', 'seg4'],
                description: 'La transitividad implica la conclusión',
            },
        ],
    },
]
