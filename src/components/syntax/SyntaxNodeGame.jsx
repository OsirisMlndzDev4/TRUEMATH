import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../../store/useGameStore'
import { compareTokenArrays, formatFormula } from '../../utils/logicEngine'
import ScoreDisplay from '../ui/ScoreDisplay'
import NeonButton from '../ui/NeonButton'
import HolographicCard from '../ui/HolographicCard'
import ExerciseBanner from './ExerciseBanner'
import SymbolPalette from './SymbolPalette'
import ConstructionZone from './ConstructionZone'
import { playCorrect, playError, playAlarm } from '../../utils/sounds'

// ── Configuración por dificultad ──
const DIFFICULTY_CONFIG = {
    easy:   { time: 45, basePoints: 100, multiplier: 0.75, minPoints: 8 },
    medium: { time: 60, basePoints: 100, multiplier: 1.2,  minPoints: 12 },
    hard:   { time: 90, basePoints: 100, multiplier: 2.5,  minPoints: 25 },
}
const DEFAULT_CONFIG = DIFFICULTY_CONFIG.medium


// Palabras clave en oraciones que mapean a conectores lógicos
const KEYWORD_HINTS = {
    '∧': [' y ', ' ni '],
    '∨': [' o '],
    '→': ['si ', 'entonces'],
    '↔': ['si y solo si'],
    '¬': ['no ', 'ni ', 'no es verdad', 'no es cierto'],
}

function getTimeForDifficulty(difficulty) {
    return (DIFFICULTY_CONFIG[difficulty] || DEFAULT_CONFIG).time
}

function generateHints(exercise, playerTokens) {
    const sol = exercise.solution
    const sentence = exercise.sentence.toLowerCase()
    const hints = []

    const solConnectors = sol.filter(t => ['∧', '∨', '→', '↔', '¬'].includes(t))
    const playerConnectors = playerTokens.filter(t => ['∧', '∨', '→', '↔', '¬'].includes(t))
    const solHasParens = sol.includes('(')
    const playerHasParens = playerTokens.includes('(')
    const solNegCount = sol.filter(t => t === '¬').length
    const playerNegCount = playerTokens.filter(t => t === '¬').length

    // Hint: longitud (sin revelar el número exacto)
    if (playerTokens.length !== sol.length) {
        const diff = sol.length - playerTokens.length
        if (diff > 2) {
            hints.push('Tu fórmula parece bastante incompleta. Revisa si faltan operadores o agrupaciones.')
        } else if (diff > 0) {
            hints.push('Estás cerca, pero faltan algunos elementos.')
        } else if (diff < -2) {
            hints.push('Tu fórmula tiene varios elementos de más. Intenta simplificar.')
        } else {
            hints.push('Tu fórmula tiene algún elemento extra. Revisa qué sobra.')
        }
    }

    // Hint: conectores faltantes (guía hacia la palabra clave en la oración, no revela el símbolo)
    const missingConns = [...new Set(solConnectors)].filter(c => !playerConnectors.includes(c))
    for (const conn of missingConns) {
        const keywords = KEYWORD_HINTS[conn] || []
        const found = keywords.find(kw => sentence.includes(kw))
        if (found) {
            hints.push(`Observa la palabra "${found.trim()}" en la oración. ¿Qué conector lógico representa?`)
            break
        }
    }

    // Hint: paréntesis
    if (solHasParens && !playerHasParens) {
        hints.push('Hay una idea compuesta que debe evaluarse junta antes del conector principal. ¿Necesitas agrupar algo?')
    } else if (!solHasParens && playerHasParens) {
        hints.push('Esta fórmula no necesita agrupaciones extra. Intenta sin paréntesis.')
    }

    // Hint: negación
    if (solNegCount > playerNegCount) {
        if (sentence.includes('no es') || sentence.includes('no es cierto')) {
            hints.push('Fíjate en "no es cierto que..." o "no es verdad que...". ¿Qué parte de la oración se niega?')
        } else if (sentence.includes(' ni ')) {
            hints.push('La palabra "ni" implica negaciones. ¿Estás negando cada parte?')
        } else {
            hints.push('Busca las palabras "no" o "ni" en la oración. Hay alguna negación que no has traducido.')
        }
    } else if (solNegCount < playerNegCount) {
        hints.push('Tienes más negaciones de las necesarias. Revisa cuáles realmente aparecen en la oración.')
    }

    // Hint: orden (tokens correctos pero desordenados)
    if (hints.length === 0 && playerTokens.length === sol.length) {
        const sortedPlayer = [...playerTokens].sort().join()
        const sortedSol = [...sol].sort().join()
        if (sortedPlayer === sortedSol) {
            hints.push('Tienes los elementos correctos pero en orden incorrecto. ¿Cuál es la idea principal de la oración?')
        }
    }

    if (hints.length === 0) {
        hints.push('Estás cerca. Lee la oración de nuevo e identifica la relación principal entre las ideas.')
    }

    return hints.slice(0, 3)
}

