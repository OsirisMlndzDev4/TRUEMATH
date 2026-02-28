import { useEffect, useRef } from 'react'

export default function BinaryBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let animId
        let columns = []
        const fontSize = 14
        const color = '#00FF41'

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            const colCount = Math.floor(canvas.width / fontSize)
            columns = Array.from({ length: colCount }, () => Math.random() * canvas.height / fontSize)
        }

        resize()
        window.addEventListener('resize', resize)

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 16, 0.06)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = color
            ctx.font = `${fontSize}px 'Share Tech Mono', monospace`

            for (let i = 0; i < columns.length; i++) {
                const char = Math.random() > 0.5 ? '1' : '0'
                const x = i * fontSize
                const y = columns[i] * fontSize

                ctx.globalAlpha = 0.15 + Math.random() * 0.35
                ctx.fillText(char, x, y)

                if (y > canvas.height && Math.random() > 0.975) {
                    columns[i] = 0
                }
                columns[i] += 0.5 + Math.random() * 0.5
            }

            ctx.globalAlpha = 1
            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    )
}
