import { motion } from 'framer-motion'

function formatTime(seconds) {
    if (seconds >= 60) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${seconds}s`
}

export default function TimerBar({ timeLeft, maxTime = 60 }) {
    const pct = (timeLeft / maxTime) * 100
    const isLow = timeLeft <= 10
    const color = isLow ? '#FF0040' : '#FF00FF'
    const glowColor = isLow ? 'rgba(255,0,64,0.6)' : 'rgba(255,0,255,0.6)'

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span
                    className="text-xs font-[Orbitron] tracking-widest uppercase"
                    style={{ color, textShadow: `0 0 8px ${glowColor}` }}
                >
                    TIEMPO
                </span>
                <span
                    className="text-sm font-bold font-[Share_Tech_Mono]"
                    style={{ color, textShadow: `0 0 8px ${glowColor}` }}
                >
                    {formatTime(timeLeft)}
                </span>
            </div>
            <div
                className="w-full h-3 relative overflow-hidden"
                style={{
                    background: '#0A0A2E',
                    border: `1px solid ${color}40`,
                }}
            >
                <motion.div
                    className="h-full"
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: 'linear' }}
                    style={{
                        background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                        boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
                    }}
                />
            </div>
        </div>
    )
}
