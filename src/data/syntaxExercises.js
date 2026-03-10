export const syntaxExercises = [

    // ══════════════════════════════════════
    // EASY — operadores simples, 1 o 2 vars
    // ══════════════════════════════════════
    { id: 1,  sentence: 'Estudio o descanso',                   variables: { p: 'estudio', q: 'descanso' },       solution: ['p', '∨', 'q'],           difficulty: 'easy' },
    { id: 2,  sentence: 'No estudio',                           variables: { p: 'estudio' },                      solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 3,  sentence: 'Si estudio, entonces apruebo',         variables: { p: 'estudio', q: 'apruebo' },        solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 4,  sentence: 'Estudio y ahorro',                     variables: { p: 'estudio', q: 'ahorro' },         solution: ['p', '∧', 'q'],            difficulty: 'easy' },
    { id: 13, sentence: 'Trabajo o descanso',                   variables: { p: 'trabajo', q: 'descanso' },       solution: ['p', '∨', 'q'],            difficulty: 'easy' },
    { id: 14, sentence: 'No tengo miedo',                       variables: { p: 'miedo' },                        solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 15, sentence: 'Si llueve, me mojo',                   variables: { p: 'llueve', q: 'mojo' },            solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 16, sentence: 'Como y bebo agua',                     variables: { p: 'como', q: 'bebo' },              solution: ['p', '∧', 'q'],            difficulty: 'easy' },
    { id: 17, sentence: 'Corro o camino',                       variables: { p: 'corro', q: 'camino' },           solution: ['p', '∨', 'q'],            difficulty: 'easy' },
    { id: 18, sentence: 'No tengo internet',                    variables: { p: 'internet' },                     solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 19, sentence: 'Si practico, mejoro',                  variables: { p: 'practico', q: 'mejoro' },        solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 20, sentence: 'Leo y escucho música',                 variables: { p: 'leo', q: 'música' },             solution: ['p', '∧', 'q'],            difficulty: 'easy' },
    { id: 37, sentence: 'Duermo o leo',                         variables: { p: 'duermo', q: 'leo' },             solution: ['p', '∨', 'q'],            difficulty: 'easy' },
    { id: 38, sentence: 'No hay clase hoy',                     variables: { p: 'clase' },                        solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 39, sentence: 'Si pago, entro',                       variables: { p: 'pago', q: 'entro' },             solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 40, sentence: 'Juego y me divierto',                  variables: { p: 'juego', q: 'divierto' },         solution: ['p', '∧', 'q'],            difficulty: 'easy' },
    { id: 41, sentence: 'Nado o pedaleo',                       variables: { p: 'nado', q: 'pedaleo' },           solution: ['p', '∨', 'q'],            difficulty: 'easy' },
    { id: 42, sentence: 'No tengo dinero',                      variables: { p: 'dinero' },                       solution: ['¬', 'p'],                 difficulty: 'easy' },
    { id: 43, sentence: 'Si tengo hambre, como',                variables: { p: 'hambre', q: 'como' },            solution: ['p', '→', 'q'],            difficulty: 'easy' },
    { id: 44, sentence: 'Escribo y pienso',                     variables: { p: 'escribo', q: 'pienso' },         solution: ['p', '∧', 'q'],            difficulty: 'easy' },

    // ══════════════════════════════════════
    // MEDIUM — paréntesis, ↔, negaciones dobles
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
    { id: 26, sentence: 'Si apruebo lógica, celebro',                       variables: { p: 'apruebo', q: 'celebro' },                   solution: ['p', '→', 'q'],                                difficulty: 'medium' },
    { id: 27, sentence: 'No es verdad que trabaje y estudie al mismo tiempo', variables: { p: 'trabaje', q: 'estudie' },                 solution: ['¬', '(', 'p', '∧', 'q', ')'],                 difficulty: 'medium' },
    { id: 28, sentence: 'Me gradúo si y solo si apruebo todo',              variables: { p: 'gradúo', q: 'apruebo' },                    solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 45, sentence: 'Si estudio o trabajo, tengo ingresos',             variables: { p: 'estudio', q: 'trabajo', r: 'ingresos' },    solution: ['(', 'p', '∨', 'q', ')', '→', 'r'],           difficulty: 'medium' },
    { id: 46, sentence: 'Salgo si y solo si termino la tarea',              variables: { p: 'salgo', q: 'tarea' },                       solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 47, sentence: 'No es cierto que corra y nade hoy',                variables: { p: 'corra', q: 'nade' },                        solution: ['¬', '(', 'p', '∧', 'q', ')'],                 difficulty: 'medium' },
    { id: 48, sentence: 'Si no duermo bien, no rindo',                      variables: { p: 'duermo', q: 'rindo' },                      solution: ['¬', 'p', '→', '¬', 'q'],                      difficulty: 'medium' },
    { id: 49, sentence: 'Si pago y reservo, viajo',                         variables: { p: 'pago', q: 'reservo', r: 'viajo' },          solution: ['(', 'p', '∧', 'q', ')', '→', 'r'],           difficulty: 'medium' },
    { id: 50, sentence: 'Gano si y solo si me esfuerzo',                    variables: { p: 'gano', q: 'esfuerzo' },                     solution: ['p', '↔', 'q'],                                difficulty: 'medium' },
    { id: 51, sentence: 'No es verdad que llueva o haya viento',            variables: { p: 'llueva', q: 'viento' },                     solution: ['¬', '(', 'p', '∨', 'q', ')'],                 difficulty: 'medium' },
    { id: 52, sentence: 'Si no tengo auto, uso el bus',                     variables: { p: 'auto', q: 'bus' },                          solution: ['¬', 'p', '→', 'q'],                           difficulty: 'medium' },

    // ══════════════════════════════════════
    // HARD — fórmulas complejas, 3-4 vars
    // ══════════════════════════════════════
    { id: 9,  sentence: 'Llueve o hace sol, pero no ambos',                          variables: { p: 'llueve', q: 'sol' },                                    solution: ['(', 'p', '∨', 'q', ')', '∧', '¬', '(', 'p', '∧', 'q', ')'],               difficulty: 'hard' },
    { id: 10, sentence: 'Si apruebo lógica, me gradúo y celebro',                    variables: { p: 'apruebo', q: 'gradúo', r: 'celebro' },                  solution: ['p', '→', '(', 'q', '∧', 'r', ')'],                                         difficulty: 'hard' },
    { id: 11, sentence: 'No estudio ni descanso',                                    variables: { p: 'estudio', q: 'descanso' },                              solution: ['¬', 'p', '∧', '¬', 'q'],                                                   difficulty: 'hard' },
    { id: 12, sentence: 'Voy al cine si y solo si no tengo tarea',                   variables: { p: 'cine', q: 'tarea' },                                    solution: ['p', '↔', '¬', 'q'],                                                        difficulty: 'hard' },
    { id: 29, sentence: 'Si estudio y practico, apruebo o mejoro',                   variables: { p: 'estudio', q: 'practico', r: 'apruebo', s: 'mejoro' },   solution: ['(', 'p', '∧', 'q', ')', '→', '(', 'r', '∨', 's', ')'],                   difficulty: 'hard' },
    { id: 30, sentence: 'No es cierto que no llueva y no haga sol',                  variables: { p: 'llueve', q: 'sol' },                                    solution: ['¬', '(', '¬', 'p', '∧', '¬', 'q', ')'],                                   difficulty: 'hard' },
    { id: 31, sentence: 'Salgo si y solo si no llueve y tengo tiempo',               variables: { p: 'salgo', q: 'llueve', r: 'tiempo' },                     solution: ['p', '↔', '(', '¬', 'q', '∧', 'r', ')'],                                   difficulty: 'hard' },
    { id: 32, sentence: 'Si llueve o nieva, no salgo y me abrigo',                   variables: { p: 'llueve', q: 'nieva', r: 'salgo', s: 'abrigo' },         solution: ['(', 'p', '∨', 'q', ')', '→', '(', '¬', 'r', '∧', 's', ')'],             difficulty: 'hard' },
    { id: 33, sentence: 'No trabajo ni duermo bien hoy',                             variables: { p: 'trabajo', q: 'duermo' },                                solution: ['¬', 'p', '∧', '¬', 'q'],                                                   difficulty: 'hard' },
    { id: 34, sentence: 'Apruebo si y solo si estudio y no falto',                   variables: { p: 'apruebo', q: 'estudio', r: 'falto' },                   solution: ['p', '↔', '(', 'q', '∧', '¬', 'r', ')'],                                   difficulty: 'hard' },
    { id: 35, sentence: 'Trabajo o estudio, pero no los dos',                        variables: { p: 'trabajo', q: 'estudio' },                               solution: ['(', 'p', '∨', 'q', ')', '∧', '¬', '(', 'p', '∧', 'q', ')'],             difficulty: 'hard' },
    { id: 36, sentence: 'Si no como ni duermo, me enfermo',                          variables: { p: 'como', q: 'duermo', r: 'enfermo' },                     solution: ['(', '¬', 'p', '∧', '¬', 'q', ')', '→', 'r'],                             difficulty: 'hard' },
    { id: 53, sentence: 'Si gano o ahorro, invierto y viajo',                        variables: { p: 'gano', q: 'ahorro', r: 'invierto', s: 'viajo' },        solution: ['(', 'p', '∨', 'q', ')', '→', '(', 'r', '∧', 's', ')'],                   difficulty: 'hard' },
    { id: 54, sentence: 'No es cierto que no estudie o no trabaje',                  variables: { p: 'estudie', q: 'trabaje' },                               solution: ['¬', '(', '¬', 'p', '∨', '¬', 'q', ')'],                                   difficulty: 'hard' },
    { id: 55, sentence: 'Juego si y solo si no tengo trabajo ni tarea',              variables: { p: 'juego', q: 'trabajo', r: 'tarea' },                     solution: ['p', '↔', '(', '¬', 'q', '∧', '¬', 'r', ')'],                             difficulty: 'hard' },
    { id: 56, sentence: 'Si practico y descanso, mejoro o no me canso',              variables: { p: 'practico', q: 'descanso', r: 'mejoro', s: 'canso' },    solution: ['(', 'p', '∧', 'q', ')', '→', '(', 'r', '∨', '¬', 's', ')'],             difficulty: 'hard' },
    { id: 57, sentence: 'Me gradúo o trabajo, pero no ninguno de los dos',           variables: { p: 'gradúo', q: 'trabajo' },                                solution: ['(', 'p', '∨', 'q', ')', '∧', '¬', '(', 'p', '∧', 'q', ')'],             difficulty: 'hard' },
    { id: 58, sentence: 'Si no estudio ni practico, repruebo',                       variables: { p: 'estudio', q: 'practico', r: 'repruebo' },               solution: ['(', '¬', 'p', '∧', '¬', 'q', ')', '→', 'r'],                             difficulty: 'hard' },
    { id: 59, sentence: 'Salgo si y solo si no llueve y no hace frío',               variables: { p: 'salgo', q: 'llueve', r: 'frío' },                       solution: ['p', '↔', '(', '¬', 'q', '∧', '¬', 'r', ')'],                             difficulty: 'hard' },
    { id: 60, sentence: 'Si apruebo y me gradúo, celebro y descanso',                variables: { p: 'apruebo', q: 'gradúo', r: 'celebro', s: 'descanso' },   solution: ['(', 'p', '∧', 'q', ')', '→', '(', 'r', '∧', 's', ')'],                   difficulty: 'hard' },
]
