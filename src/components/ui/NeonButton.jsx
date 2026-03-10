import { motion } from 'framer-motion'

const colorMap = {
    cyan: {
        border: '#00FFFF',
        shadow: 'rgba(0,255,255,0.5)',
        shadowDeep: 'rgba(0,255,255,0.3)',
        text: '#00FFFF',
    },
    magenta: {
        border: '#FF00FF',
        shadow: 'rgba(255,0,255,0.5)',
        shadowDeep: 'rgba(255,0,255,0.3)',
        text: '#FF00FF',
    },
    verde: {
        border: '#00FF41',
        shadow: 'rgba(0,255,65,0.5)',
        shadowDeep: 'rgba(0,255,65,0.3)',
        text: '#00FF41',
    },
    red: {
        border: '#FF0040',
        shadow: 'rgba(255,0,64,0.5)',
        shadowDeep: 'rgba(255,0,64,0.3)',
        text: '#FF0040',
    },
    gold: {
        border: '#FFD700',
        shadow: 'rgba(255,215,0,0.5)',
        shadowDeep: 'rgba(255,215,0,0.3)',
        text: '#FFD700',
    },
}

export default function NeonButton({ children, color = 'cyan', onClick, className = '', disabled = false, size = 'md' }) {
    const c = colorMap[color] || colorMap.cyan
    const sizeClasses = {
        sm: 'px-3 py-2 text-xs sm:px-4 sm:text-sm',
        md: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
        lg: 'px-6 py-3 text-base sm:px-10 sm:py-4 sm:text-lg',
        xl: 'px-6 py-3.5 text-base sm:px-12 sm:py-5 sm:text-xl',
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.04, boxShadow: `0 0 15px ${c.shadow}, 0 0 30px ${c.shadowDeep}, 0 0 60px ${c.shadowDeep}` }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`
        font-[Orbitron] font-bold uppercase tracking-wider cursor-pointer
        ${sizeClasses[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
            style={{
                background: 'transparent',
                border: `2px solid ${c.border}`,
                color: c.text,
                boxShadow: `0 0 10px ${c.shadow}, 0 0 20px ${c.shadowDeep}`,
                textShadow: `0 0 8px ${c.shadow}`,
            }}
        >
            {children}
        </motion.button>
    )
}
