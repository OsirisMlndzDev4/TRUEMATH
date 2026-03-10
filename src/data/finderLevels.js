/**
 * ═══════════════════════════════════════════════════════
 *  TRUTH FINDER — Level Definitions
 *  Cada nivel es una fórmula lógica que el jugador debe
 *  "desencriptar" paso a paso completando sub-tablas.
 *
 *  40 niveles: 10 por dificultad
 *  BÁSICO → INTERMEDIO → AVANZADO → EXPERTO
 * ═══════════════════════════════════════════════════════
 */

/* ══════════════════════════════════════════
   BÁSICO — 10 niveles
   1-2 variables, operadores simples (∧, ∨, ¬)
   ══════════════════════════════════════════ */
export const finderLevelsBasico = [
    // B1: Conjunción simple
    {
        id: 'B1',
        title: 'MENSAJE INTERCEPTADO #B-001',
        difficulty: 'BÁSICO',
        formulaStr: 'p ∧ q',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
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
    // B2: Disyunción simple
    {
        id: 'B2',
        title: 'MENSAJE INTERCEPTADO #B-002',
        difficulty: 'BÁSICO',
        formulaStr: 'p ∨ q',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: 'p ∨ q',
                operator: '∨',
                operands: ['p', 'q'],
                description: 'Disyunción de p y q',
            },
        ],
    },
    // B3: Negación simple
    {
        id: 'B3',
        title: 'MENSAJE INTERCEPTADO #B-003',
        difficulty: 'BÁSICO',
        formulaStr: '¬p',
        variables: ['p'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
        ],
    },
    // B4: Tautología clásica — Ley del tercero excluido
    {
        id: 'B4',
        title: 'MENSAJE INTERCEPTADO #B-004',
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
    // B5: Contradicción clásica
    {
        id: 'B5',
        title: 'MENSAJE INTERCEPTADO #B-005',
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
    // B6: Doble negación
    {
        id: 'B6',
        title: 'MENSAJE INTERCEPTADO #B-006',
        difficulty: 'BÁSICO',
        formulaStr: '¬¬p',
        variables: ['p'],
        classification: 'CONTINGENCIA',
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
                label: '¬¬p',
                operator: '¬',
                operands: ['seg1'],
                description: 'Doble negación de p',
            },
        ],
    },
    // B7: Negación de una conjunción (resultado contingente)
    {
        id: 'B7',
        title: 'MENSAJE INTERCEPTADO #B-007',
        difficulty: 'BÁSICO',
        formulaStr: '¬(p ∧ q)',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
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
        ],
    },
    // B8: Negación de disyunción
    {
        id: 'B8',
        title: 'MENSAJE INTERCEPTADO #B-008',
        difficulty: 'BÁSICO',
        formulaStr: '¬(p ∨ q)',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
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
                label: '¬(p ∨ q)',
                operator: '¬',
                operands: ['seg1'],
                description: 'Negación de la disyunción',
            },
        ],
    },
    // B9: Conjunción con negación
    {
        id: 'B9',
        title: 'MENSAJE INTERCEPTADO #B-009',
        difficulty: 'BÁSICO',
        formulaStr: '¬p ∧ q',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
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
                label: '¬p ∧ q',
                operator: '∧',
                operands: ['seg1', 'q'],
                description: 'Conjunción de ¬p con q',
            },
        ],
    },
    // B10: Disyunción con negación — tautología (q ∨ ¬q disfrazada con variables extra)
    {
        id: 'B10',
        title: 'MENSAJE INTERCEPTADO #B-010',
        difficulty: 'BÁSICO',
        formulaStr: '¬p ∨ p',
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
                label: '¬p ∨ p',
                operator: '∨',
                operands: ['seg1', 'p'],
                description: 'Disyunción de ¬p con p',
            },
        ],
    },
]

