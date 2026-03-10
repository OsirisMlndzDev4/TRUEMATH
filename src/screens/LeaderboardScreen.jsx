import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getScores, getAllScores } from '../utils/leaderboard'
import NeonButton from '../components/ui/NeonButton'

const TABS = [
    { key: 'syntax', label: 'SYNTAX NODE', color: '#00FF41' },
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
    finder: 'FINDER',
}

const DIFF_LABELS = {
    facil: { text: 'FÁCIL', color: '#00FF41' },
    medio: { text: 'MEDIO', color: '#FFD700' },
    dificil: { text: 'DIFÍCIL', color: '#FF0040' },
}

export default function LeaderboardScreen() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('syntax')

    const [scores, setScores] = useState([])
    const [loading, setLoading] = useState(true)

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

    const gridCols = activeTab === 'all'
        ? { gridTemplateColumns: 'minmax(24px, 32px) 1fr minmax(44px, 56px) minmax(38px, 50px) minmax(38px, 55px) minmax(60px, 85px)' }
        : { gridTemplateColumns: 'minmax(24px, 32px) 1fr minmax(44px, 56px) minmax(38px, 55px) minmax(60px, 85px)' }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center"
            style={{ background: '#050510', padding: 'clamp(1rem, 4vw, 2.5rem) clamp(1rem, 5vw, 2rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Title */}
            <h1
                className="text-xl sm:text-3xl md:text-5xl font-black text-[#00FFFF] text-glow-cyan"
                style={{ fontFamily: "'Orbitron', sans-serif", marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
            >
                🏆 HALL OF LOGIC
            </h1>

            {/* Tabs */}
            <div
                className="flex gap-1.5 sm:gap-2 flex-wrap justify-center w-full max-w-2xl"
                style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="px-3 py-1.5 sm:px-5 sm:py-2 text-[0.6rem] sm:text-xs font-bold tracking-wider uppercase cursor-pointer transition-all duration-200"
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
                        borderRadius: '2px',
                    }}
                >
                    {/* Header */}
                    <div
                        className="grid items-center"
                        style={{
                            ...gridCols,
                            gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                            padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)',
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: 'clamp(0.55rem, 1.2vw, 0.75rem)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid rgba(0,255,255,0.2)',
                            color: '#00FFFF80',
                        }}
                    >
                        <span>#</span>
                        <span>Nombre</span>
                        <span className="text-right">Score</span>
                        {activeTab === 'all' && <span className="text-center">Mod</span>}
                        <span className="text-center">Dif</span>
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
                                <div className="text-center text-[#00FFFF]/50 text-sm"
                                    style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem) 1rem' }}>
                                    Cargando puntuaciones...
                                </div>
                            ) : top10.length === 0 ? (
                                <div className="text-center text-white/30 text-sm"
                                    style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem) 1rem' }}>
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
                                            className="grid items-center"
                                            style={{
                                                ...gridCols,
                                                gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                                                padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)',
                                                fontFamily: "'Share Tech Mono', monospace",
                                                fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                color: rankStyle ? rankStyle.color : '#ffffffCC',
                                                textShadow: rankStyle ? `0 0 8px ${rankStyle.shadow}` : 'none',
                                            }}
                                        >
                                            <span className="font-bold">{rank}</span>
                                            <span className="truncate">{entry.name}</span>
                                            <span className="text-right font-bold">{entry.score}</span>
                                            {activeTab === 'all' && (
                                                <span className="text-center opacity-60"
                                                    style={{ fontSize: 'clamp(0.55rem, 1.2vw, 0.75rem)' }}>
                                                    {MODULE_LABELS[entry.module] || entry.module}
                                                </span>
                                            )}
                                            <span className="text-center"
                                                style={{
                                                    fontSize: 'clamp(0.5rem, 1.1vw, 0.7rem)',
                                                    color: DIFF_LABELS[entry.difficulty]?.color || '#ffffff60',
                                                    textShadow: DIFF_LABELS[entry.difficulty] ? `0 0 6px ${DIFF_LABELS[entry.difficulty].color}40` : 'none',
                                                }}>
                                                {DIFF_LABELS[entry.difficulty]?.text || '—'}
                                            </span>
                                            <span className="text-right opacity-50"
                                                style={{ fontSize: 'clamp(0.55rem, 1.2vw, 0.75rem)' }}>
                                                {dateLabel}
                                            </span>
                                        </motion.div>
                                    )
                                })
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 flex-wrap justify-center"
                style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                <NeonButton color="cyan" size="sm" onClick={() => navigate('/')}>
                    ← INICIO
                </NeonButton>
            </div>
        </motion.div>
    )
}
