import { motion } from 'framer-motion'

export default function HolographicCard({ children, color = 'cyan', className = '' }) {
    const borderColor = {
        cyan: '#00FFFF',
        magenta: '#FF00FF',
        verde: '#00FF41',
    }[color] || '#00FFFF'

    const shadowColor = {
        cyan: 'rgba(0,255,255,0.3)',
        magenta: 'rgba(255,0,255,0.3)',
        verde: 'rgba(0,255,65,0.3)',
    }[color] || 'rgba(0,255,255,0.3)'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`relative ${className}`}
            style={{
                background: 'linear-gradient(135deg, #0A0A2E 0%, #0D0D35 50%, #0A0A2E 100%)',
                border: `1px solid ${borderColor}`,
                boxShadow: `0 0 10px ${shadowColor}, 0 0 20px ${shadowColor}, inset 0 0 20px rgba(0,0,0,0.5)`,
                padding: '1.5rem',
            }}
        >
            {children}
        </motion.div>
    )
}