/* ══════════════════════════════════════════
   INTERMEDIO — 10 niveles
   2-3 variables, implicación (→), combinaciones
   ══════════════════════════════════════════ */
export const finderLevelsIntermedio = [
    // I1: Implicación simple
    {
        id: 'I1',
        title: 'MENSAJE INTERCEPTADO #I-001',
        difficulty: 'INTERMEDIO',
        formulaStr: 'p → q',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: 'p → q',
                operator: '→',
                operands: ['p', 'q'],
                description: 'Implicación de p hacia q',
            },
        ],
    },
    // I2: Disyunción con 3 variables y negación
    {
        id: 'I2',
        title: 'MENSAJE INTERCEPTADO #I-002',
        difficulty: 'INTERMEDIO',
        formulaStr: '(p ∨ q) ∧ ¬r',
        variables: ['p', 'q', 'r'],
        classification: 'CONTINGENCIA',
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
    // I3: Modus ponens estructura
    {
        id: 'I3',
        title: 'MENSAJE INTERCEPTADO #I-003',
        difficulty: 'INTERMEDIO',
        formulaStr: '(p → q) ∧ p',
        variables: ['p', 'q'],
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
                label: '(p → q) ∧ p',
                operator: '∧',
                operands: ['seg1', 'p'],
                description: 'Conjunción de la implicación con p',
            },
        ],
    },
    // I4: Tautología — implicaciones cruzadas
    {
        id: 'I4',
        title: 'MENSAJE INTERCEPTADO #I-004',
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
    // I5: Contrapositiva parcial
    {
        id: 'I5',
        title: 'MENSAJE INTERCEPTADO #I-005',
        difficulty: 'INTERMEDIO',
        formulaStr: '¬q → ¬p',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: '¬q',
                operator: '¬',
                operands: ['q'],
                description: 'Negación de q',
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
                label: '¬q → ¬p',
                operator: '→',
                operands: ['seg1', 'seg2'],
                description: 'Implicación de ¬q hacia ¬p',
            },
        ],
    },
    // I6: Ley de De Morgan — Tautología (bicondicional)
    {
        id: 'I6',
        title: 'MENSAJE INTERCEPTADO #I-006',
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
    // I7: Conjunción de implicación con negación
    {
        id: 'I7',
        title: 'MENSAJE INTERCEPTADO #I-007',
        difficulty: 'INTERMEDIO',
        formulaStr: '(p → q) ∧ ¬q',
        variables: ['p', 'q'],
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
                label: '¬q',
                operator: '¬',
                operands: ['q'],
                description: 'Negación de q',
            },
            {
                id: 'seg3',
                label: '(p → q) ∧ ¬q',
                operator: '∧',
                operands: ['seg1', 'seg2'],
                description: 'Conjunción de la implicación con ¬q',
            },
        ],
    },
    // I8: Disyunción exclusiva (XOR simulado)
    {
        id: 'I8',
        title: 'MENSAJE INTERCEPTADO #I-008',
        difficulty: 'INTERMEDIO',
        formulaStr: '(p ∨ q) ∧ ¬(p ∧ q)',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
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
                label: 'p ∧ q',
                operator: '∧',
                operands: ['p', 'q'],
                description: 'Conjunción de p y q',
            },
            {
                id: 'seg3',
                label: '¬(p ∧ q)',
                operator: '¬',
                operands: ['seg2'],
                description: 'Negación de la conjunción',
            },
            {
                id: 'seg4',
                label: '(p ∨ q) ∧ ¬(p ∧ q)',
                operator: '∧',
                operands: ['seg1', 'seg3'],
                description: 'Disyunción exclusiva (XOR)',
            },
        ],
    },
    // I9: Bicondicional simple
    {
        id: 'I9',
        title: 'MENSAJE INTERCEPTADO #I-009',
        difficulty: 'INTERMEDIO',
        formulaStr: 'p ↔ q',
        variables: ['p', 'q'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: 'p ↔ q',
                operator: '↔',
                operands: ['p', 'q'],
                description: 'Bicondicional entre p y q',
            },
        ],
    },
    // I10: Implicación con 3 variables
    {
        id: 'I10',
        title: 'MENSAJE INTERCEPTADO #I-010',
        difficulty: 'INTERMEDIO',
        formulaStr: 'p → (q ∨ r)',
        variables: ['p', 'q', 'r'],
        classification: 'CONTINGENCIA',
        segments: [
            {
                id: 'seg1',
                label: 'q ∨ r',
                operator: '∨',
                operands: ['q', 'r'],
                description: 'Disyunción de q y r',
            },
            {
                id: 'seg2',
                label: 'p → (q ∨ r)',
                operator: '→',
                operands: ['p', 'seg1'],
                description: 'Implicación de p hacia la disyunción',
            },
        ],
    },
]

