import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../../store/useGameStore'
import { calculateTimeScore } from '../../utils/logicEngine'
import ScoreDisplay from '../ui/ScoreDisplay'
import TimerBar from '../ui/TimerBar'
import NeonButton from '../ui/NeonButton'
import HolographicCard from '../ui/HolographicCard'
import FormulaDisplay from './FormulaDisplay'
import TruthTableGrid from './TruthTableGrid'
import VerdictButtons from './VerdictButtons'

export default function TruthMatrixGame() {
    const navigate = useNavigate()
    const { exercises, currentExerciseIndex, score, submitAnswer, nextExercise, gameFinished, timeLeft, setTimeLeft } = useGameStore()
    const [feedback, setFeedback] = useState(null)
    const [revealTable, setRevealTable] = useState(false)
    const timerRef = useRef(null)
    const roundStartRef = useRef(Date.now())

    const exercise = exercises[currentExerciseIndex]

    // Redirect to game over when finished
    useEffect(() => {
        if (gameFinished) {
            navigate('/gameover')
        }
    }, [gameFinished, navigate])

    // All hooks MUST be above the early return
    const handleTimeout = useCallback(() => {
        if (!exercise) return
        setRevealTable(true)
        setFeedback({
            type: 'timeout',
            correct: exercise.type,
        })
    }, [exercise])

    const handleVote = useCallback((verdict) => {
        if (feedback || !exercise) return
        clearInterval(timerRef.current)

        const elapsed = Math.floor((Date.now() - roundStartRef.current) / 1000)
        const isCorrect = verdict === exercise.type
        const points = isCorrect ? calculateTimeScore(elapsed) : 0

        submitAnswer(isCorrect, points)
        setRevealTable(true)
        setFeedback({
            type: isCorrect ? 'correct' : 'incorrect',
            correct: exercise.type,
            points: isCorrect ? points : 0,
            elapsed,
        })
    }, [exercise, feedback, submitAnswer])

    const handleContinue = useCallback(() => {
        setFeedback(null)
        setRevealTable(false)
        nextExercise()
    }, [nextExercise])

    // Timer
    useEffect(() => {
        if (feedback || !exercise) return
        setTimeLeft(20)
        roundStartRef.current = Date.now()

        timerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - roundStartRef.current) / 1000)
            const remaining = Math.max(0, 20 - elapsed)
            setTimeLeft(remaining)
            if (remaining <= 0) {
                clearInterval(timerRef.current)
                handleTimeout()
            }
        }, 250)

        return () => clearInterval(timerRef.current)
    }, [currentExerciseIndex, feedback, exercise, handleTimeout, setTimeLeft])

    // Early return AFTER all hooks
    if (gameFinished || !exercise) return null

    return (
        <motion.div
            className="min-h-screen py-6 px-4 flex flex-col items-center"
            style={{ background: '#050510' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="w-full max-w-3xl flex justify-between items-start mb-4">
                <div>
                    <h2
                        className="text-2xl md:text-3xl font-black text-[#FF00FF] text-glow-magenta"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        THE TRUTH MATRIX
                    </h2>
                    <p className="text-xs text-[#FF00FF]/50 tracking-widest mt-1"
                        style={{ fontFamily: "'Orbitron'" }}>
                        Ronda {currentExerciseIndex + 1} / {exercises.length}
                    </p>
                </div>
                <ScoreDisplay score={score} color="#FF00FF" />
            </div>

            <div className="w-full max-w-3xl flex flex-col gap-4">
                {/* Timer */}
                <TimerBar timeLeft={timeLeft} maxTime={20} />

                {/* Formula */}
                <HolographicCard color="magenta">
                    <FormulaDisplay formulaDisplay={exercise.formulaDisplay} />
                </HolographicCard>

                {/* Truth Table */}
                <HolographicCard color="magenta">
                    <TruthTableGrid exercise={exercise} revealAll={revealTable} />
                </HolographicCard>

                {/* Verdict buttons */}
                {!feedback && (
                    <VerdictButtons onVote={handleVote} disabled={!!feedback} />
                )}

                {/* Exit button */}
                {!feedback && (
                    <div className="flex justify-center">
                        <NeonButton color="cyan" size="sm" onClick={() => { navigate('/'); useGameStore.getState().resetGame(); }}>
                            SALIR
                        </NeonButton>
                    </div>
                )}
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
                        <motion.div
                            className="flex flex-col items-center gap-4 p-8 max-w-md w-full mx-4"
                            initial={feedback.type === 'correct' ? { scale: 0.5 } : { x: -20 }}
                            animate={feedback.type === 'correct' ? { scale: 1 } : { x: [0, -10, 10, -10, 10, 0] }}
                            transition={feedback.type === 'correct' ? { type: 'spring', stiffness: 300, damping: 12 } : { duration: 0.5 }}
                            style={{
                                background: '#0A0A2E',
                                border: `2px solid ${feedback.type === 'correct' ? '#FF00FF' : '#FF0040'}`,
                                boxShadow: `0 0 30px ${feedback.type === 'correct' ? 'rgba(255,0,255,0.4)' : 'rgba(255,0,64,0.4)'}`,
                            }}
                        >
                            {feedback.type === 'correct' ? (
                                <>
                                    <span className="text-5xl">✓</span>
                                    <p className="text-2xl font-black text-[#FF00FF] text-glow-magenta"
                                        style={{ fontFamily: "'Orbitron'" }}>
                                        CORRECTO
                                    </p>
                                    <p className="text-[#00FF41] text-lg font-bold">+{feedback.points} pts</p>
                                    <p className="text-white/40 text-sm">Tiempo: {feedback.elapsed}s</p>
                                </>
                            ) : feedback.type === 'timeout' ? (
                                <>
                                    <span className="text-5xl">⏱</span>
                                    <p className="text-2xl font-black text-[#FF0040]"
                                        style={{ fontFamily: "'Orbitron'" }}>
                                        TIEMPO AGOTADO
                                    </p>
                                    <div className="text-center">
                                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Respuesta correcta:</p>
                                        <p className="text-xl text-[#00FFFF] font-bold">{feedback.correct}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-5xl">✗</span>
                                    <p className="text-2xl font-black text-[#FF0040]"
                                        style={{ fontFamily: "'Orbitron'" }}>
                                        INCORRECTO
                                    </p>
                                    <div className="text-center">
                                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Respuesta correcta:</p>
                                        <p className="text-xl text-[#00FFFF] font-bold">{feedback.correct}</p>
                                    </div>
                                </>
                            )}
                            <NeonButton color="magenta" size="sm" onClick={handleContinue} className="mt-3">
                                CONTINUAR →
                            </NeonButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
