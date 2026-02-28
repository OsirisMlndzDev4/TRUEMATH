import { useMemo } from 'react'

export default function TruthTableGrid({ exercise, revealAll = false }) {
    const { variables, table } = exercise

    // Randomly hide ~40% of result cells (seeded by exercise id)
    const hiddenRows = useMemo(() => {
        if (revealAll) return new Set()
        const rng = (seed) => {
            let s = seed
            return () => {
                s = (s * 16807 + 0) % 2147483647
                return s / 2147483647
            }
        }
        const rand = rng(exercise.id * 137)
        const hidden = new Set()
        const target = Math.ceil(table.length * 0.4)
        const indices = table.map((_, i) => i)
        // Shuffle and pick
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]]
        }
        for (let i = 0; i < target; i++) {
            hidden.add(indices[i])
        }
        return hidden
    }, [exercise.id, revealAll, table.length])

    return (
        <div className="w-full overflow-x-auto">
            <div
                className="scanline-overlay inline-block min-w-full"
                style={{
                    background: '#0A0A2E',
                    border: '1px solid rgba(255,0,255,0.3)',
                    boxShadow: '0 0 15px rgba(255,0,255,0.1)',
                }}
            >
                {/* Header row */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${variables.length + 1}, 1fr)`,
                        borderBottom: '1px solid rgba(255,0,255,0.3)',
                    }}
                >
                    {variables.map((v) => (
                        <div
                            key={v}
                            className="px-4 py-3 text-center font-bold text-sm"
                            style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                color: '#00FFFF',
                                textShadow: '0 0 8px rgba(0,255,255,0.5)',
                                borderRight: '1px solid rgba(255,0,255,0.15)',
                            }}
                        >
                            {v}
                        </div>
                    ))}
                    <div
                        className="px-4 py-3 text-center font-bold text-sm"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            color: '#FF00FF',
                            textShadow: '0 0 8px rgba(255,0,255,0.5)',
                        }}
                    >
                        RESULTADO
                    </div>
                </div>

                {/* Data rows */}
                {table.map((row, rowIdx) => (
                    <div
                        key={rowIdx}
                        className="grid"
                        style={{
                            gridTemplateColumns: `repeat(${variables.length + 1}, 1fr)`,
                            borderBottom: rowIdx < table.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}
                    >
                        {variables.map((v) => (
                            <div
                                key={v}
                                className="px-4 py-2.5 text-center text-sm"
                                style={{
                                    fontFamily: "'Share Tech Mono', monospace",
                                    color: row[v] === 'V' ? '#00FF41' : '#FF0040',
                                    textShadow: row[v] === 'V' ? '0 0 6px rgba(0,255,65,0.4)' : '0 0 6px rgba(255,0,64,0.4)',
                                    borderRight: '1px solid rgba(255,0,255,0.1)',
                                }}
                            >
                                {row[v]}
                            </div>
                        ))}
                        <div
                            className="px-4 py-2.5 text-center text-sm font-bold"
                            style={{
                                fontFamily: "'Share Tech Mono', monospace",
                            }}
                        >
                            {hiddenRows.has(rowIdx) && !revealAll ? (
                                <span
                                    className="animate-question-pulse inline-block text-[#FF00FF]"
                                    style={{ textShadow: '0 0 10px rgba(255,0,255,0.6)' }}
                                >
                                    ?
                                </span>
                            ) : (
                                <span
                                    style={{
                                        color: row.result === 'V' ? '#00FF41' : '#FF0040',
                                        textShadow: row.result === 'V' ? '0 0 6px rgba(0,255,65,0.4)' : '0 0 6px rgba(255,0,64,0.4)',
                                    }}
                                >
                                    {row.result}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
