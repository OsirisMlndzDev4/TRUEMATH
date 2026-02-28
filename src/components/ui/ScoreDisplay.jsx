import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function ScoreDisplay({ score, label = 'SCORE', color = '#00FFFF' }) {
    const spring = useSpring(0, { stiffness: 80, damping: 20 })
    const display = useTransform(spring, (v) => Math.round(v))

    useEffect(() => {
        spring.set(score)
    }, [score, spring])

    return (
        <div className="flex flex-col items-center gap-1">
            <span
                className="text-xs font-[Orbitron] tracking-widest uppercase"
                style={{ color: color, textShadow: `0 0 8px ${color}60` }}
            >
                {label}
            </span>
            <motion.span
                className="text-3xl font-bold font-[Orbitron]"
                style={{ color: color, textShadow: `0 0 12px ${color}80, 0 0 24px ${color}40` }}
            >
                {display}
            </motion.span>
        </div>
    )
}
