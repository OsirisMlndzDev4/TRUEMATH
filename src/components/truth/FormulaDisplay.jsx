export default function FormulaDisplay({ formulaDisplay }) {
    const OPERATORS = ['∧', '∨', '→', '↔', '¬', '(', ')']

    const chars = formulaDisplay.split('')
    let parts = []
    let current = ''

    for (const ch of chars) {
        if (OPERATORS.includes(ch)) {
            if (current) parts.push({ text: current, type: 'var' })
            parts.push({ text: ch, type: 'op' })
            current = ''
        } else {
            current += ch
        }
    }
    if (current) parts.push({ text: current, type: 'var' })

    return (
        <div className="text-center">
            <p
                className="text-xs tracking-widest text-[#FF00FF]/90 uppercase mb-3 font-bold"
                style={{ fontFamily: "'Orbitron'", textShadow: '0 0 6px rgba(255,0,255,0.4)' }}
            >
                Fórmula
            </p>
            <p
                className="text-3xl md:text-4xl font-bold tracking-wider"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
                {parts.map((part, i) => (
                    <span
                        key={i}
                        style={{
                            color: part.type === 'op' ? '#FF00FF' : '#00FFFF',
                            textShadow:
                                part.type === 'op'
                                    ? '0 0 8px rgba(255,0,255,0.5)'
                                    : '0 0 8px rgba(0,255,255,0.5)',
                        }}
                    >
                        {part.text}
                    </span>
                ))}
            </p>
        </div>
    )
}
