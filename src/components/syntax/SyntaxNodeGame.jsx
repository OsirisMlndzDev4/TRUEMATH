import { useState, useCallback, useEffect } from 'react'
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

export default function SyntaxNodeGame() {
    const navigate = useNavigate()
    const { exercises, currentExerciseIndex, score, submitAnswer, nextExercise, gameFinished } = useGameStore()
    const [tokens, setTokens] = useState([])
    const [feedback, setFeedback] = useState(null)

    const exercise = exercises[currentExerciseIndex]

    // Redirect to game over when finished
    useEffect(() => {
        if (gameFinished) {
            navigate('/gameover')
        }
    }, [gameFinished, navigate])

    // All hooks MUST be above the early return
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
            submitAnswer(true, 100)
            setFeedback({ type: 'correct' })
            setTimeout(() => {
                setFeedback(null)
                setTokens([])
                nextExercise()
            }, 1500)
        } else {
            setFeedback({
                type: 'incorrect',
                solution: formatFormula(exercise.solution),
            })
        }
    }, [exercise, tokens, feedback, submitAnswer, nextExercise])

    const handleRetry = useCallback(() => {
        setFeedback(null)
        setTokens([])
    }, [])

    const handleSkip = useCallback(() => {
        setFeedback(null)
        setTokens([])
        nextExercise()
    }, [nextExercise])

    // Early return AFTER all hooks
    if (gameFinished || !exercise) return null

    const availableVars = Object.keys(exercise.variables)

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
                <ScoreDisplay score={score} color="#00FF41" />
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
                                <p className="text-[#00FF41]/70 text-lg">+100 pts</p>
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
                                <div className="text-center mt-2">
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Solución:</p>
                                    <p className="text-xl text-[#00FFFF]"
                                        style={{ fontFamily: "'Share Tech Mono'" }}>
                                        {feedback.solution}
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <NeonButton color="verde" size="sm" onClick={handleRetry}>
                                        REINTENTAR
                                    </NeonButton>
                                    <NeonButton color="magenta" size="sm" onClick={handleSkip}>
                                        SIGUIENTE
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
