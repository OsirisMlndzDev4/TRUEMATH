import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BinaryBackground from '../components/ui/BinaryBackground'
import useGameStore from '../store/useGameStore'
import '../components/finder/FinderDifficultySelect.css'

const DIFFICULTIES = [
    {
        key: 'facil',
        label: 'FÁCIL',
        color: '#00FF41',
        shadow: 'rgba(0, 255, 65, 0.4)',
        desc: 'Fórmulas simples: ∧, ∨, ¬, →',
        detail: '1–2 variables · Operadores básicos',
        levels: 10,
    },
    {
        key: 'medio',
        label: 'MEDIO',
        color: '#FFD700',
        shadow: 'rgba(255, 215, 0, 0.4)',
        desc: 'Paréntesis, ↔ y negaciones compuestas',
        detail: '2–3 variables · Agrupación y bicondicional',
        levels: 15,
    },
    {
        key: 'dificil',
        label: 'DIFÍCIL',
        color: '#FF0040',
        shadow: 'rgba(255, 0, 64, 0.4)',
        desc: 'Fórmulas complejas con múltiples operadores',
        detail: '3–4 variables · Máxima complejidad',
        levels: 12,
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
}

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
        <motion.div
            className="fds-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <BinaryBackground />
            <div className="fds-scanlines" />

            {/* Header */}
            <motion.div
                className="fds-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="fds-title" style={{ color: '#00FF41', textShadow: '0 0 10px rgba(0,255,65,0.6), 0 0 20px rgba(0,255,65,0.4), 0 0 40px rgba(0,255,65,0.2)' }}>
                    SYNTAX NODE
                </h1>
                <p className="fds-subtitle">SELECCIONA NIVEL DE DIFICULTAD</p>
            </motion.div>

            {/* Difficulty cards */}
            <motion.div
                className="fds-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {DIFFICULTIES.map((diff) => (
                    <motion.button
                        key={diff.key}
                        className="fds-card"
                        variants={cardVariants}
                        whileHover={{ scale: 1.04, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelect(diff.key)}
                        style={{
                            '--card-color': diff.color,
                            '--card-shadow': diff.shadow,
                        }}
                    >
                        <div className="fds-card-label">{diff.label}</div>
                        <div className="fds-card-desc">{diff.desc}</div>
                        <div className="fds-card-detail">{diff.detail}</div>
                        <div className="fds-card-levels">
                            <span className="fds-card-levels-num">{diff.levels}</span>
                            <span className="fds-card-levels-text">EJERCICIOS</span>
                        </div>
                        <div className="fds-card-arrow">▶ INICIAR</div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Back button */}
            <motion.div
                className="fds-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <button className="fds-back-btn" onClick={handleBack}>
                    ← VOLVER AL HUB
                </button>
            </motion.div>
        </motion.div>
    )
}
