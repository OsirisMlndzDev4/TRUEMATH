import { motion } from 'framer-motion'

export default function VerdictButtons({ onVote, disabled }) {
    const verdicts = [
        { key: 'TAUTOLOGÍA', label: 'TAUTOLOGÍA', color: '#00FF41', shadow: 'rgba(0,255,65,0.5)' },
        { key: 'CONTRADICCIÓN', label: 'CONTRADICCIÓN', color: '#FF0040', shadow: 'rgba(255,0,64,0.5)' },
        { key: 'CONTINGENCIA', label: 'CONTINGENCIA', color: '#00FFFF', shadow: 'rgba(0,255,255,0.5)' },
    ]

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            {verdicts.map((v) => (
                <motion.button
                    key={v.key}
                    onClick={() => onVote(v.key)}
                    disabled={disabled}
                    whileHover={disabled ? {} : { scale: 1.04 }}
                    whileTap={disabled ? {} : { scale: 0.96 }}
                    className={`flex-1 py-4 px-5 font-bold text-base tracking-wider uppercase cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    style={{
                        fontFamily: "'Orbitron', sans-serif",
                        background: 'transparent',
                        border: `2px solid ${v.color}`,
                        color: v.color,
                        boxShadow: `0 0 10px ${v.shadow}, 0 0 20px ${v.shadow}40`,
                        textShadow: `0 0 8px ${v.shadow}`,
                    }}
                >
                    {v.label}
                </motion.button>
            ))}
        </div>
    )
}
