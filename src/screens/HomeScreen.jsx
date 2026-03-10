import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BinaryBackground from '../components/ui/BinaryBackground'
import NeonButton from '../components/ui/NeonButton'
import useGameStore from '../store/useGameStore'
import { playNeonFlicker } from '../utils/sounds'

const INTRO_MS = 2600

/* ── Rotating wireframe cube ── */
function WireframeCube() {
    const size = 120
    const half = size / 2

    const edges = [
        { x: -half, y: -half, z: half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: -half, z: half, rx: 0, ry: 0, rz: 90, w: size },
        { x: half, y: -half, z: half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: half, z: half, rx: 0, ry: 0, rz: 90, w: size },
        { x: -half, y: -half, z: -half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: -half, z: -half, rx: 0, ry: 0, rz: 90, w: size },
        { x: half, y: -half, z: -half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: half, z: -half, rx: 0, ry: 0, rz: 90, w: size },
        { x: -half, y: -half, z: -half, rx: 0, ry: 90, rz: 0, w: size },
        { x: half, y: -half, z: -half, rx: 0, ry: 90, rz: 0, w: size },
        { x: -half, y: half, z: -half, rx: 0, ry: 90, rz: 0, w: size },
        { x: half, y: half, z: -half, rx: 0, ry: 90, rz: 0, w: size },
    ]

    return (
        <div className="absolute pointer-events-none" style={{ perspective: '800px' }}>
            <div
                style={{
                    width: size,
                    height: size,
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    animation: 'rotate-cube 20s linear infinite',
                }}
            >
                {edges.map((e, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: `${e.w}px`,
                            height: '1px',
                            background: 'rgba(0, 255, 255, 0.3)',
                            boxShadow: '0 0 6px rgba(0,255,255,0.4)',
                            left: '50%',
                            top: '50%',
                            transform: `translate3d(${e.x}px, ${e.y}px, ${e.z}px) rotateX(${e.rx}deg) rotateY(${e.ry}deg) rotateZ(${e.rz}deg)`,
                            transformOrigin: '0 0',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default function HomeScreen() {
    const navigate = useNavigate()
    const startGame = useGameStore((s) => s.startGame)
    const [introDone, setIntroDone] = useState(false)

    useEffect(() => {
        playNeonFlicker(INTRO_MS)
        const t = setTimeout(() => setIntroDone(true), INTRO_MS)
        return () => clearTimeout(t)
    }, [])

    const handleModule = (module) => {
        if (module === 'syntax') {
            navigate('/syntax-difficulty')
        } else if (module === 'finder') {
            navigate('/finder')
        }
    }

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#050510' }}
        >
            {/* ══════ NEON INTRO OVERLAY ══════ */}
            <AnimatePresence>
                {!introDone && (
                    <motion.div
                        key="neon-intro"
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                        style={{ background: '#050510' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
                        {/* Flickering title */}
                        <h1
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                                fontWeight: 900,
                                color: '#00FFFF',
                                letterSpacing: '0.15em',
                                opacity: 0,
                                animation: `neon-flicker-on ${INTRO_MS}ms ease-out forwards`,
                            }}
                        >
                            TRUEMATH
                        </h1>

                        {/* Decorative line that extends as the neon stabilizes */}
                        <div
                            style={{
                                width: 'clamp(120px, 40vw, 320px)',
                                height: '1px',
                                marginTop: '1rem',
                                background: 'linear-gradient(90deg, transparent, #00FFFF, transparent)',
                                boxShadow: '0 0 8px #00FFFF60, 0 0 20px #00FFFF30',
                                transformOrigin: 'center',
                                animation: `neon-line-extend ${INTRO_MS}ms ease-out forwards`,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════ BACKGROUND ══════ */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: introDone ? 1 : 0 }}
                transition={{ duration: 1.5 }}
            >
                <BinaryBackground />
            </motion.div>

            {/* ══════ WIREFRAME CUBES ══════ */}
            <motion.div
                className="absolute top-1/4 right-[10%] hidden md:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: introDone ? 0.4 : 0 }}
                transition={{ duration: 1.5, delay: 0.4 }}
            >
                <WireframeCube />
            </motion.div>
            <motion.div
                className="absolute bottom-1/4 left-[8%] hidden lg:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: introDone ? 0.25 : 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
            >
                <WireframeCube />
            </motion.div>

            {/* ══════ MAIN CONTENT ══════ */}
            <motion.div
                className="relative z-10 flex flex-col items-center gap-6 sm:gap-10 px-4 w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.15 }}
            >
                {/* Title */}
                <div className="text-center">
                    <motion.h1
                        className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-[#00FFFF] text-glow-cyan animate-pulse-glow"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        TRUEMATH
                    </motion.h1>
                    <motion.p
                        className="text-xs sm:text-sm md:text-base mt-2 sm:mt-3 tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#00FFFF]/70"
                        style={{ fontFamily: "'Share Tech Mono', monospace" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: introDone ? 1 : 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        LÓGICA SIMBÓLICA // CYBER EDITION
                    </motion.p>
                </div>

                {/* Module buttons */}
                <motion.div
                    className="flex flex-col gap-5 w-full max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: introDone ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                >
                    <NeonButton
                        color="verde"
                        size="xl"
                        onClick={() => handleModule('syntax')}
                        className="w-full text-center"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs tracking-widest opacity-70">MÓDULO 1</span>
                            <span>SYNTAX NODE</span>
                        </div>
                    </NeonButton>

                    <NeonButton
                        color="cyan"
                        size="xl"
                        onClick={() => handleModule('finder')}
                        className="w-full text-center"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs tracking-widest opacity-70">MÓDULO 2</span>
                            <span>TRUTH FINDER</span>
                        </div>
                    </NeonButton>
                </motion.div>

                {/* Leaderboard button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: introDone ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <NeonButton
                        color="gold"
                        size="md"
                        onClick={() => navigate('/leaderboard')}
                    >
                        LEADERBOARD
                    </NeonButton>
                </motion.div>
            </motion.div>
        </div>
    )
}
