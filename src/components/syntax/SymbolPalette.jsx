import { motion } from 'framer-motion'

const VARIABLES = ['p', 'q', 'r', 's']
const OPERATORS = ['∧', '∨', '→', '↔', '¬', '(', ')']

export default function SymbolPalette({ onAddToken, availableVars = ['p', 'q'] }) {
    const varsToShow = VARIABLES.filter((v) => availableVars.includes(v))

    return (
        <div className="w-full">
            <p
                className="text-xs tracking-widest text-[#00FFFF]/90 uppercase mb-3 font-bold"
                style={{ fontFamily: "'Orbitron'", textShadow: '0 0 6px rgba(0,255,255,0.4)' }}
            >
                Paleta de Símbolos
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {/* Variable tokens */}
                {varsToShow.map((token) => (
                    <motion.button
                        key={`var-${token}`}
                        onClick={() => onAddToken(token)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-[38px] h-[38px] sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-bold cursor-pointer"
                        style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            background: 'rgba(0,255,255,0.05)',
                            border: '2px solid #00FFFF',
                            color: '#00FFFF',
                            boxShadow: '0 0 8px rgba(0,255,255,0.3)',
                            textShadow: '0 0 6px rgba(0,255,255,0.5)',
                        }}
                    >
                        {token}
                    </motion.button>
                ))}

                {/* Divider */}
                <div className="w-px h-[38px] sm:h-12 bg-white/10 mx-0.5 sm:mx-1" />

                {/* Operator tokens */}
                {OPERATORS.map((token) => (
                    <motion.button
                        key={`op-${token}`}
                        onClick={() => onAddToken(token)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-[38px] h-[38px] sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-bold cursor-pointer"
                        style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            background: 'rgba(255,0,255,0.05)',
                            border: '2px solid #FF00FF',
                            color: '#FF00FF',
                            boxShadow: '0 0 8px rgba(255,0,255,0.3)',
                            textShadow: '0 0 6px rgba(255,0,255,0.5)',
                        }}
                    >
                        {token}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
