import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getScores, getAllScores, clearScores } from '../utils/leaderboard'
import NeonButton from '../components/ui/NeonButton'

const TABS = [
    { key: 'syntax', label: 'SYNTAX NODE', color: '#00FF41' },
    { key: 'truth', label: 'TRUTH MATRIX', color: '#FF00FF' },
    { key: 'finder', label: 'TRUTH FINDER', color: '#FFD700' },
    { key: 'all', label: 'ALL TIME', color: '#00FFFF' },
]

const RANK_COLORS = {
    1: { color: '#FFD700', shadow: 'rgba(255,215,0,0.5)' },
    2: { color: '#C0C0C0', shadow: 'rgba(192,192,192,0.5)' },
    3: { color: '#CD7F32', shadow: 'rgba(205,127,50,0.5)' },
}

const MODULE_LABELS = {
    syntax: 'SYNTAX',
    truth: 'TRUTH',
    finder: 'FINDER',
}

export default function LeaderboardScreen() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('syntax')
    const [showConfirm, setShowConfirm] = useState(false)
    const [scores, setScores] = useState([])
    const [loading, setLoading] = useState(true)

    // Cargar puntuaciones desde Supabase cada vez que cambia el tab
    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true)
            const data = activeTab === 'all'
                ? await getAllScores()
                : await getScores(activeTab)
            setScores(data)
            setLoading(false)
        }
        fetchScores()
    }, [activeTab])

    const top10 = scores.slice(0, 10)

    const handleClear = async () => {
        await clearScores(activeTab === 'all' ? 'all' : activeTab)
        setScores([])
        setShowConfirm(false)
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center py-8 px-4"
            style={{ background: '#050510' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Title */}
            <h1
                className="text-3xl md:text-5xl font-black text-[#00FFFF] text-glow-cyan mb-8"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
                🏆 HALL OF LOGIC
            </h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="px-4 py-2 text-xs font-bold tracking-wider uppercase cursor-pointer transition-all duration-200"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            background: activeTab === tab.key ? `${tab.color}15` : 'transparent',
                            border: `1px solid ${activeTab === tab.key ? tab.color : '#ffffff20'}`,
                            color: activeTab === tab.key ? tab.color : '#ffffff60',
                            boxShadow: activeTab === tab.key ? `0 0 10px ${tab.color}30` : 'none',
                            textShadow: activeTab === tab.key ? `0 0 8px ${tab.color}60` : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="w-full max-w-2xl">
                <div
                    className="w-full scanline-overlay"
                    style={{
                        background: '#0A0A2E',
                        border: '1px solid rgba(0,255,255,0.2)',
                        boxShadow: '0 0 15px rgba(0,255,255,0.1)',
                    }}
                >
                    {/* Header */}
                    <div
                        className="grid gap-2 px-4 py-3 text-xs tracking-widest uppercase"
                        style={{
                            gridTemplateColumns: activeTab === 'all' ? '50px 1fr 80px 80px 100px' : '50px 1fr 80px 100px',
                            fontFamily: "'Orbitron', sans-serif",
                            borderBottom: '1px solid rgba(0,255,255,0.2)',
                            color: '#00FFFF80',
                        }}
                    >
                        <span>#</span>
                        <span>Nombre</span>
                        <span className="text-right">Score</span>
                        {activeTab === 'all' && <span className="text-center">Módulo</span>}
                        <span className="text-right">Fecha</span>
                    </div>

                    {/* Rows */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {loading ? (
                                <div className="px-4 py-8 text-center text-[#00FFFF]/50 text-sm">
                                    Cargando puntuaciones...
                                </div>
                            ) : top10.length === 0 ? (
                                <div className="px-4 py-8 text-center text-white/30 text-sm">
                                    No hay puntuaciones aún
                                </div>
                            ) : (
                                top10.map((entry, i) => {
                                    const rank = i + 1
                                    const rankStyle = RANK_COLORS[rank]
                                    const dateLabel = entry.created_at
                                        ? new Date(entry.created_at).toLocaleDateString('es-LA')
                                        : entry.date || '—'
                                    return (
                                        <motion.div
                                            key={entry.id || `${entry.name}-${entry.score}-${i}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="grid gap-2 px-4 py-3 text-sm items-center"
                                            style={{
                                                gridTemplateColumns: activeTab === 'all' ? '50px 1fr 80px 80px 100px' : '50px 1fr 80px 100px',
                                                fontFamily: "'Share Tech Mono', monospace",
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                color: rankStyle ? rankStyle.color : '#ffffffCC',
                                                textShadow: rankStyle ? `0 0 8px ${rankStyle.shadow}` : 'none',
                                            }}
                                        >
                                            <span className="font-bold">{rank}</span>
                                            <span className="truncate">{entry.name}</span>
                                            <span className="text-right font-bold">{entry.score}</span>
                                            {activeTab === 'all' && (
                                                <span className="text-center text-xs opacity-60">
                                                    {MODULE_LABELS[entry.module] || entry.module}
                                                </span>
                                            )}
                                            <span className="text-right text-xs opacity-50">{dateLabel}</span>
                                        </motion.div>
                                    )
                                })
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 flex-wrap justify-center">
                <NeonButton color="cyan" size="sm" onClick={() => navigate('/')}>
                    ← INICIO
                </NeonButton>
                {top10.length > 0 && !showConfirm && (
                    <NeonButton color="red" size="sm" onClick={() => setShowConfirm(true)}>
                        BORRAR PUNTUACIONES
                    </NeonButton>
                )}
            </div>

            {/* Confirm dialog */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ background: 'rgba(5,5,16,0.85)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-5 p-8"
                            style={{
                                background: '#0A0A2E',
                                border: '1px solid #FF0040',
                                boxShadow: '0 0 20px rgba(255,0,64,0.3)',
                            }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <p className="text-[#FF0040] font-bold text-lg text-center" style={{ fontFamily: "'Orbitron'" }}>
                                ¿Borrar puntuaciones?
                            </p>
                            <p className="text-white/50 text-sm text-center">
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-4">
                                <NeonButton color="red" size="sm" onClick={handleClear}>
                                    CONFIRMAR
                                </NeonButton>
                                <NeonButton color="cyan" size="sm" onClick={() => setShowConfirm(false)}>
                                    CANCELAR
                                </NeonButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
