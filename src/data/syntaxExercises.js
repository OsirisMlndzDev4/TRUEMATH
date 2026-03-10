export const syntaxExercises = [

    // ══════════════════════════════════════
    // EASY — operadores simples, 1 o 2 vars (10 ejercicios)
    // ══════════════════════════════════════
    { id: 1,  sentence: 'Estudio o descanso',                   variables: { p: 'estudio', q: 'descanso' },       solution: ['p', '∨', 'q'],           difficulty: 'easy' },
    { id: 2,  sentence: 'No estudio',                           variables: { p: 'estudio' },                      solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 3,  sentence: 'Si estudio, entonces apruebo',         variables: { p: 'estudio', q: 'apruebo' },        solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 4,  sentence: 'Estudio y ahorro',                     variables: { p: 'estudio', q: 'ahorro' },         solution: ['p', '∧', 'q'],            difficulty: 'easy' },
    { id: 17, sentence: 'Corro o camino',                       variables: { p: 'corro', q: 'camino' },           solution: ['p', '∨', 'q'],            difficulty: 'easy' },
    { id: 18, sentence: 'No tengo internet',                    variables: { p: 'internet' },                     solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 19, sentence: 'Si practico, mejoro',                  variables: { p: 'practico', q: 'mejoro' },        solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 20, sentence: 'Leo y escucho música',                 variables: { p: 'leo', q: 'música' },             solution: ['p', '∧', 'q'],            difficulty: 'easy' },
    { id: 37, sentence: 'Duermo o leo',                         variables: { p: 'duermo', q: 'leo' },             solution: ['p', '∨', 'q'],            difficulty: 'easy' },
    { id: 43, sentence: 'Si tengo hambre, como',                variables: { p: 'hambre', q: 'como' },            solution: ['p', '→', 'q'],            difficulty: 'easy' },

    // ══════════════════════════════════════
    // MEDIUM — paréntesis, ↔, negaciones dobles (15 ejercicios)
    // ══════════════════════════════════════
    { id: 5,  sentence: 'Si estudio y ahorro, entonces viajo',              variables: { p: 'estudio', q: 'ahorro', r: 'viajo' },        solution: ['(', 'p', '∧', 'q', ')', '→', 'r'],           difficulty: 'medium' },
    { id: 6,  sentence: 'Estudio si y solo si tengo tiempo',                variables: { p: 'estudio', q: 'tiempo' },                    solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 7,  sentence: 'No es verdad que estudie y duerma',                variables: { p: 'estudie', q: 'duerma' },                    solution: ['¬', '(', 'p', '∧', 'q', ')'],                 difficulty: 'medium' },
    { id: 8,  sentence: 'Si no llueve, salgo a correr',                     variables: { p: 'llueve', q: 'corro' },                      solution: ['¬', 'p', '→', 'q'],                           difficulty: 'medium' },
    { id: 21, sentence: 'No es cierto que llueva y haga calor',             variables: { p: 'llueve', q: 'calor' },                      solution: ['¬', '(', 'p', '∧', 'q', ')'],                 difficulty: 'medium' },
    { id: 22, sentence: 'Si no trabajo, no gano dinero',                    variables: { p: 'trabajo', q: 'gano' },                      solution: ['¬', 'p', '→', '¬', 'q'],                      difficulty: 'medium' },
    { id: 23, sentence: 'Si como bien y duermo, tengo energía',             variables: { p: 'como', q: 'duermo', r: 'energía' },         solution: ['(', 'p', '∧', 'q', ')', '→', 'r'],           difficulty: 'medium' },
    { id: 24, sentence: 'No es verdad que juegue o descanse',               variables: { p: 'juegue', q: 'descanse' },                   solution: ['¬', '(', 'p', '∨', 'q', ')'],                 difficulty: 'medium' },
    { id: 25, sentence: 'Viajo si y solo si ahorro',                        variables: { p: 'viajo', q: 'ahorro' },                      solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 28, sentence: 'Me gradúo si y solo si apruebo todo',              variables: { p: 'gradúo', q: 'apruebo' },                    solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 45, sentence: 'Si estudio o trabajo, tengo ingresos',             variables: { p: 'estudio', q: 'trabajo', r: 'ingresos' },    solution: ['(', 'p', '∨', 'q', ')', '→', 'r'],           difficulty: 'medium' },
    { id: 46, sentence: 'Salgo si y solo si termino la tarea',              variables: { p: 'salgo', q: 'tarea' },                       solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 48, sentence: 'Si no duermo bien, no rindo',                      variables: { p: 'duermo', q: 'rindo' },                      solution: ['¬', 'p', '→', '¬', 'q'],                      difficulty: 'medium' },
    { id: 49, sentence: 'Si pago y reservo, viajo',                         variables: { p: 'pago', q: 'reservo', r: 'viajo' },          solution: ['(', 'p', '∧', 'q', ')', '→', 'r'],           difficulty: 'medium' },
    { id: 52, sentence: 'Si no tengo auto, uso el bus',                     variables: { p: 'auto', q: 'bus' },                          solution: ['¬', 'p', '→', 'q'],                           difficulty: 'medium' },

    // ══════════════════════════════════════
    // HARD — fórmulas complejas, 3-4 vars (12 ejercicios)
    // ══════════════════════════════════════
    { id: 9,  sentence: 'Llueve o hace sol, pero no ambos',                          variables: { p: 'llueve', q: 'sol' },                                    solution: ['(', 'p', '∨', 'q', ')', '∧', '¬', '(', 'p', '∧', 'q', ')'],               difficulty: 'hard' },
    { id: 10, sentence: 'Si apruebo lógica, me gradúo y celebro',                    variables: { p: 'apruebo', q: 'gradúo', r: 'celebro' },                  solution: ['p', '→', '(', 'q', '∧', 'r', ')'],                                         difficulty: 'hard' },
    { id: 11, sentence: 'No estudio ni descanso',                                    variables: { p: 'estudio', q: 'descanso' },                              solution: ['¬', 'p', '∧', '¬', 'q'],                                                   difficulty: 'hard' },
    { id: 12, sentence: 'Voy al cine si y solo si no tengo tarea',                   variables: { p: 'cine', q: 'tarea' },                                    solution: ['p', '↔', '¬', 'q'],                                                        difficulty: 'hard' },
    { id: 29, sentence: 'Si estudio y practico, apruebo o mejoro',                   variables: { p: 'estudio', q: 'practico', r: 'apruebo', s: 'mejoro' },   solution: ['(', 'p', '∧', 'q', ')', '→', '(', 'r', '∨', 's', ')'],                   difficulty: 'hard' },
    { id: 30, sentence: 'No es cierto que no llueva y no haga sol',                  variables: { p: 'llueve', q: 'sol' },                                    solution: ['¬', '(', '¬', 'p', '∧', '¬', 'q', ')'],                                   difficulty: 'hard' },
    { id: 31, sentence: 'Salgo si y solo si no llueve y tengo tiempo',               variables: { p: 'salgo', q: 'llueve', r: 'tiempo' },                     solution: ['p', '↔', '(', '¬', 'q', '∧', 'r', ')'],                                   difficulty: 'hard' },
    { id: 32, sentence: 'Si llueve o nieva, no salgo y me abrigo',                   variables: { p: 'llueve', q: 'nieva', r: 'salgo', s: 'abrigo' },         solution: ['(', 'p', '∨', 'q', ')', '→', '(', '¬', 'r', '∧', 's', ')'],             difficulty: 'hard' },
    { id: 34, sentence: 'Apruebo si y solo si estudio y no falto',                   variables: { p: 'apruebo', q: 'estudio', r: 'falto' },                   solution: ['p', '↔', '(', 'q', '∧', '¬', 'r', ')'],                                   difficulty: 'hard' },
    { id: 36, sentence: 'Si no como ni duermo, me enfermo',                          variables: { p: 'como', q: 'duermo', r: 'enfermo' },                     solution: ['(', '¬', 'p', '∧', '¬', 'q', ')', '→', 'r'],                             difficulty: 'hard' },
    { id: 54, sentence: 'No es cierto que no estudie o no trabaje',                  variables: { p: 'estudie', q: 'trabaje' },                               solution: ['¬', '(', '¬', 'p', '∨', '¬', 'q', ')'],                                   difficulty: 'hard' },
    { id: 60, sentence: 'Si apruebo y me gradúo, celebro y descanso',                variables: { p: 'apruebo', q: 'gradúo', r: 'celebro', s: 'descanso' },   solution: ['(', 'p', '∧', 'q', ')', '→', '(', 'r', '∧', 's', ')'],                   difficulty: 'hard' },
]