/* ══════════════════════════════════════════
   AVANZADO — 10 niveles
   3 variables, →/↔/¬ complejos, leyes lógicas
   ══════════════════════════════════════════ */
export const finderLevelsAvanzado = [
    // A1: Encadenamiento de implicaciones
    {
        id: 'A1',
        title: 'MENSAJE INTERCEPTADO #A-001',
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
    // A2: Refutación por contraejemplo — Contradicción
    {
        id: 'A2',
        title: 'MENSAJE INTERCEPTADO #A-002',
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
    // A3: Bicondicional con disyunción
    {
        id: 'A3',
        title: 'MENSAJE INTERCEPTADO #A-003',
        difficulty: 'AVANZADO',
        formulaStr: '(p ↔ q) ∨ r',
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
                label: '(p ↔ q) ∨ r',
                operator: '∨',
                operands: ['seg1', 'r'],
                description: 'Disyunción del bicondicional con r',
            },
        ],
    },
    // A4: Ley de absorción
    {
        id: 'A4',
        title: 'MENSAJE INTERCEPTADO #A-004',
        difficulty: 'AVANZADO',
        formulaStr: 'p → (p ∨ q)',
        variables: ['p', 'q'],
        classification: 'TAUTOLOGÍA',
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
                label: 'p → (p ∨ q)',
                operator: '→',
                operands: ['p', 'seg1'],
                description: 'Implicación de p hacia la disyunción',
            },
        ],
    },
    // A5: Implicación material — tautología
    {
        id: 'A5',
        title: 'MENSAJE INTERCEPTADO #A-005',
        difficulty: 'AVANZADO',
        formulaStr: '(p ∧ q) → p',
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
                label: '(p ∧ q) → p',
                operator: '→',
                operands: ['seg1', 'p'],
                description: 'Simplificación: la conjunción implica p',
            },
        ],
    },
    // A6: Doble negación con implicación
    {
        id: 'A6',
        title: 'MENSAJE INTERCEPTADO #A-006',
        difficulty: 'AVANZADO',
        formulaStr: '¬¬p → p',
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
                label: '¬¬p',
                operator: '¬',
                operands: ['seg1'],
                description: 'Doble negación de p',
            },
            {
                id: 'seg3',
                label: '¬¬p → p',
                operator: '→',
                operands: ['seg2', 'p'],
                description: 'Doble negación implica p',
            },
        ],
    },
    // A7: Conjunción triple con negación
    {
        id: 'A7',
        title: 'MENSAJE INTERCEPTADO #A-007',
        difficulty: 'AVANZADO',
        formulaStr: '(p ∧ q) ∨ (¬p ∧ r)',
        variables: ['p', 'q', 'r'],
        classification: 'CONTINGENCIA',
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
                label: '(p ∧ q) ∨ (¬p ∧ r)',
                operator: '∨',
                operands: ['seg1', 'seg3'],
                description: 'Disyunción de las dos conjunciones',
            },
        ],
    },
    // A8: Contradicción — contraposición fallida
    {
        id: 'A8',
        title: 'MENSAJE INTERCEPTADO #A-008',
        difficulty: 'AVANZADO',
        formulaStr: '(p → q) ∧ (q → p) ∧ (p ∧ ¬q)',
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
                label: 'q → p',
                operator: '→',
                operands: ['q', 'p'],
                description: 'Implicación de q hacia p',
            },
            {
                id: 'seg3',
                label: '(p → q) ∧ (q → p)',
                operator: '∧',
                operands: ['seg1', 'seg2'],
                description: 'Bicondicional implícito',
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
                label: 'p ∧ ¬q',
                operator: '∧',
                operands: ['p', 'seg4'],
                description: 'Conjunción de p con ¬q',
            },
            {
                id: 'seg6',
                label: '(p → q) ∧ (q → p) ∧ (p ∧ ¬q)',
                operator: '∧',
                operands: ['seg3', 'seg5'],
                description: 'Contradicción: bicondicional con su violación',
            },
        ],
    },
    // A9: Implicación con conjunción de 3 variables
    {
        id: 'A9',
        title: 'MENSAJE INTERCEPTADO #A-009',
        difficulty: 'AVANZADO',
        formulaStr: '(p ∧ q) → (q ∨ r)',
        variables: ['p', 'q', 'r'],
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
                label: 'q ∨ r',
                operator: '∨',
                operands: ['q', 'r'],
                description: 'Disyunción de q y r',
            },
            {
                id: 'seg3',
                label: '(p ∧ q) → (q ∨ r)',
                operator: '→',
                operands: ['seg1', 'seg2'],
                description: 'La conjunción implica la disyunción',
            },
        ],
    },
    // A10: Modus tollens
    {
        id: 'A10',
        title: 'MENSAJE INTERCEPTADO #A-010',
        difficulty: 'AVANZADO',
        formulaStr: '((p → q) ∧ ¬q) → ¬p',
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
                label: '¬q',
                operator: '¬',
                operands: ['q'],
                description: 'Negación de q',
            },
            {
                id: 'seg3',
                label: '(p → q) ∧ ¬q',
                operator: '∧',
                operands: ['seg1', 'seg2'],
                description: 'Premisas del modus tollens',
            },
            {
                id: 'seg4',
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
            {
                id: 'seg5',
                label: '((p → q) ∧ ¬q) → ¬p',
                operator: '→',
                operands: ['seg3', 'seg4'],
                description: 'Modus tollens completo',
            },
        ],
    },
]

