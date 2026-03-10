import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BinaryBackground from '../components/ui/BinaryBackground'
import NeonButton from '../components/ui/NeonButton'
import useGameStore from '../store/useGameStore'
import { playNeonFlicker } from '../utils/sounds'

const INTRO_MS = 2600
const BAR = '\u2588'
const FULL_BAR = BAR.repeat(24)

const BOOT_LINES = [
    { t: `$ truemath --init`, d: 0 },
    { t: 'TRUEMATH KERNEL v1.0.0 — Cyber Logic Platform', d: 30, c: '#00FFFF' },
    { t: '[ BOOT ] Initializing system...', d: 60 },
    { t: '[ BOOT ] CPU check............... OK', d: 90 },
    { t: '[ BOOT ] Allocating memory....... 512MB OK', d: 120 },
    { t: '[ LOAD ] Loading core modules:', d: 160 },
    { t: `  [${FULL_BAR}] logic_engine.ko`, d: 190, c: '#00FF41' },
    { t: `  [${FULL_BAR}] truth_table.ko`, d: 215, c: '#00FF41' },
    { t: `  [${FULL_BAR}] syntax_parser.ko`, d: 240, c: '#00FF41' },
    { t: `  [${FULL_BAR}] crypto_decoder.ko`, d: 265, c: '#00FF41' },
    { t: `  [${FULL_BAR}] scoring_engine.ko`, d: 290, c: '#00FF41' },
    { t: '[ NET  ] Connecting to cluster.... OK', d: 330 },
    { t: '[ DB   ] Loading exercises........ 47 found', d: 370 },
    { t: '[ SEC  ] Verifying crypto keys.... OK', d: 410 },
    { t: '[ AUD  ] Audio subsystem.......... OK', d: 450 },
    { t: '[ GPU  ] Display server........... OK', d: 490 },
    { t: '\u2550'.repeat(42), d: 550, c: '#00FFFF' },
    { t: '  SYSTEM READY \u2014 ALL CHECKS PASSED', d: 580, c: '#00FFFF' },
    { t: '\u2550'.repeat(42), d: 600, c: '#00FFFF' },
    { t: '$ launching truemath-interface...', d: 650 },
]

const BOOT_TOTAL = BOOT_LINES[BOOT_LINES.length - 1].d + 200

let hasBooted = false

/* ── Terminal boot sequence ── */
function BootSequence({ onComplete }) {
    const [lines, setLines] = useState([])
    const endRef = useRef(null)

    useEffect(() => {
        const timers = BOOT_LINES.map((line, i) =>
            setTimeout(() => setLines(prev => [...prev, line]), line.d)
        )
        const done = setTimeout(onComplete, BOOT_TOTAL)
        return () => { timers.forEach(clearTimeout); clearTimeout(done) }
    }, [onComplete])

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' })
    }, [lines])

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 60,
                background: '#050510',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '620px',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 'clamp(0.6rem, 1.4vw, 0.8rem)',
                    lineHeight: 1.7,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {lines.map((l, i) => (
                    <div
                        key={i}
                        style={{
                            color: l.c || '#00FF41',
                            whiteSpace: 'pre',
                            opacity: 0,
                            animation: 'boot-line-in 0.15s ease-out forwards',
                        }}
                    >
                        {l.t || '\u00A0'}
                    </div>
                ))}
                <span
                    style={{ color: '#00FF41' }}
                    className="animate-blink"
                >
                    _
                </span>
                <div ref={endRef} />
            </div>
        </div>
    )
}

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
    const [phase, setPhase] = useState(hasBooted ? 'ready' : 'gate')

    const handleEnter = useCallback(() => {
        if (phase !== 'gate') return
        setPhase('boot')
    }, [phase])

    const handleBootComplete = useCallback(() => {
        setPhase('blackout')
        setTimeout(() => {
            setPhase('intro')
            playNeonFlicker(INTRO_MS)
            setTimeout(() => {
                hasBooted = true
                setPhase('ready')
            }, INTRO_MS)
        }, 600)
    }, [])

    useEffect(() => {
        if (phase !== 'gate') return
        const onKey = () => handleEnter()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [phase, handleEnter])

    const handleModule = (module) => {
        if (module === 'syntax') {
            navigate('/syntax-difficulty')
        } else if (module === 'finder') {
            navigate('/finder')
        }
    }

    const ready = phase === 'ready'

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#050510' }}
        >
            {/* ══════ GATE SCREEN ══════ */}
            <AnimatePresence>
                {phase === 'gate' && (
                    <motion.div
                        key="gate"
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-center cursor-pointer select-none"
                        style={{ background: '#050510' }}
                        onClick={handleEnter}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p
                            style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: 'clamp(0.7rem, 1.8vw, 0.95rem)',
                                color: '#00FFFF',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                textShadow: '0 0 8px rgba(0,255,255,0.4)',
                                animation: 'pulse-glow 1.8s ease-in-out infinite',
                            }}
                        >
                            [ CLICK PARA INICIALIZAR ]
                        </p>
                        <p
                            style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: 'clamp(0.5rem, 1vw, 0.6rem)',
                                color: 'rgba(0,255,255,0.25)',
                                letterSpacing: '0.2em',
                                marginTop: '1.5rem',
                            }}
                        >
                            TRUEMATH v1.0 // BOOT SEQUENCE
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════ TERMINAL BOOT SEQUENCE ══════ */}
            <AnimatePresence>
                {phase === 'boot' && (
                    <motion.div
                        key="boot"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <BootSequence onComplete={handleBootComplete} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════ NEON INTRO ══════ */}
            <AnimatePresence>
                {phase === 'intro' && (
                    <motion.div
                        key="neon-intro"
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                        style={{ background: '#050510' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
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
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 1.5 }}
            >
                <BinaryBackground />
            </motion.div>

            {/* ══════ WIREFRAME CUBES ══════ */}
            <motion.div
                className="absolute top-1/4 right-[10%] hidden md:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 0.4 : 0 }}
                transition={{ duration: 1.5, delay: 0.4 }}
            >
                <WireframeCube />
            </motion.div>
            <motion.div
                className="absolute bottom-1/4 left-[8%] hidden lg:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 0.25 : 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
            >
                <WireframeCube />
            </motion.div>

            {/* ══════ MAIN CONTENT ══════ */}
            <motion.div
                className="relative z-10 flex flex-col items-center gap-6 sm:gap-10 px-4 w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.15 }}
            >
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
                        animate={{ opacity: ready ? 1 : 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        LÓGICA SIMBÓLICA // CYBER EDITION
                    </motion.p>
                </div>

                <motion.div
                    className="flex flex-col gap-5 w-full max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: ready ? 1 : 0 }}
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

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: ready ? 1 : 0 }}
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
