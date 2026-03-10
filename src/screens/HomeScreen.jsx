import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BinaryBackground from '../components/ui/BinaryBackground'
import NeonButton from '../components/ui/NeonButton'
import useGameStore from '../store/useGameStore'

/* ── Rotating wireframe cube ── */
function WireframeCube() {
    const size = 120
    const half = size / 2

    const edges = [
        // Front face
        { x: -half, y: -half, z: half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: -half, z: half, rx: 0, ry: 0, rz: 90, w: size },
        { x: half, y: -half, z: half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: half, z: half, rx: 0, ry: 0, rz: 90, w: size },
        // Back face
        { x: -half, y: -half, z: -half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: -half, z: -half, rx: 0, ry: 0, rz: 90, w: size },
        { x: half, y: -half, z: -half, rx: 0, ry: 0, rz: 0, w: size },
        { x: -half, y: half, z: -half, rx: 0, ry: 0, rz: 90, w: size },
        // Connecting edges
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

    const handleModule = (module) => {
        if (module === 'syntax') {
            navigate('/syntax-difficulty')
        } else {
            startGame(module)
            navigate('/finder')
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <BinaryBackground />

            {/* Wireframe cube decoration */}
            <div className="absolute top-1/4 right-[10%] opacity-40 hidden md:flex">
                <WireframeCube />
            </div>
            <div className="absolute bottom-1/4 left-[8%] opacity-25 hidden lg:flex">
                <WireframeCube />
            </div>

            {/* Main content */}
            <motion.div
                className="relative z-10 flex flex-col items-center gap-10 px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Title */}
                <div className="text-center">
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-[#00FFFF] text-glow-cyan animate-pulse-glow"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        TRUEMATH
                    </motion.h1>
                    <motion.p
                        className="text-sm md:text-base mt-3 tracking-[0.3em] uppercase text-[#00FFFF]/70"
                        style={{ fontFamily: "'Share Tech Mono', monospace" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        LÓGICA SIMBÓLICA // CYBER EDITION
                    </motion.p>
                </div>

                {/* Module buttons */}
                <motion.div
                    className="flex flex-col gap-5 w-full max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
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
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                >
                    <NeonButton
                        color="gold"
                        size="md"
                        onClick={() => navigate('/leaderboard')}
                    >
                        🏆 LEADERBOARD
                    </NeonButton>
                </motion.div>
            </motion.div>
        </div>
    )
}
