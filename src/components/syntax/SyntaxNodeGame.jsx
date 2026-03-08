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

const MAX_TIME = 60 // seconds per exercise

// ── Hint generator — gives clues without revealing the answer ──
const CONNECTOR_NAMES = {
    '∧': 'conjunción (∧)',
    '∨': 'disyunción (∨)',
    '→': 'condicional (→)',
    '↔': 'bicondicional (↔)',
    '¬': 'negación (¬)',
}

function generateHints(exercise, playerTokens) {
    const sol = exercise.solution
    const hints = []

    // Hint 1: expected length
    if (playerTokens.length !== sol.length) {
        if (playerTokens.length < sol.length) {
            hints.push(`Tu fórmula es muy corta. Se esperan ${sol.length} elementos.`)
        } else {
            hints.push(`Tu fórmula es muy larga. Se esperan ${sol.length} elementos.`)
        }
    }

    // Hint 2: which connectors are needed
    const solConnectors = sol.filter(t => Object.keys(CONNECTOR_NAMES).includes(t))
    const playerConnectors = playerTokens.filter(t => Object.keys(CONNECTOR_NAMES).includes(t))
    const uniqueSolConn = [...new Set(solConnectors)]

    const missingConns = uniqueSolConn.filter(c => !playerConnectors.includes(c))
    if (missingConns.length > 0) {
        const names = missingConns.map(c => CONNECTOR_NAMES[c]).join(', ')
        hints.push(`Necesitas usar: ${names}`)
    }

    // Hint 3: parentheses needed?
    const solHasParens = sol.includes('(') || sol.includes(')')
    const playerHasParens = playerTokens.includes('(') || playerTokens.includes(')')
    if (solHasParens && !playerHasParens) {
        hints.push('Esta fórmula requiere paréntesis para agrupar correctamente.')
    } else if (!solHasParens && playerHasParens) {
        hints.push('Esta fórmula no necesita paréntesis.')
    }

    // Hint 4: negation check
    const solNegCount = sol.filter(t => t === '¬').length
    const playerNegCount = playerTokens.filter(t => t === '¬').length
    if (solNegCount > playerNegCount) {
        hints.push('Revisa si necesitas agregar alguna negación (¬).')
    } else if (solNegCount < playerNegCount) {
        hints.push('Tienes negaciones de más. Revisa cuáles son necesarias.')
    }

    // Fallback
    if (hints.length === 0) {
        hints.push('Estás cerca. Revisa el orden de los elementos.')
    }

    return hints.slice(0, 3) // max 3 hints
}

