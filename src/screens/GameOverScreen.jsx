import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useGameStore from '../store/useGameStore'
import { getGrade } from '../utils/logicEngine'
import { saveScore } from '../utils/leaderboard'
import NeonButton from '../components/ui/NeonButton'

export default function GameOverScreen() {
    const navigate = useNavigate()
    const { score, currentModule, resetGame, startGame } = useGameStore()
    const [playerName, setPlayerName] = useState('')
    const [saved, setSaved] = useState(false)
    const [displayScore, setDisplayScore] = useState(0)

    const grade = getGrade(score)

    // Count-up animation
    useEffect(() => {
        if (score === 0) return
        const duration = 1500
        const steps = 60
        const increment = score / steps
        let current = 0
        let step = 0
        const interval = setInterval(() => {
            step++
            current = Math.min(Math.round(increment * step), score)
            setDisplayScore(current)
            if (step >= steps) clearInterval(interval)
        }, duration / steps)
        return () => clearInterval(interval)
    }, [score])

    const handleSave = async () => {
        if (!playerName.trim()) return
        await saveScore(currentModule, {
            name: playerName.trim().toUpperCase(),
            score,
        })
        setSaved(true)
        setTimeout(() => navigate('/leaderboard'), 800)
    }

    const MODULE_ROUTES = { syntax: '/syntax', truth: '/truth', finder: '/finder' }

    const handlePlayAgain = () => {
        startGame(currentModule)
        navigate(MODULE_ROUTES[currentModule] || '/')
    }

    const handleHome = () => {
        resetGame()
        navigate('/')
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{ background: '#050510' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="flex flex-col items-center gap-8 max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                {/* Title */}
                <h1
                    className="text-3xl md:text-4xl font-black text-[#00FFFF] text-glow-cyan"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                    GAME OVER
                </h1>

                {/* Score */}
                <div className="text-center">
                    <p className="text-sm tracking-widest text-[#00FFFF]/60 uppercase mb-2"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        Puntuación Final
                    </p>
                    <motion.p
                        className="text-6xl md:text-7xl font-black"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            color: grade.color,
                            textShadow: `0 0 15px ${grade.color}80, 0 0 30px ${grade.color}40`,
                        }}
                    >
                        {displayScore}
                    </motion.p>
                </div>

                {/* Grade */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                >
                    <p className="text-xs tracking-widest text-white/40 uppercase mb-1">Rango</p>
                    <p
                        className="text-2xl font-bold"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            color: grade.color,
                            textShadow: `0 0 10px ${grade.color}60`,
                        }}
                    >
                        {grade.title}
                    </p>
                </motion.div>

                {/* Name input */}
                {!saved && (
                    <motion.div
                        className="w-full flex flex-col items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                    >
                        <p className="text-xs tracking-widest text-[#00FFFF]/60 uppercase text-center">
                            Ingresa tu nombre para el leaderboard
                        </p>
                        <input
                            type="text"
                            maxLength={12}
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="TU NOMBRE..."
                            className="w-full max-w-xs px-4 py-3 text-center text-lg tracking-widest uppercase bg-transparent text-[#00FFFF] outline-none"
                            style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                border: '2px solid #00FFFF',
                                boxShadow: '0 0 10px rgba(0,255,255,0.3), inset 0 0 10px rgba(0,255,255,0.05)',
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                        <NeonButton color="cyan" onClick={handleSave} disabled={!playerName.trim()}>
                            GUARDAR PUNTUACIÓN
                        </NeonButton>
                    </motion.div>
                )}

                {saved && (
                    <motion.p
                        className="text-verde text-lg font-bold text-glow-verde"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        ✓ GUARDADO
                    </motion.p>
                )}

                {/* Action buttons */}
                <motion.div
                    className="flex gap-4 flex-wrap justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.3 }}
                >
                    <NeonButton color="verde" size="sm" onClick={handlePlayAgain}>
                        JUGAR DE NUEVO
                    </NeonButton>
                    <NeonButton color="magenta" size="sm" onClick={handleHome}>
                        INICIO
                    </NeonButton>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
