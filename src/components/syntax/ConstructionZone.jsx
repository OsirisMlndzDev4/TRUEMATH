import { motion, AnimatePresence } from 'framer-motion'

const VARIABLES = ['p', 'q', 'r', 's']

export default function ConstructionZone({ tokens, onRemoveToken }) {
    return (
        <div className="w-full">
            <p
                className="text-xs tracking-widest text-[#00FF41]/50 uppercase mb-3"
                style={{ fontFamily: "'Orbitron'" }}
            >
                Zona de Construcción
            </p>
            <div
                className="min-h-[60px] flex items-center flex-wrap gap-2 p-4"
                style={{
                    background: 'rgba(0,255,65,0.03)',
                    border: '1px solid rgba(0,255,65,0.3)',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {tokens.map((token, index) => {
                        const isVar = VARIABLES.includes(token)
                        const color = isVar ? '#00FFFF' : '#FF00FF'
                        return (
                            <motion.button
                                key={`${token}-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                layout
                                onClick={() => onRemoveToken(index)}
                                className="h-10 px-3 flex items-center justify-center text-lg font-bold cursor-pointer"
                                style={{
                                    fontFamily: "'Share Tech Mono', monospace",
                                    background: `${color}10`,
                                    border: `1px solid ${color}`,
                                    color: color,
                                    boxShadow: `0 0 6px ${color}40`,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                title="Clic para remover"
                            >
                                {token}
                            </motion.button>
                        )
                    })}
                </AnimatePresence>

                {/* Blinking cursor */}
                <span
                    className="animate-blink text-2xl text-[#00FF41]"
                    style={{ textShadow: '0 0 8px rgba(0,255,65,0.5)' }}
                >
                    ▎
                </span>

                {tokens.length === 0 && (
                    <span className="text-white/20 text-sm ml-2">
                        Agrega símbolos desde la paleta...
                    </span>
                )}
            </div>
        </div>
    )
}