/* ══════════════════════════════════════════
   EXPERTO — 10 niveles
   3-4 variables, cadenas complejas, leyes avanzadas
   ══════════════════════════════════════════ */
export const finderLevelsExperto = [
    // E1: Bicondicional con negación
    {
        id: 'E1',
        title: 'MENSAJE INTERCEPTADO #E-001',
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
    // E2: Transitividad de la implicación — Tautología
    {
        id: 'E2',
        title: 'MENSAJE INTERCEPTADO #E-002',
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
    // E3: Ley de De Morgan con disyunción — Tautología
    {
        id: 'E3',
        title: 'MENSAJE INTERCEPTADO #E-003',
        difficulty: 'EXPERTO',
        formulaStr: '¬(p ∨ q) ↔ (¬p ∧ ¬q)',
        variables: ['p', 'q'],
        classification: 'TAUTOLOGÍA',
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
                label: '¬(p ∨ q)',
                operator: '¬',
                operands: ['seg1'],
                description: 'Negación de la disyunción',
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
                label: '¬p ∧ ¬q',
                operator: '∧',
                operands: ['seg3', 'seg4'],
                description: 'Conjunción de las negaciones',
            },
            {
                id: 'seg6',
                label: '¬(p ∨ q) ↔ (¬p ∧ ¬q)',
                operator: '↔',
                operands: ['seg2', 'seg5'],
                description: 'De Morgan para disyunción',
            },
        ],
    },
    // E4: Dilema constructivo
    {
        id: 'E4',
        title: 'MENSAJE INTERCEPTADO #E-004',
        difficulty: 'EXPERTO',
        formulaStr: '((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s))',
        variables: ['p', 'q', 'r', 's'],
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
                label: 'r → s',
                operator: '→',
                operands: ['r', 's'],
                description: 'Implicación de r hacia s',
            },
            {
                id: 'seg3',
                label: '(p → q) ∧ (r → s)',
                operator: '∧',
                operands: ['seg1', 'seg2'],
                description: 'Conjunción de ambas implicaciones',
            },
            {
                id: 'seg4',
                label: 'p ∨ r',
                operator: '∨',
                operands: ['p', 'r'],
                description: 'Disyunción de p y r',
            },
            {
                id: 'seg5',
                label: 'q ∨ s',
                operator: '∨',
                operands: ['q', 's'],
                description: 'Disyunción de q y s',
            },
            {
                id: 'seg6',
                label: '(p ∨ r) → (q ∨ s)',
                operator: '→',
                operands: ['seg4', 'seg5'],
                description: 'De las premisas se sigue la conclusión',
            },
            {
                id: 'seg7',
                label: '((p → q) ∧ (r → s)) → ((p ∨ r) → (q ∨ s))',
                operator: '→',
                operands: ['seg3', 'seg6'],
                description: 'Dilema constructivo completo',
            },
        ],
    },
    // E5: Ley de contrapositiva — Tautología
    {
        id: 'E5',
        title: 'MENSAJE INTERCEPTADO #E-005',
        difficulty: 'EXPERTO',
        formulaStr: '(p → q) ↔ (¬q → ¬p)',
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
                label: '¬q',
                operator: '¬',
                operands: ['q'],
                description: 'Negación de q',
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
                label: '¬q → ¬p',
                operator: '→',
                operands: ['seg2', 'seg3'],
                description: 'Contrapositiva',
            },
            {
                id: 'seg5',
                label: '(p → q) ↔ (¬q → ¬p)',
                operator: '↔',
                operands: ['seg1', 'seg4'],
                description: 'Equivalencia de contrapositiva',
            },
        ],
    },
    // E6: Exportación — Tautología
    {
        id: 'E6',
        title: 'MENSAJE INTERCEPTADO #E-006',
        difficulty: 'EXPERTO',
        formulaStr: '((p ∧ q) → r) ↔ (p → (q → r))',
        variables: ['p', 'q', 'r'],
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
                label: '(p ∧ q) → r',
                operator: '→',
                operands: ['seg1', 'r'],
                description: 'Implicación de la conjunción hacia r',
            },
            {
                id: 'seg3',
                label: 'q → r',
                operator: '→',
                operands: ['q', 'r'],
                description: 'Implicación de q hacia r',
            },
            {
                id: 'seg4',
                label: 'p → (q → r)',
                operator: '→',
                operands: ['p', 'seg3'],
                description: 'Implicación anidada',
            },
            {
                id: 'seg5',
                label: '((p ∧ q) → r) ↔ (p → (q → r))',
                operator: '↔',
                operands: ['seg2', 'seg4'],
                description: 'Ley de exportación verificada',
            },
        ],
    },
    // E7: Contradicción compleja con 3 variables
    {
        id: 'E7',
        title: 'MENSAJE INTERCEPTADO #E-007',
        difficulty: 'EXPERTO',
        formulaStr: '(p → q) ∧ (q → r) ∧ (p ∧ ¬r)',
        variables: ['p', 'q', 'r'],
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
                description: 'Cadena de implicaciones',
            },
            {
                id: 'seg4',
                label: '¬r',
                operator: '¬',
                operands: ['r'],
                description: 'Negación de r',
            },
            {
                id: 'seg5',
                label: 'p ∧ ¬r',
                operator: '∧',
                operands: ['p', 'seg4'],
                description: 'Conjunción de p con ¬r',
            },
            {
                id: 'seg6',
                label: '(p → q) ∧ (q → r) ∧ (p ∧ ¬r)',
                operator: '∧',
                operands: ['seg3', 'seg5'],
                description: 'Cadena transitiva con su violación',
            },
        ],
    },
    // E8: Implicación material — Tautología
    {
        id: 'E8',
        title: 'MENSAJE INTERCEPTADO #E-008',
        difficulty: 'EXPERTO',
        formulaStr: '(p → q) ↔ (¬p ∨ q)',
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
                label: '¬p',
                operator: '¬',
                operands: ['p'],
                description: 'Negación de p',
            },
            {
                id: 'seg3',
                label: '¬p ∨ q',
                operator: '∨',
                operands: ['seg2', 'q'],
                description: 'Disyunción de ¬p con q',
            },
            {
                id: 'seg4',
                label: '(p → q) ↔ (¬p ∨ q)',
                operator: '↔',
                operands: ['seg1', 'seg3'],
                description: 'Definición material de implicación',
            },
        ],
    },
    // E9: Modus ponens como tautología
    {
        id: 'E9',
        title: 'MENSAJE INTERCEPTADO #E-009',
        difficulty: 'EXPERTO',
        formulaStr: '((p → q) ∧ p) → q',
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
                label: '(p → q) ∧ p',
                operator: '∧',
                operands: ['seg1', 'p'],
                description: 'Premisas del modus ponens',
            },
            {
                id: 'seg3',
                label: '((p → q) ∧ p) → q',
                operator: '→',
                operands: ['seg2', 'q'],
                description: 'Modus ponens como tautología',
            },
        ],
    },
    // E10: Distribución compleja — Tautología
    {
        id: 'E10',
        title: 'MENSAJE INTERCEPTADO #E-010',
        difficulty: 'EXPERTO',
        formulaStr: '(p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
        variables: ['p', 'q', 'r'],
        classification: 'TAUTOLOGÍA',
        segments: [
            {
                id: 'seg1',
                label: 'q ∨ r',
                operator: '∨',
                operands: ['q', 'r'],
                description: 'Disyunción de q y r',
            },
            {
                id: 'seg2',
                label: 'p ∧ (q ∨ r)',
                operator: '∧',
                operands: ['p', 'seg1'],
                description: 'Conjunción de p con la disyunción',
            },
            {
                id: 'seg3',
                label: 'p ∧ q',
                operator: '∧',
                operands: ['p', 'q'],
                description: 'Conjunción de p y q',
            },
            {
                id: 'seg4',
                label: 'p ∧ r',
                operator: '∧',
                operands: ['p', 'r'],
                description: 'Conjunción de p y r',
            },
            {
                id: 'seg5',
                label: '(p ∧ q) ∨ (p ∧ r)',
                operator: '∨',
                operands: ['seg3', 'seg4'],
                description: 'Distribución resultante',
            },
            {
                id: 'seg6',
                label: '(p ∧ (q ∨ r)) ↔ ((p ∧ q) ∨ (p ∧ r))',
                operator: '↔',
                operands: ['seg2', 'seg5'],
                description: 'Ley distributiva verificada',
            },
        ],
    },
]

/* ══════════════════════════════════════════
   EXPORTACIONES
   ══════════════════════════════════════════ */

// Mapa de dificultad → niveles
export const finderLevelsByDifficulty = {
    basico: finderLevelsBasico,
    intermedio: finderLevelsIntermedio,
    avanzado: finderLevelsAvanzado,
    experto: finderLevelsExperto,
}

// Array combinado (retrocompatibilidad)
export const finderLevels = [
    ...finderLevelsBasico,
    ...finderLevelsIntermedio,
    ...finderLevelsAvanzado,
    ...finderLevelsExperto,
]