export default function SyntaxNodeGame() {
    const navigate = useNavigate()
    const { exercises, currentExerciseIndex, score, submitAnswer, nextExercise, gameFinished } = useGameStore()
    const [tokens, setTokens] = useState([])
    const [feedback, setFeedback] = useState(null)
    const [earnedPoints, setEarnedPoints] = useState(0)
    const timerRef = useRef(null)

    const exercise = exercises[currentExerciseIndex]
    const diffConfig = exercise ? (DIFFICULTY_CONFIG[exercise.difficulty] || DEFAULT_CONFIG) : DEFAULT_CONFIG
    const maxTime = diffConfig.time

    const [timeLeft, setTimeLeft] = useState(maxTime)

    const calcPoints = (remaining) => {
        const { basePoints, multiplier, minPoints } = diffConfig
        return Math.max(minPoints, Math.round(basePoints * multiplier * (remaining / maxTime)))
    }

    useEffect(() => {
        setTimeLeft(getTimeForDifficulty(exercise?.difficulty))
    }, [currentExerciseIndex, exercise?.difficulty])

    // Timer countdown
    useEffect(() => {
        if (gameFinished || !exercise || feedback) return

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timerRef.current)
    }, [gameFinished, exercise, feedback, currentExerciseIndex])

    // Handle time expiry
    useEffect(() => {
        if (timeLeft === 0 && !feedback && exercise) {
            playAlarm()
            setFeedback({ type: 'timeout', solution: formatFormula(exercise.solution) })
        }
    }, [timeLeft, feedback, exercise])

    // Redirect to game over when finished
    useEffect(() => {
        if (gameFinished) {
            navigate('/gameover')
        }
    }, [gameFinished, navigate])

    const handleAddToken = useCallback((token) => {
        if (feedback) return
        setTokens((prev) => [...prev, token])
    }, [feedback])

    const handleRemoveToken = useCallback((index) => {
        if (feedback) return
        setTokens((prev) => prev.filter((_, i) => i !== index))
    }, [feedback])

    const handleDeleteLast = useCallback(() => {
        if (feedback) return
        setTokens((prev) => prev.slice(0, -1))
    }, [feedback])

    const handleClear = useCallback(() => {
        if (feedback) return
        setTokens([])
    }, [feedback])

    const handleSubmit = useCallback(() => {
        if (!exercise || tokens.length === 0 || feedback) return

        const isCorrect = compareTokenArrays(tokens, exercise.solution)

        if (isCorrect) {
            playCorrect()
            const pts = calcPoints(timeLeft)
            setEarnedPoints(pts)
            submitAnswer(true, pts)
            setFeedback({ type: 'correct', solution: formatFormula(exercise.solution) })
        } else {
            playError()
            setFeedback({
                type: 'incorrect',
                hints: generateHints(exercise, tokens),
            })
        }
    }, [exercise, tokens, feedback, submitAnswer, timeLeft])

    const handleRetry = useCallback(() => {
        setFeedback(null)
    }, [])

    const handleNext = useCallback(() => {
        const nextIdx = currentExerciseIndex + 1
        const nextDiff = exercises[nextIdx]?.difficulty
        setTimeLeft(getTimeForDifficulty(nextDiff))
        setFeedback(null)
        setTokens([])
        nextExercise()
    }, [nextExercise, exercises, currentExerciseIndex])

    // Early return AFTER all hooks
    if (gameFinished || !exercise) return null

    const availableVars = Object.keys(exercise.variables)
    const timerPct = timeLeft / maxTime
    const timerColor = timerPct > 0.5 ? '#00FF41' : timerPct > 0.2 ? '#FFD700' : '#FF0040'

    const DIFFICULTY_LABELS = { easy: 'FÁCIL', medium: 'INTERMEDIO', hard: 'DIFÍCIL' }
    const DIFFICULTY_COLORS = { easy: '#00FF41', medium: '#FFD700', hard: '#FF0040' }
    const diffLabel = DIFFICULTY_LABELS[exercise.difficulty] || exercise.difficulty
    const diffColor = DIFFICULTY_COLORS[exercise.difficulty] || '#00FFFF'

    return (
        <motion.div
            className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 flex flex-col items-center"
            style={{ background: '#050510' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <div>
                    <h2
                        className="text-xl sm:text-2xl md:text-3xl font-black text-[#00FF41] text-glow-verde"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        SYNTAX NODE
                    </h2>
                    <p style={{
                        fontFamily: "'Orbitron'",
                        fontSize: '0.55rem',
                        letterSpacing: '0.25em',
                        color: 'rgba(0,255,65,0.5)',
                        marginTop: '0.25rem',
                    }}>
                        Ejercicio {currentExerciseIndex + 1} / {exercises.length}
                        {' — '}
                        <span style={{ color: diffColor, textShadow: `0 0 8px ${diffColor}40` }}>
                            {diffLabel}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Timer */}
                    <div className="flex flex-col items-center gap-1">
                        <span
                            className="text-xs font-[Orbitron] tracking-widest uppercase"
                            style={{ color: timerColor, textShadow: `0 0 8px ${timerColor}60` }}
                        >
                            TIEMPO
                        </span>
                        <span
                            className="text-2xl sm:text-3xl font-bold font-[Orbitron]"
                            style={{
                                color: timerColor,
                                textShadow: `0 0 12px ${timerColor}80, 0 0 24px ${timerColor}40`,
                            }}
                        >
                            {timeLeft}s
                        </span>
                    </div>
                    <ScoreDisplay score={score} color="#00FF41" />
                </div>
            </div>

            {/* Timer bar */}
            <div className="w-full max-w-2xl mb-4" style={{ height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                    style={{
                        height: '100%',
                        background: timerColor,
                        boxShadow: `0 0 8px ${timerColor}80`,
                        width: `${timerPct * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Exercise content */}
            <div className="w-full max-w-2xl flex flex-col gap-5">
                <HolographicCard color="verde">
                    <ExerciseBanner
                        sentence={exercise.sentence}
                        variables={exercise.variables}
                        exerciseNum={currentExerciseIndex + 1}
                        totalExercises={exercises.length}
                    />
                </HolographicCard>

                <HolographicCard color="cyan">
                    <SymbolPalette onAddToken={handleAddToken} availableVars={availableVars} />
                </HolographicCard>

                <HolographicCard color="verde">
                    <ConstructionZone tokens={tokens} onRemoveToken={handleRemoveToken} />
                </HolographicCard>

                {/* Action buttons */}
                <div className="flex gap-3 justify-center flex-wrap">
                    <NeonButton color="verde" onClick={handleSubmit} disabled={tokens.length === 0 || !!feedback}>
                        ✓ VERIFICAR
                    </NeonButton>
                    <NeonButton color="magenta" onClick={handleDeleteLast} disabled={tokens.length === 0 || !!feedback}>
                        ← BORRAR
                    </NeonButton>
                    <NeonButton color="magenta" onClick={handleClear} disabled={tokens.length === 0 || !!feedback}>
                        ⌫ LIMPIAR
                    </NeonButton>
                    <NeonButton color="cyan" size="sm" onClick={() => { navigate('/'); useGameStore.getState().resetGame(); }}>
                        SALIR
                    </NeonButton>
                </div>
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ background: 'rgba(5,5,16,0.85)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {feedback.type === 'correct' ? (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                style={{
                                    padding: 'clamp(2.5rem, 6vw, 3.5rem) clamp(3rem, 8vw, 5rem)',
                                    gap: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    background: '#0A0A2E',
                                    border: '2px solid #00FF41',
                                    boxShadow: '0 0 30px rgba(0,255,65,0.4), 0 0 60px rgba(0,255,65,0.2)',
                                }}
                            >
                                <span className="text-4xl sm:text-5xl">✓</span>
                                <p className="text-2xl sm:text-3xl font-black text-[#00FF41] text-glow-verde"
                                    style={{ fontFamily: "'Orbitron'" }}>
                                    CORRECTO
                                </p>
                                <p className="text-[#00FF41]/70 text-lg sm:text-xl">+{earnedPoints} pts</p>
                                <div className="text-center" style={{ marginTop: '0.25rem' }}>
                                    <p className="text-xs text-white/40 uppercase tracking-widest" style={{ marginBottom: '0.5rem' }}>Fórmula:</p>
                                    <p className="text-xl sm:text-2xl text-[#00FFFF]"
                                        style={{ fontFamily: "'Share Tech Mono'" }}>
                                        {feedback.solution}
                                    </p>
                                </div>
                                <div className="flex gap-3" style={{ marginTop: '0.5rem' }}>
                                    <NeonButton color="verde" size="sm" onClick={handleNext}>
                                        SIGUIENTE →
                                    </NeonButton>
                                </div>
                            </motion.div>
                        ) : feedback.type === 'timeout' ? (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                style={{
                                    padding: 'clamp(2.5rem, 6vw, 3.5rem) clamp(3rem, 8vw, 5rem)',
                                    gap: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    background: '#0A0A2E',
                                    border: '2px solid #FF0040',
                                    boxShadow: '0 0 30px rgba(255,0,64,0.4), 0 0 60px rgba(255,0,64,0.2)',
                                }}
                            >
                                <span className="text-4xl sm:text-5xl">⏰</span>
                                <p className="text-2xl sm:text-3xl font-black text-[#FF0040]"
                                    style={{ fontFamily: "'Orbitron'" }}>
                                    TIEMPO AGOTADO
                                </p>
                                <p className="text-[#FF0040]/60 text-sm sm:text-base">+0 pts</p>
                                <div className="text-center" style={{ marginTop: '0.25rem' }}>
                                    <p className="text-xs text-white/40 uppercase tracking-widest" style={{ marginBottom: '0.5rem' }}>Respuesta correcta:</p>
                                    <p className="text-xl sm:text-2xl text-[#00FFFF]"
                                        style={{ fontFamily: "'Share Tech Mono'" }}>
                                        {feedback.solution}
                                    </p>
                                </div>
                                <div className="flex gap-3" style={{ marginTop: '0.5rem' }}>
                                    <NeonButton color="verde" size="sm" onClick={handleNext}>
                                        SIGUIENTE →
                                    </NeonButton>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ x: -20 }}
                                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    padding: 'clamp(2.5rem, 6vw, 3.5rem) clamp(3rem, 8vw, 5rem)',
                                    gap: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    maxWidth: '28rem',
                                    background: '#0A0A2E',
                                    border: '2px solid #FF0040',
                                    boxShadow: '0 0 30px rgba(255,0,64,0.4)',
                                }}
                            >
                                <span className="text-4xl sm:text-5xl">✗</span>
                                <p className="text-2xl sm:text-3xl font-black text-[#FF0040]"
                                    style={{ fontFamily: "'Orbitron'" }}>
                                    INCORRECTO
                                </p>
                                <div className="text-center" style={{ marginTop: '0.25rem' }}>
                                    <p className="text-xs text-[#FFD700]/60 uppercase tracking-widest"
                                        style={{ fontFamily: "'Orbitron'", marginBottom: '0.75rem' }}>
                                        💡 PISTAS
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {feedback.hints.map((hint, i) => (
                                            <p key={i} className="text-sm text-[#FFD700]/80"
                                                style={{ fontFamily: "'Share Tech Mono'" }}>
                                                ▸ {hint}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3" style={{ marginTop: '0.5rem' }}>
                                    <NeonButton color="verde" size="sm" onClick={handleRetry}>
                                        CORREGIR →
                                    </NeonButton>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
