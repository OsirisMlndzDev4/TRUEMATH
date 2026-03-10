import { motion, AnimatePresence } from 'framer-motion'

const VARIABLES = ['p', 'q', 'r', 's']

export default function ConstructionZone({ tokens, onRemoveToken }) {
    return (
        <div className="w-full">
            <p
                className="text-xs tracking-widest text-[#00FF41]/80 uppercase mb-3 font-bold"
                style={{ fontFamily: "'Orbitron'", textShadow: '0 0 6px rgba(0,255,65,0.4)' }}
            >
                Zona de Construcción
            </p>
            <div
                className="min-h-[50px] sm:min-h-[60px] flex items-center flex-wrap gap-2 sm:gap-4 p-3 sm:p-5"
                style={{
                    background: 'rgba(0,255,65,0.03)',
                    border: '1px solid rgba(0,255,65,0.3)',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {tokens.map((token, index) => {
                        const isVar = VARIABLES.includes(token)
                        const textColor = isVar ? '#00FFFF' : '#FF00FF'
                        const borderColor = isVar ? 'rgba(0,255,255,0.35)' : 'rgba(255,0,255,0.35)'
                        const bgColor = isVar ? 'rgba(0,255,255,0.08)' : 'rgba(255,0,255,0.08)'
                        return (
                            <motion.button
                                key={`${token}-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                layout
                                onClick={() => onRemoveToken(index)}
                                className="h-10 sm:h-12 min-w-[40px] sm:min-w-[48px] px-3 sm:px-6 flex items-center justify-center text-lg sm:text-xl font-bold cursor-pointer"
                                style={{
                                    fontFamily: "'Share Tech Mono', monospace",
                                    background: bgColor,
                                    border: `1px solid ${borderColor}`,
                                    color: textColor,
                                    textShadow: `0 0 8px ${textColor}60`,
                                    boxShadow: `0 0 8px ${textColor}15`,
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
