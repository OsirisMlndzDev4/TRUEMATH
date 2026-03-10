/**
 * ═══════════════════════════════════════════════════════
 *  TRUTH FINDER — Difficulty Selection Screen
 *  Pantalla de selección de dificultad con estilo
 *  cyberpunk consistente con el juego.
 * ═══════════════════════════════════════════════════════
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BinaryBackground from '../ui/BinaryBackground'
import './FinderDifficultySelect.css'

const DIFFICULTIES = [
    {
        key: 'basico',
        label: 'BÁSICO',
        color: '#00FF41',
        shadow: 'rgba(0, 255, 65, 0.4)',
        desc: 'Operadores fundamentales: ∧, ∨, ¬',
        detail: '1–2 variables · Fórmulas simples',
        levels: 10,
    },
    {
        key: 'intermedio',
        label: 'INTERMEDIO',
        color: '#00FFFF',
        shadow: 'rgba(0, 255, 255, 0.4)',
        desc: 'Implicación, bicondicional y De Morgan',
        detail: '2–3 variables · Segmentos múltiples',
        levels: 10,
    },
    {
        key: 'avanzado',
        label: 'AVANZADO',
        color: '#FF6B00',
        shadow: 'rgba(255, 107, 0, 0.4)',
        desc: 'Leyes lógicas y contradicciones',
        detail: '2–3 variables · Cadenas complejas',
        levels: 10,
    },
    {
        key: 'experto',
        label: 'EXPERTO',
        color: '#FF0040',
        shadow: 'rgba(255, 0, 64, 0.4)',
        desc: 'Transitividad, exportación y dilemas',
        detail: '3–4 variables · Máxima complejidad',
        levels: 10,
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

export default function FinderDifficultySelect() {
    const navigate = useNavigate()

    return (
        <motion.div
            className="fds-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Binary cascade background */}
            <BinaryBackground />

            {/* Scan-line overlay */}
            <div className="fds-scanlines" />

            {/* Header */}
            <motion.div
                className="fds-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="fds-title">TRUTH FINDER</h1>
                <p className="fds-subtitle">⌐ SELECCIONA PROTOCOLO DE DIFICULTAD</p>
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
                        onClick={() => navigate(`/finder/${diff.key}`)}
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
                            <span className="fds-card-levels-text">NIVELES</span>
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
                <button
                    className="fds-back-btn"
                    onClick={() => navigate('/')}
                >
                    ← VOLVER AL HUB
                </button>
            </motion.div>
        </motion.div>
    )
}
