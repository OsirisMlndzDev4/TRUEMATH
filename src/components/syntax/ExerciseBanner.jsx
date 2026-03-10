import { motion } from 'framer-motion'

export default function ExerciseBanner({ sentence, variables, exerciseNum, totalExercises }) {
    return (
        <motion.div
            key={exerciseNum}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
        >
            {/* Progress indicator */}
            <div className="flex justify-between items-center mb-3">
                <span
                    className="text-xs tracking-widest text-[#00FF41]/90 uppercase font-bold"
                    style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 6px rgba(0,255,65,0.4)' }}
                >
                    Ejercicio {exerciseNum}/{totalExercises}
                </span>
                <div className="flex-1 mx-4 h-1 bg-[#0A0A2E] overflow-hidden">
                    <motion.div
                        className="h-full"
                        style={{ background: '#00FF41' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(exerciseNum / totalExercises) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Sentence */}
            <div
                className="p-3 sm:p-5 mb-3 sm:mb-4"
                style={{
                    background: 'linear-gradient(135deg, #0A0A2E, #0D0D35)',
                    border: '1px solid rgba(0,255,65,0.3)',
                    boxShadow: '0 0 15px rgba(0,255,65,0.1)',
                }}
            >
                <p className="text-xs tracking-widest text-[#00FF41]/80 uppercase mb-2 font-bold"
                    style={{ fontFamily: "'Orbitron'", textShadow: '0 0 6px rgba(0,255,65,0.4)' }}>
                    Traduce a fórmula:
                </p>
                <p className="text-base sm:text-xl md:text-2xl text-white leading-relaxed"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    "{sentence}"
                </p>
            </div>

            {/* Variable legend */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(variables).map(([key, value]) => (
                    <div
                        key={key}
                        className="flex items-center gap-2 px-3 py-1 text-sm"
                        style={{
                            border: '1px solid rgba(0,255,255,0.4)',
                            boxShadow: '0 0 6px rgba(0,255,255,0.2)',
                            fontFamily: "'Share Tech Mono', monospace",
                        }}
                    >
                        <span className="text-[#00FFFF] font-bold">{key}</span>
                        <span className="text-white/40">=</span>
                        <span className="text-white/70">{value}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
