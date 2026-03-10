import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BinaryBackground from '../components/ui/BinaryBackground'
import NeonButton from '../components/ui/NeonButton'
import useGameStore from '../store/useGameStore'

const DIFFICULTIES = [
    {
        key: 'facil',
        label: 'FÁCIL',
        color: '#00FF41',
        shadow: 'rgba(0,255,65,0.4)',
        border: 'rgba(0,255,65,0.6)',
        bg: 'rgba(0,255,65,0.05)',
        icon: '◈',
        desc: 'Fórmulas simples: ∧, ∨, ¬, →',
        count: 12,
    },
    {
        key: 'medio',
        label: 'MEDIO',
        color: '#FFD700',
        shadow: 'rgba(255,215,0,0.4)',
        border: 'rgba(255,215,0,0.6)',
        bg: 'rgba(255,215,0,0.05)',
        icon: '◉',
        desc: 'Paréntesis, ↔ y negaciones compuestas',
        count: 12,
    },
    {
        key: 'dificil',
        label: 'DIFÍCIL',
        color: '#FF0040',
        shadow: 'rgba(255,0,64,0.4)',
        border: 'rgba(255,0,64,0.6)',
        bg: 'rgba(255,0,64,0.05)',
        icon: '◆',
        desc: 'Fórmulas complejas con múltiples operadores',
        count: 12,
    },
]

export default function SyntaxDifficultyScreen() {
    const navigate = useNavigate()
    const startGame = useGameStore((s) => s.startGame)
    const resetGame = useGameStore((s) => s.resetGame)

    const handleSelect = (diffKey) => {
        startGame('syntax', diffKey)
        navigate('/syntax')
    }

    const handleBack = () => {
        resetGame()
        navigate('/')
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <BinaryBackground />

            <motion.div
                className="relative z-10 flex flex-col items-center gap-10 px-4 w-full max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="text-center">
                    <p
                        className="text-xs tracking-[0.4em] uppercase mb-2"
                        style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            color: 'rgba(0,255,65,0.6)',
                        }}
                    >
                        MÓDULO 1 // SYNTAX NODE
                    </p>
                    <motion.h1
                        className="text-4xl md:text-5xl font-black"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            color: '#00FF41',
                            textShadow: '0 0 20px rgba(0,255,65,0.6), 0 0 40px rgba(0,255,65,0.3)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        SELECCIONA
                    </motion.h1>
                    <motion.h2
                        className="text-2xl md:text-3xl font-black mt-1"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            color: '#00FFFF',
                            textShadow: '0 0 15px rgba(0,255,255,0.5)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        DIFICULTAD
                    </motion.h2>
                </div>

                {/* Difficulty cards */}
                <div className="flex flex-col gap-4 w-full">
                    {DIFFICULTIES.map((diff, i) => (
                        <motion.button
                            key={diff.key}
                            onClick={() => handleSelect(diff.key)}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            whileHover={{ scale: 1.02, x: 6 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-5 px-6 py-5 text-left cursor-pointer"
                            style={{
                                background: diff.bg,
                                border: `1px solid ${diff.border}`,
                                boxShadow: `0 0 20px ${diff.shadow}, inset 0 0 20px rgba(0,0,0,0.3)`,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {/* Icon */}
                            <span
                                className="text-4xl flex-shrink-0"
                                style={{
                                    color: diff.color,
                                    textShadow: `0 0 12px ${diff.shadow}`,
                                }}
                            >
                                {diff.icon}
                            </span>

                            {/* Text */}
                            <div className="flex-1">
                                <p
                                    className="text-xl font-black mb-1"
                                    style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        color: diff.color,
                                        textShadow: `0 0 10px ${diff.shadow}`,
                                    }}
                                >
                                    {diff.label}
                                </p>
                                <p
                                    className="text-sm"
                                    style={{
                                        fontFamily: "'Share Tech Mono', monospace",
                                        color: 'rgba(255,255,255,0.5)',
                                    }}
                                >
                                    {diff.desc}
                                </p>
                            </div>

                            {/* Arrow */}
                            <span
                                className="text-2xl flex-shrink-0"
                                style={{ color: diff.color, opacity: 0.7 }}
                            >
                                ›
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <NeonButton color="cyan" size="sm" onClick={handleBack}>
                        ← VOLVER
                    </NeonButton>
                </motion.div>
            </motion.div>
        </div>
    )
}
