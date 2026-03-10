import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VARIABLES = ['p', 'q', 'r', 's']

export default function ConstructionZone({ tokens, onRemoveToken }) {
    const scrollRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)

    const updateScrollState = () => {
        const el = scrollRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        requestAnimationFrame(() => {
            el.scrollLeft = el.scrollWidth
            updateScrollState()
        })
    }, [tokens.length])

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        el.addEventListener('scroll', updateScrollState, { passive: true })
        return () => el.removeEventListener('scroll', updateScrollState)
    }, [])

    return (
        <div className="w-full">
            <p
                className="text-xs tracking-widest text-[#00FF41]/80 uppercase mb-3 font-bold"
                style={{ fontFamily: "'Orbitron'", textShadow: '0 0 6px rgba(0,255,65,0.4)' }}
            >
                Zona de Construcción
            </p>
            <div style={{ position: 'relative' }}>
                {canScrollLeft && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '32px',
                            background: 'linear-gradient(to right, rgba(0,255,65,0.12), transparent)',
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    />
                )}
                <div
                    ref={scrollRef}
                    className="min-h-[44px] sm:min-h-[52px] flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 hide-scrollbar"
                    style={{
                        background: 'rgba(0,255,65,0.03)',
                        border: '1px solid rgba(0,255,65,0.3)',
                        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {tokens.map((token, index) => {
                            const isVar = VARIABLES.includes(token)
                            const borderColor = isVar ? 'rgba(0,255,255,0.5)' : 'rgba(255,0,255,0.5)'
                            return (
                                <motion.button
                                    key={`${token}-${index}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    layout
                                    onClick={() => onRemoveToken(index)}
                                    className="h-9 sm:h-10 min-w-[34px] sm:min-w-[40px] px-2 sm:px-3 flex items-center justify-center text-base sm:text-lg font-bold cursor-pointer flex-shrink-0"
                                    style={{
                                        fontFamily: "'Share Tech Mono', monospace",
                                        background: 'rgba(255,255,255,0.1)',
                                        border: `1px solid ${borderColor}`,
                                        color: '#FFFFFF',
                                        textShadow: '0 0 4px rgba(255,255,255,0.3)',
                                        boxShadow: `0 0 6px ${borderColor}`,
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

                    <span
                        className="animate-blink text-2xl text-[#00FF41] flex-shrink-0"
                        style={{ textShadow: '0 0 8px rgba(0,255,65,0.5)' }}
                    >
                        ▎
                    </span>

                    {tokens.length === 0 && (
                        <span className="text-white/20 text-sm ml-2 whitespace-nowrap">
                            Agrega símbolos desde la paleta...
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