export default function SyntaxNodeGame() {
    const navigate = useNavigate()
    const { exercises, currentExerciseIndex, score, submitAnswer, nextExercise, gameFinished } = useGameStore()
    const [tokens, setTokens] = useState([])
    const [feedback, setFeedback] = useState(null)
    const [timeLeft, setTimeLeft] = useState(MAX_TIME)
    const [earnedPoints, setEarnedPoints] = useState(0)
    const timerRef = useRef(null)

    const exercise = exercises[currentExerciseIndex]

    // Calculate time-based points
    const calcPoints = (remaining) => Math.max(10, Math.round(100 * (remaining / MAX_TIME)))

    // Reset timer on each new exercise
    useEffect(() => {
        setTimeLeft(MAX_TIME)
    }, [currentExerciseIndex])

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
            setFeedback({ type: 'timeout' })
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

    const handleClear = useCallback(() => {
        if (feedback) return
        setTokens([])
    }, [feedback])

    const handleSubmit = useCallback(() => {
        if (!exercise || tokens.length === 0 || feedback) return

        const isCorrect = compareTokenArrays(tokens, exercise.solution)

        if (isCorrect) {
            const pts = calcPoints(timeLeft)
            setEarnedPoints(pts)
            submitAnswer(true, pts)
            setFeedback({ type: 'correct', solution: formatFormula(exercise.solution) })
        } else {
            setFeedback({
                type: 'incorrect',
                hints: generateHints(exercise, tokens),
            })
        }
    }, [exercise, tokens, feedback, submitAnswer, timeLeft])

    const handleRetry = useCallback(() => {
        setFeedback(null)
        setTokens([])
    }, [])

    const handleNext = useCallback(() => {
        setFeedback(null)
        setTokens([])
        nextExercise()
    }, [nextExercise])

    // Early return AFTER all hooks
    if (gameFinished || !exercise) return null

    const availableVars = Object.keys(exercise.variables)
    const timerPct = timeLeft / MAX_TIME
    const timerColor = timerPct > 0.5 ? '#00FF41' : timerPct > 0.2 ? '#FFD700' : '#FF0040'

    return (
        <motion.div
            className="min-h-screen py-6 px-4 flex flex-col items-center"
            style={{ background: '#050510' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-6">
                <h2
                    className="text-2xl md:text-3xl font-black text-[#00FF41] text-glow-verde"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                    SYNTAX NODE
                </h2>
                <div className="flex items-center gap-6">
                    {/* Timer */}
                    <div className="flex flex-col items-center gap-1">
                        <span
                            className="text-xs font-[Orbitron] tracking-widest uppercase"
                            style={{ color: timerColor, textShadow: `0 0 8px ${timerColor}60` }}
                        >
                            TIEMPO
                        </span>
                        <span
                            className="text-3xl font-bold font-[Orbitron]"
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
                                className="flex flex-col items-center gap-4 p-10"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                style={{
                                    background: '#0A0A2E',
                                    border: '2px solid #00FF41',
                                    boxShadow: '0 0 30px rgba(0,255,65,0.4), 0 0 60px rgba(0,255,65,0.2)',
                                }}
                            >
                                <span className="text-5xl">✓</span>
                                <p className="text-3xl font-black text-[#00FF41] text-glow-verde"
                                    style={{ fontFamily: "'Orbitron'" }}>
                                    CORRECTO
                                </p>
                                <p className="text-[#00FF41]/70 text-lg">+{earnedPoints} pts</p>
                                <div className="text-center mt-2">
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Fórmula:</p>
                                    <p className="text-xl text-[#00FFFF]"
                                        style={{ fontFamily: "'Share Tech Mono'" }}>
                                        {feedback.solution}
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <NeonButton color="verde" size="sm" onClick={handleNext}>
                                        SIGUIENTE →
                                    </NeonButton>
                                </div>
                            </motion.div>
                        ) : feedback.type === 'timeout' ? (
                            <motion.div
                                className="flex flex-col items-center gap-4 p-10"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                style={{
                                    background: '#0A0A2E',
                                    border: '2px solid #FF0040',
                                    boxShadow: '0 0 30px rgba(255,0,64,0.4), 0 0 60px rgba(255,0,64,0.2)',
                                }}
                            >
                                <span className="text-5xl">⏰</span>
                                <p className="text-2xl font-black text-[#FF0040]"
                                    style={{ fontFamily: "'Orbitron'" }}>
                                    TIEMPO AGOTADO
                                </p>
                                <p className="text-[#FF0040]/60 text-sm">+0 pts</p>
                                <div className="flex gap-3 mt-4">
                                    <NeonButton color="verde" size="sm" onClick={handleRetry}>
                                        REINTENTAR
                                    </NeonButton>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex flex-col items-center gap-4 p-10 max-w-md"
                                initial={{ x: -20 }}
                                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    background: '#0A0A2E',
                                    border: '2px solid #FF0040',
                                    boxShadow: '0 0 30px rgba(255,0,64,0.4)',
                                }}
                            >
                                <span className="text-5xl">✗</span>
                                <p className="text-2xl font-black text-[#FF0040]"
                                    style={{ fontFamily: "'Orbitron'" }}>
                                    INCORRECTO
                                </p>
                                <div className="text-center mt-3">
                                    <p className="text-xs text-[#FFD700]/60 uppercase tracking-widest mb-2"
                                        style={{ fontFamily: "'Orbitron'" }}>
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
                                <div className="flex gap-3 mt-4">
                                    <NeonButton color="verde" size="sm" onClick={handleRetry}>
                                        REINTENTAR
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
