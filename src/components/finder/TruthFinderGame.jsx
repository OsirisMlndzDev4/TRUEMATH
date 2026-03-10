/**
 * ═══════════════════════════════════════════════════════
 *  TRUTH FINDER — Main Game Component
 *  Detective Informático: desencripta fórmulas lógicas
 *  paso a paso aplicando ingeniería inversa.
 * ═══════════════════════════════════════════════════════
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { finderLevelsByDifficulty, finderLevels as allFinderLevels } from '../../data/finderLevels'
import {
    generateCombinations,
    generateSegmentTable,
    evaluateSegment,
    classifyFormula,
    boolToChip,
} from '../../utils/truthFinderEngine'
import { saveScore, checkNameExists } from '../../utils/leaderboard'
import { playCorrect, playError, playSuccess, playVictory, playAlarm, playStamp } from '../../utils/sounds'
import './TruthFinderGame.css'

/* ══════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════ */
const MAX_ALERT = 5              // errores máximos antes de reiniciar
const POINTS_PER_CELL = 10       // puntos por celda correcta
const POINTS_CLASSIFY = 50       // puntos por clasificar bien

// Tiempo límite por dificultad (segundos)
const DIFFICULTY_TIMES = {
    'BÁSICO': 30,
    'INTERMEDIO': 150,   // 2:30
    'AVANZADO': 210,     // 3:30
    'EXPERTO': 300,      // 5:00
}

/* ══════════════════════════════════════════
   SVG Icon helper — reemplaza emojis
   ══════════════════════════════════════════ */
function TfIcon({ name, size = 14, style: extra }) {
    const d = {
        clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
        book:        <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
        x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
        terminal:    <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
        chevRight:   <polyline points="9 18 15 12 9 6"/>,
        check:       <polyline points="20 6 9 17 4 12"/>,
        play:        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>,
        circle:      <circle cx="12" cy="12" r="9"/>,
        lock:        <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
        unlock:      <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>,
        grid:        <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
        target:      <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
        warning:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
        trophy:      <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>,
        bolt:        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    }
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...extra }}>
            {d[name]}
        </svg>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Timer de Hackeo
   ══════════════════════════════════════════ */
function HackerTimer({ timeLeft, maxTime }) {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    const pct = maxTime > 0 ? (timeLeft / maxTime) * 100 : 100
    const isUrgent = pct <= 20       // último 20% del tiempo
    const isCritical = pct <= 7      // último 7% del tiempo

    return (
        <div className={`tf-timer ${isUrgent ? 'urgent' : ''} ${isCritical ? 'critical' : ''}`}>
            <div className="tf-timer-label"><TfIcon name="clock" size={12} /> TIEMPO ANTES DE DETECCIÓN</div>
            <div className="tf-timer-bar">
                <div
                    className="tf-timer-bar-fill"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="tf-timer-value">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Manual del Hacker
   ══════════════════════════════════════════ */
function HackerManual({ isOpen, onToggle }) {
    const operators = [
        { symbol: '∧', name: 'AND (Conjunción)', desc: 'V solo si ambos son V' },
        { symbol: '∨', name: 'OR (Disyunción)', desc: 'V si al menos uno es V' },
        { symbol: '¬', name: 'NOT (Negación)', desc: 'Invierte el valor: V↔F' },
        { symbol: '→', name: 'IMPLICA (Condicional)', desc: 'F solo si antecedente V y consecuente F' },
        { symbol: '↔', name: 'BICONDICIONAL', desc: 'V si ambos tienen el mismo valor' },
    ]

    return (
        <>
            <button className="tf-manual-toggle" onClick={onToggle} title="Manual del Hacker">
                {isOpen ? <TfIcon name="x" size={16} /> : <TfIcon name="book" size={18} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="tf-manual-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="tf-manual-title"><TfIcon name="terminal" size={14} style={{ marginRight: '0.35rem' }} /> Manual del Hacker</div>
                        {operators.map((op) => (
                            <div key={op.symbol} className="tf-manual-op">
                                <span className="tf-manual-symbol">{op.symbol}</span>
                                <div className="tf-manual-info">
                                    <div className="tf-manual-name">{op.name}</div>
                                    <div>{op.desc}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: To-Do List lateral
   (carrusel horizontal en mobile)
   ══════════════════════════════════════════ */
function TodoList({ segments, activeIndex, completedSet, focusIndex, scrollBehavior = 'smooth' }) {
    const trackRef = useRef(null)

    // Índice al que se debe centrar el carrusel
    const scrollTarget = focusIndex !== undefined ? focusIndex : activeIndex

    // Auto-scroll al card indicado cuando cambia
    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        const targetCard = track.querySelector(`[data-index="${scrollTarget}"]`)
        if (targetCard) {
            targetCard.scrollIntoView({
                behavior: scrollBehavior,
                inline: 'center',
                block: 'nearest',
            })
        }
    }, [scrollTarget, scrollBehavior])

    return (
        <div className="tf-sidebar">
            <div className="tf-todo-title"><TfIcon name="chevRight" size={12} /> Pila de Desencriptación</div>
            <div className="tf-todo-track" ref={trackRef}>
                {segments.map((seg, i) => {
                    const isCompleted = completedSet.has(seg.id)
                    const isActive = i === activeIndex && !isCompleted
                    return (
                        <div
                            key={seg.id}
                            data-index={i}
                            data-active={isActive}
                            className={`tf-todo-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        >
                            <span className="tf-todo-icon">
                                {isCompleted ? <TfIcon name="check" size={12} /> : isActive ? <TfIcon name="play" size={10} /> : <TfIcon name="circle" size={10} />}
                            </span>
                            <div>
                                <div className="tf-todo-text">
                                    {seg.description}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,255,0.4)', marginTop: '0.15rem' }}>
                                    {seg.label}
                                </div>
                            </div>
                            {isCompleted && (
                                <span className="tf-todo-stamp">Desencriptada</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Fórmula con highlighting
   ══════════════════════════════════════════ */
function FormulaPanel({ formulaStr, activeSegmentLabel, completedLabels, activeOperands = [] }) {
    const scrollWrapperRef = useRef(null)

    const chars = formulaStr.split('')

    const activeStart = formulaStr.indexOf(activeSegmentLabel)
    const activeEnd = activeStart >= 0 && activeSegmentLabel ? activeStart + activeSegmentLabel.length : -1

    const activeOperandsRanges = []
    if (activeStart >= 0 && activeSegmentLabel && activeOperands.length > 0) {
        let searchOffset = activeStart
        for (const op of activeOperands) {
            const opIdx = formulaStr.indexOf(op, searchOffset)
            if (opIdx >= activeStart && opIdx < activeEnd) {
                activeOperandsRanges.push({ start: opIdx, end: opIdx + op.length })
                searchOffset = opIdx + op.length
            }
        }
    }

    // Auto-scroll para centrar el segmento activo dentro del wrapper.
    // Usa doble rAF para garantizar que el layout ya se pintó tras montaje/transición.
    useEffect(() => {
        const wrapper = scrollWrapperRef.current
        if (!wrapper || activeStart < 0) return

        let cancelled = false
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (cancelled) return
                const chars = wrapper.querySelectorAll('.tf-formula-char.active')
                if (chars.length === 0) return

                const first = chars[0]
                const last = chars[chars.length - 1]
                const wrapperRect = wrapper.getBoundingClientRect()
                const firstRect = first.getBoundingClientRect()
                const lastRect = last.getBoundingClientRect()

                const segCenter = (firstRect.left + lastRect.right) / 2 - wrapperRect.left + wrapper.scrollLeft
                wrapper.scrollTo({ left: segCenter - wrapperRect.width / 2, behavior: 'smooth' })
            })
        })

        return () => { cancelled = true }
    }, [activeSegmentLabel, activeStart])

    const len = formulaStr.length
    const dynamicFontSize = len <= 10 ? 2.2
        : len <= 15 ? 1.8
            : len <= 20 ? 1.5
                : len <= 25 ? 1.3
                    : 1.1

    return (
        <div className="tf-formula-panel">
            <div className="tf-formula-label"><TfIcon name="lock" size={12} style={{ marginRight: '0.35rem' }} /> Mensaje Bloqueado</div>
            
            <div style={{ position: 'relative' }}>
                <div className="tf-formula-scroll-wrapper" ref={scrollWrapperRef}>
                    <div
                        className="tf-formula-text"
                        style={{ fontSize: `${dynamicFontSize}rem`, whiteSpace: 'nowrap' }}
                    >
                        {chars.map((char, i) => {
                            let cls = 'tf-formula-char'
                            const isSolved = completedLabels.some((label) => {
                                const s = formulaStr.indexOf(label)
                                return s >= 0 && i >= s && i < s + label.length
                            })

                            if (isSolved) {
                                cls += ' solved'
                            } else if (activeStart >= 0 && i >= activeStart && i < activeEnd) {
                                cls += ' active'
                                const isOperand = activeOperandsRanges.some((r) => i >= r.start && i < r.end)
                                if (isOperand) {
                                    cls += ' operand-underline'
                                }
                            } else if (!isSolved) {
                                cls += ' locked'
                            }

                            return (
                                <span key={i} className={cls}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div className="tf-formula-gradient-overlay" />
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Ficha de Drag (Custom)
   Usa mouse/touch events con ghost visible.
   ══════════════════════════════════════════ */
function DragChip({ value, onDragStart }) {
    const handlePointerDown = (e) => {
        e.preventDefault()
        onDragStart(value, e.clientX, e.clientY)
    }

    return (
        <div
            className={`tf-chip ${value === 'V' ? 'tf-chip-v' : 'tf-chip-f'}`}
            onMouseDown={handlePointerDown}
            onTouchStart={(e) => {
                const t = e.touches[0]
                onDragStart(value, t.clientX, t.clientY)
            }}
        >
            {value}
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Ghost flotante del drag
   ══════════════════════════════════════════ */
function DragGhost({ value, x, y }) {
    if (!value) return null
    return (
        <div
            className={`tf-drag-ghost ${value === 'V' ? 'tf-ghost-v' : 'tf-ghost-f'}`}
            style={{
                left: x,
                top: y,
            }}
        >
            {value}
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Barra de Alerta
   ══════════════════════════════════════════ */
function AlertBar({ current, max }) {
    const pct = Math.min((current / max) * 100, 100)
    return (
        <div className="tf-alert-bar-container">
            <div
                className="tf-alert-bar-fill"
                style={{ width: `${pct}%` }}
            />
            <div className="tf-alert-label">
                NIVEL DE ALERTA: {current}/{max}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Mini Truth Table interactiva
   Custom drag & drop con ghost visible.
   ══════════════════════════════════════════ */
function MiniTruthTable({ tableData, playerAnswers, onDrop, highlightVars, difficulty }) {
    const { columns, rows } = tableData
    const resultColIndex = columns.length - 1
    const [isExpanded, setIsExpanded] = useState(true) // Expandido por defecto
    const isBasic = difficulty === 'BÁSICO'

    // ── Custom drag state ──
    const [dragging, setDragging] = useState(null)       // { value: 'V'|'F' }
    const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 })
    const [hoverRow, setHoverRow] = useState(null)       // row index being hovered
    const dropRefs = useRef({})                          // refs para las celdas drop
    const scrollWrapperRef = useRef(null)
    const [showScrollHint, setShowScrollHint] = useState(false)
    const [needsScroll, setNeedsScroll] = useState(false) // ¿La tabla realmente necesita scroll?

    // Detectar si la tabla tiene overflow horizontal (calculado sobre su tamaño natural expandido)
    useEffect(() => {
        const el = scrollWrapperRef.current
        if (!el) return
        const check = () => {
            // Guardamos el ancho de la ventana local
            const clientW = el.clientWidth
            
            // Para saber si "necesita scroll", tenemos que mirar su tamaño
            // natural. Si está contraído, temporalmente le quitamos la clase
            // para medir su scrollWidth real, y se la devolvemos al instante.
            const wasContracted = el.classList.contains('contracted')
            if (wasContracted) el.classList.remove('contracted')
            
            const naturalScrollWidth = el.scrollWidth
            
            if (wasContracted) el.classList.add('contracted')

            const hasOv = naturalScrollWidth > clientW
            setNeedsScroll(hasOv)
            
            // La flecha sí depende del scroll actual
            const currentScrollWidth = el.scrollWidth
            const atEnd = el.scrollLeft + clientW >= currentScrollWidth - 2
            
            // Solo mostramos hint si está expandido, hay overflow y no llegó al final
            setShowScrollHint(isExpanded && hasOv && !atEnd)
        }
        check()
        const observer = new ResizeObserver(check)
        observer.observe(el)
        el.addEventListener('scroll', check, { passive: true })
        return () => {
            observer.disconnect()
            el.removeEventListener('scroll', check)
        }
    }, [columns.length])

    // Iniciar arrastre
    const handleDragStart = useCallback((value, clientX, clientY) => {
        setDragging({ value })
        setGhostPos({ x: clientX, y: clientY })

        const handleMove = (mx, my) => {
            setGhostPos({ x: mx, y: my })

            // Detectar sobre qué celda estamos
            let foundRow = null
            for (const [key, el] of Object.entries(dropRefs.current)) {
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom) {
                        foundRow = parseInt(key, 10)
                        break
                    }
                }
            }
            setHoverRow(foundRow)
        }

        const handleMouseMove = (e) => handleMove(e.clientX, e.clientY)
        const handleTouchMove = (e) => {
            const t = e.touches[0]
            handleMove(t.clientX, t.clientY)
        }

        const handleEnd = () => {
            // Soltar sobre la celda
            setDragging((current) => {
                setHoverRow((currentRow) => {
                    if (currentRow !== null && current) {
                        onDrop(currentRow, current.value)
                    }
                    return null
                })
                return null
            })
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleEnd)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleEnd)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleEnd)
        window.addEventListener('touchmove', handleTouchMove, { passive: false })
        window.addEventListener('touchend', handleEnd)
    }, [onDrop])

    // También permite clic como alternativa a drag
    const [clickMode, setClickMode] = useState(null) // 'V' | 'F' | null

    return (
        <div className="tf-table-panel">
            <div className="tf-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div className="tf-table-title" style={{ marginBottom: 0 }}><TfIcon name="grid" size={13} style={{ marginRight: '0.35rem' }} /> Tabla de Verdad — Sub-segmento</div>
                
                {/* Solo mostrar botones de expandir/contraer si la tabla es más grande que el contenedor */}
                {needsScroll && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`tf-neon-btn sm ${!isExpanded ? 'cyan' : ''}`}
                            title="Contraer tabla"
                            style={{ padding: '0.35rem', opacity: !isExpanded ? 1 : 0.5, border: !isExpanded ? undefined : '1px solid rgba(0,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setIsExpanded(false)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="4 14 10 14 10 20"></polyline>
                                <polyline points="20 10 14 10 14 4"></polyline>
                                <line x1="14" y1="10" x2="21" y2="3"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                        </button>
                        <button
                            className={`tf-neon-btn sm ${isExpanded ? 'cyan' : ''}`}
                            title="Expandir tabla (Scroll/Arrastre)"
                            style={{ padding: '0.35rem', opacity: isExpanded ? 1 : 0.5, border: isExpanded ? undefined : '1px solid rgba(0,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setIsExpanded(true)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Fichas arrastrables (Solo en nivel Básico) */}
            <div className="tf-chips-container">
                {isBasic && (
                    <>
                        <DragChip value="V" onDragStart={handleDragStart} />
                        <DragChip value="F" onDragStart={handleDragStart} />
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginLeft: '1rem' }}>
                            O CLICK:
                        </span>
                    </>
                )}
                {!isBasic && (
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                        SELECCIONA RESPUESTA (CLICK):
                    </span>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        className={`tf-neon-btn sm ${clickMode === 'V' ? 'verde' : 'cyan'}`}
                        style={{
                            background: clickMode === 'V' ? 'rgba(0,255,65,0.15)' : 'transparent',
                            padding: '0.25rem 0.75rem',
                        }}
                        onClick={() => setClickMode(clickMode === 'V' ? null : 'V')}
                    >
                        V
                    </button>
                    <button
                        className={`tf-neon-btn sm ${clickMode === 'F' ? 'magenta' : 'cyan'}`}
                        style={{
                            background: clickMode === 'F' ? 'rgba(255,0,255,0.15)' : 'transparent',
                            padding: '0.25rem 0.75rem',
                        }}
                        onClick={() => setClickMode(clickMode === 'F' ? null : 'F')}
                    >
                        F
                    </button>
                </div>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div className={`tf-table-scroll-wrapper ${isExpanded ? 'expanded' : 'contracted'}`} ref={scrollWrapperRef}>
                    <table className="tf-truth-table">
                        <thead>
                            <tr>
                                {columns.map((col, ci) => (
                                    <th
                                        key={ci}
                                        className={ci === resultColIndex ? 'result-col' : ''}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, ri) => {
                                const answer = playerAnswers[ri]
                                return (
                                    <tr key={ri}>
                                        {/* Variable columns */}
                                        {row.values.map((val, ci) => (
                                            <td
                                                key={ci}
                                                className={`var-cell ${highlightVars.includes(columns[ci]) ? 'highlight' : ''}`}
                                            >
                                                {boolToChip(val)}
                                            </td>
                                        ))}
                                        {/* Result column (drop target) */}
                                        <td style={{ padding: '0.3rem' }}>
                                            {answer !== undefined ? (
                                                <div
                                                    className={`tf-drop-cell filled ${answer.status}`}
                                                >
                                                    {answer.value}
                                                </div>
                                            ) : (
                                                <div
                                                    ref={(el) => { dropRefs.current[ri] = el }}
                                                    className={`tf-drop-cell ${dragging && hoverRow === ri ? 'drag-over' : ''}`}
                                                    onClick={() => {
                                                        if (clickMode) {
                                                            onDrop(ri, clickMode)
                                                        }
                                                    }}
                                                >
                                                    <span className="tf-cell-question">?</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Gradient overlay — solo visible si hay overflow y no se llegó al final */}
                {showScrollHint && <div className="tf-table-gradient-overlay" />}
            </div>

            {/* Ghost flotante (Solo si drag está habilitado) */}
            {isBasic && <DragGhost value={dragging?.value} x={ghostPos.x} y={ghostPos.y} />}
        </div>
    )
}

/* ══════════════════════════════════════════
   SUB-COMPONENTE: Panel de Clasificación
   Muestra la tabla de verdad completa para
   que el jugador pueda clasificar la fórmula.
   ══════════════════════════════════════════ */
function ClassificationPanel({ onClassify, fullTable }) {
    return (
        <motion.div
            className="tf-classify-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            <div className="tf-classify-title">
                <TfIcon name="target" size={14} style={{ marginRight: '0.35rem' }} /> Clasifica el Resultado Final
            </div>
            <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '1rem',
                lineHeight: 1.5,
            }}>
                Observa la columna de resultados y clasifica la fórmula:
            </p>

            {/* Tabla resumen de resultados */}
            {fullTable && (
                <div className="tf-table-scroll-wrapper" style={{ marginBottom: '1.25rem' }}>
                    <table className="tf-truth-table">
                        <thead>
                            <tr>
                                {fullTable.columns.map((col, ci) => (
                                    <th
                                        key={ci}
                                        className={ci === fullTable.columns.length - 1 ? 'result-col' : ''}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {fullTable.rows.map((row, ri) => (
                                <tr key={ri}>
                                    {row.values.map((val, ci) => (
                                        <td key={ci} className="var-cell">
                                            {boolToChip(val)}
                                        </td>
                                    ))}
                                    <td style={{
                                        fontWeight: 'bold',
                                        color: row.result ? 'var(--color-verde)' : 'var(--color-red)',
                                        textShadow: row.result
                                            ? '0 0 8px rgba(0,255,65,0.5)'
                                            : '0 0 8px rgba(255,0,64,0.5)',
                                        borderLeft: '2px solid rgba(0,255,255,0.3)',
                                    }}>
                                        {boolToChip(row.result)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="tf-classify-buttons">
                <button className="tf-classify-btn taut" onClick={() => onClassify('TAUTOLOGÍA')}>
                    Tautología
                </button>
                <button className="tf-classify-btn cont" onClick={() => onClassify('CONTINGENCIA')}>
                    Contingencia
                </button>
                <button className="tf-classify-btn contra" onClick={() => onClassify('CONTRADICCIÓN')}>
                    Contradicción
                </button>
            </div>
        </motion.div>
    )
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL: TruthFinderGame
   ══════════════════════════════════════════ */
export default function TruthFinderGame() {
    const navigate = useNavigate()
    const { difficulty } = useParams()

    // Filtrar niveles por dificultad seleccionada
    const finderLevels = useMemo(() => {
        if (difficulty && finderLevelsByDifficulty[difficulty]) {
            return finderLevelsByDifficulty[difficulty]
        }
        return allFinderLevels
    }, [difficulty])

    // ── Estado del juego ──
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
    const [gamePhase, setGamePhase] = useState('intro')  // 'intro' | 'playing' | 'revealing' | 'classify' | 'levelComplete' | 'glitch' | 'allComplete'
    const [activeSegIdx, setActiveSegIdx] = useState(0)
    const [completedSegs, setCompletedSegs] = useState(new Set())
    const [playerAnswers, setPlayerAnswers] = useState({})  // { rowIdx: { value, status } }
    const [alertLevel, setAlertLevel] = useState(0)
    const [score, setScore] = useState(0)
    const [manualOpen, setManualOpen] = useState(false)
    const [classifyResult, setClassifyResult] = useState(null)  // null | 'correct' | 'incorrect'
    const [playerName, setPlayerName] = useState('')
    const [saved, setSaved] = useState(false)
    const [nameError, setNameError] = useState('')
    const [lastTimeBonus, setLastTimeBonus] = useState(0)
    const [saving, setSaving] = useState(false)

    // ── Tabla acumulada progresiva ──
    // { columns: string[], rows: boolean[][] }
    // Se construye columna a columna conforme se resuelven segmentos
    const [accumulatedTable, setAccumulatedTable] = useState(null)
    const [revealingSegLabel, setRevealingSegLabel] = useState('')

    // ── Timer ──
    const [timeLeft, setTimeLeft] = useState(0)
    const [maxTime, setMaxTime] = useState(0)

    // Referencia al segmento actual pre-calculado
    const tableDataRef = useRef(null)

    // Referencia al tope del contenedor para scroll-to-top
    const topRef = useRef(null)

    // ── Datos del nivel actual ──
    const level = finderLevels[currentLevelIdx]
    const segments = level ? level.segments : []
    const activeSegment = segments[activeSegIdx] || null

    // ── Construir mapa de segmentos para el engine ──
    const segmentMap = {}
    if (level) {
        for (const seg of level.segments) {
            segmentMap[seg.id] = seg
        }
    }

    // ── Precalcular combinaciones y tabla del segmento activo ──
    const combinations = level ? generateCombinations(level.variables) : []

    if (activeSegment && gamePhase === 'playing') {
        tableDataRef.current = generateSegmentTable(
            activeSegment,
            level.variables,
            combinations,
            segmentMap,
        )
    }

    // ── Tabla de display: para segmentos posteriores al primero,
    //    fusionar con las columnas acumuladas como contexto ──
    let displayTableData = tableDataRef.current
    if (tableDataRef.current && accumulatedTable && activeSegIdx > 0 && gamePhase === 'playing') {
        const currentTable = tableDataRef.current
        displayTableData = {
            columns: [...accumulatedTable.columns, currentTable.columns[currentTable.columns.length - 1]],
            rows: currentTable.rows.map((row, ri) => ({
                values: accumulatedTable.rows[ri],
                result: row.result,
            })),
        }
    }

    // ── Variables/columnas a resaltar (operandos directos del segmento activo) ──
    const highlightVars = activeSegment
        ? activeSegment.operands.map((op) => {
            if (level.variables.includes(op)) return op
            // Si es referencia a un segmento previo, usar su label
            const seg = segmentMap[op]
            return seg ? seg.label : op
        })
        : []

    /* ── HANDLERS ── */

    /** Iniciar un nivel */
    const handleStartLevel = useCallback(() => {
        setGamePhase('playing')
        setActiveSegIdx(0)
        setCompletedSegs(new Set())
        setPlayerAnswers({})
        setAlertLevel(0)
        setClassifyResult(null)
        // Inicializar timer según dificultad
        const seconds = DIFFICULTY_TIMES[level?.difficulty] || 60
        setTimeLeft(seconds)
        setMaxTime(seconds)
        // Inicializar tabla acumulada con las variables base
        if (level) {
            const combos = generateCombinations(level.variables)
            setAccumulatedTable({
                columns: [...level.variables],
                rows: combos.map((combo) => level.variables.map((v) => combo[v])),
            })
        }
    }, [level])

    /** Drop de ficha en una celda */
    const handleCellDrop = useCallback((rowIdx, chipValue) => {
        // No permitir re-dropar en celdas ya correctas
        if (playerAnswers[rowIdx]?.status === 'correct') return

        const table = tableDataRef.current
        if (!table) return

        const expectedBool = table.rows[rowIdx].result
        const expected = boolToChip(expectedBool)
        const isCorrect = chipValue === expected

        if (isCorrect) {
            playCorrect()
            setPlayerAnswers((prev) => ({
                ...prev,
                [rowIdx]: { value: chipValue, status: 'correct' },
            }))
            setScore((prev) => prev + POINTS_PER_CELL)
        } else {
            playError()
            setPlayerAnswers((prev) => ({
                ...prev,
                [rowIdx]: { value: chipValue, status: 'incorrect' },
            }))
            setAlertLevel((prev) => {
                const next = prev + 1
                if (next >= MAX_ALERT) {
                    // Trigger glitch/reinicio
                    setTimeout(() => setGamePhase('glitch'), 300)
                }
                return next
            })
            // Limpiar la celda incorrecta después de la animación
            setTimeout(() => {
                setPlayerAnswers((prev) => {
                    const copy = { ...prev }
                    if (copy[rowIdx]?.status === 'incorrect') {
                        delete copy[rowIdx]
                    }
                    return copy
                })
            }, 600)
        }
    }, [playerAnswers])

    /** Verificar si el segmento actual está completo */
    useEffect(() => {
        if (gamePhase !== 'playing' || !tableDataRef.current) return

        const totalRows = tableDataRef.current.rows.length
        const correctCount = Object.values(playerAnswers).filter(
            (a) => a.status === 'correct'
        ).length

        if (correctCount === totalRows && totalRows > 0) {
            // Segmento completado → agregar columna a la tabla acumulada
            const completedSeg = segments[activeSegIdx]
            const segTable = tableDataRef.current

            setTimeout(() => {
                playStamp()
                setCompletedSegs((prev) => new Set([...prev, completedSeg.id]))
                setPlayerAnswers({})

                setAccumulatedTable((prev) => {
                    if (!prev) return prev
                    return {
                        columns: [...prev.columns, completedSeg.label],
                        rows: prev.rows.map((row, ri) => [...row, segTable.rows[ri].result]),
                    }
                })

                if (activeSegIdx + 1 < segments.length) {
                    setRevealingSegLabel(completedSeg.label)
                    setGamePhase('revealing')
                    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else {
                    setGamePhase('classify')
                }
            }, 600)
        }
    }, [playerAnswers, gamePhase, activeSegIdx, segments])

    /** Revealing animation → avanzar al siguiente segmento */
    useEffect(() => {
        if (gamePhase === 'revealing') {
            const timer = setTimeout(() => {
                setActiveSegIdx((prev) => prev + 1)
                setGamePhase('playing')
                setRevealingSegLabel('')
                topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [gamePhase])

    /** Timer countdown */
    useEffect(() => {
        // Solo correr durante playing y classify
        if (gamePhase !== 'playing' && gamePhase !== 'classify') return

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setGamePhase('glitch')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [gamePhase])

    /** Glitch reset */
    useEffect(() => {
        if (gamePhase === 'glitch') {
            playAlarm()
            const timer = setTimeout(() => {
                setGamePhase('intro')
                setAlertLevel(0)
                setAccumulatedTable(null)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [gamePhase])

    /** Clasificar la fórmula */
    const handleClassify = useCallback((verdict) => {
        const isCorrect = verdict === level.classification
        setClassifyResult(isCorrect ? 'correct' : 'incorrect')
        if (isCorrect) {
            playSuccess()
            const timeBonus = Math.max(25, Math.round(200 * (timeLeft / maxTime)))
            setLastTimeBonus(timeBonus)
            setScore((prev) => prev + POINTS_CLASSIFY + timeBonus)
        } else {
            playError()
        }
        setTimeout(() => {
            setGamePhase('levelComplete')
        }, 1500)
    }, [level, timeLeft, maxTime])

    /** Siguiente nivel */
    const handleNextLevel = useCallback(() => {
        if (currentLevelIdx + 1 < finderLevels.length) {
            setCurrentLevelIdx((prev) => prev + 1)
            setGamePhase('intro')
            setClassifyResult(null)
        } else {
            playVictory()
            setGamePhase('allComplete')
        }
    }, [currentLevelIdx])

    /** [DEV] Saltar nivel actual directo a levelComplete */
    const handleDevSkip = useCallback(() => {
        setScore((prev) => prev + 100)
        setClassifyResult('correct')
        setLastTimeBonus(25)
        setGamePhase('levelComplete')
        setCompletedSegs(new Set(segments.map((s) => s.id)))
        setPlayerAnswers({})
        setAlertLevel(0)
    }, [segments])

    /** [DEV] Completar todos los niveles restantes de golpe */
    const handleDevFinish = useCallback(() => {
        setScore((prev) => prev + (finderLevels.length - currentLevelIdx) * 100)
        setCurrentLevelIdx(finderLevels.length - 1)
        setClassifyResult('correct')
        playVictory()
        setGamePhase('allComplete')
    }, [currentLevelIdx, finderLevels.length])

    /** Salir al home */
    const handleExit = useCallback(() => {
        navigate('/finder')
    }, [navigate])

    // Labels de segmentos ya resueltos (para el highlight de la fórmula)
    const completedLabels = segments
        .filter((seg) => completedSegs.has(seg.id))
        .map((seg) => seg.label)

    /* ══════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════ */

    // ── Pantalla de Glitch (reinicio) ──
    if (gamePhase === 'glitch') {
        return (
            <motion.div
                className="tf-glitch-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="tf-glitch-text"><TfIcon name="warning" size={24} style={{ marginRight: '0.5rem' }} /> ALERTA MÁXIMA <TfIcon name="warning" size={24} style={{ marginLeft: '0.5rem' }} /></div>
                <p style={{
                    color: 'rgba(255,0,64,0.7)',
                    fontSize: '0.8rem',
                    fontFamily: "'Share Tech Mono', monospace",
                }}>
                    Conexión detectada — Reiniciando nivel...
                </p>
            </motion.div>
        )
    }

    // ── Handler para guardar puntuación ──
    const handleSaveScore = async () => {
        if (!playerName.trim() || saving) return
        const upperName = playerName.trim().toUpperCase()
        setSaving(true)
        const exists = await checkNameExists('finder', upperName)
        if (exists) {
            setNameError('Ese nombre ya existe. Usa otro.')
            setSaving(false)
            return
        }
        setNameError('')
        const ok = await saveScore('finder', {
            name: upperName,
            score,
            difficulty: difficulty || null,
        })
        setSaving(false)
        if (!ok) {
            setNameError('Error al guardar. Intenta de nuevo.')
            return
        }
        setSaved(true)
        setTimeout(() => navigate('/leaderboard'), 800)
    }

    // ── All Complete ──
    if (gamePhase === 'allComplete') {
        return (
            <motion.div
                className="tf-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="tf-intro">
                    <motion.div
                        className="tf-intro-card"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <div style={{
                            marginBottom: '1rem',
                            color: '#FFD700',
                            filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))',
                        }}><TfIcon name="trophy" size={48} /></div>
                        <div className="tf-intro-title" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.6)' }}>
                            MISIÓN COMPLETA
                        </div>
                        <p style={{
                            color: 'rgba(255,215,0,0.6)',
                            fontSize: '0.75rem',
                            letterSpacing: '0.2em',
                            marginTop: '0.5rem',
                            marginBottom: '1.5rem',
                        }}>
                            TODOS LOS MENSAJES DESENCRIPTADOS
                        </p>
                        <div className="tf-score" style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '1.5rem' }}>
                            {score} PTS
                        </div>

                        {/* Guardar puntuación */}
                        {!saved ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <p style={{
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.15em',
                                    color: 'rgba(0,255,255,0.5)',
                                    textTransform: 'uppercase',
                                }}>
                                    Ingresa tu nombre para el leaderboard
                                </p>
                                <input
                                    type="text"
                                    maxLength={12}
                                    value={playerName}
                                    onChange={(e) => { setPlayerName(e.target.value); setNameError('') }}
                                    placeholder="TU NOMBRE..."
                                    disabled={saving}
                                    className="tf-name-input"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                                    style={{
                                        width: '100%',
                                        maxWidth: '16rem',
                                        padding: '0.6rem 1rem',
                                        textAlign: 'center',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        background: 'transparent',
                                        color: '#00FFFF',
                                        border: `2px solid ${nameError ? '#FF0040' : '#00FFFF'}`,
                                        boxShadow: nameError
                                            ? '0 0 10px rgba(255,0,64,0.3), inset 0 0 10px rgba(255,0,64,0.05)'
                                            : '0 0 10px rgba(0,255,255,0.3), inset 0 0 10px rgba(0,255,255,0.05)',
                                        fontFamily: "'Share Tech Mono', monospace",
                                        outline: 'none',
                                    }}
                                />
                                {nameError && (
                                    <p style={{
                                        color: '#FF0040',
                                        fontSize: '0.7rem',
                                        fontFamily: "'Share Tech Mono', monospace",
                                        textShadow: '0 0 8px rgba(255,0,64,0.4)',
                                        marginTop: '0.25rem',
                                    }}>
                                        {nameError}
                                    </p>
                                )}
                                <button
                                    className="tf-neon-btn cyan"
                                    onClick={handleSaveScore}
                                    disabled={!playerName.trim() || saving}
                                    style={{ opacity: (playerName.trim() && !saving) ? 1 : 0.4 }}
                                >
                                    {saving ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{
                                                width: '14px',
                                                height: '14px',
                                                border: '2px solid rgba(0,255,255,0.3)',
                                                borderTopColor: '#00FFFF',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                animation: 'spin 0.8s linear infinite',
                                            }} />
                                            GUARDANDO...
                                        </span>
                                    ) : 'GUARDAR PUNTUACIÓN'}
                                </button>
                            </div>
                        ) : (
                            <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    color: 'var(--color-verde)',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    fontFamily: "'Orbitron', sans-serif",
                                    textShadow: '0 0 10px rgba(0,255,65,0.6)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <TfIcon name="check" size={16} style={{ marginRight: '0.35rem' }} /> GUARDADO
                            </motion.p>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="tf-neon-btn cyan" onClick={handleExit}>
                                VOLVER AL HUB
                            </button>
                            <button className="tf-neon-btn sm magenta" onClick={() => navigate('/leaderboard')}>
                                LEADERBOARD
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            ref={topRef}
            className="tf-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── HEADER ── */}
            <div className="tf-header">
                <div>
                    <h2
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '1.4rem',
                            color: 'var(--color-cyan)',
                            textShadow: '0 0 15px rgba(0,255,255,0.5)',
                        }}
                    >
                        TRUTH FINDER
                    </h2>
                    <p style={{
                        fontFamily: "'Orbitron'",
                        fontSize: '0.55rem',
                        letterSpacing: '0.25em',
                        color: 'rgba(0,255,255,0.5)',
                        marginTop: '0.25rem',
                    }}>
                        Nivel {currentLevelIdx + 1} / {finderLevels.length}
                        {level && ` — ${level.difficulty}`}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* DEV BUTTONS — QUITAR EN PRODUCCIÓN */}
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                            onClick={handleDevSkip}
                            style={{
                                padding: '0.3rem 0.5rem',
                                fontSize: '0.55rem',
                                background: 'rgba(255,0,64,0.15)',
                                border: '1px solid #FF0040',
                                color: '#FF0040',
                                cursor: 'pointer',
                                fontFamily: "'Share Tech Mono', monospace",
                                letterSpacing: '0.05em',
                            }}
                        >
                            SKIP LVL
                        </button>
                        <button
                            onClick={handleDevFinish}
                            style={{
                                padding: '0.3rem 0.5rem',
                                fontSize: '0.55rem',
                                background: 'rgba(255,215,0,0.15)',
                                border: '1px solid #FFD700',
                                color: '#FFD700',
                                cursor: 'pointer',
                                fontFamily: "'Share Tech Mono', monospace",
                                letterSpacing: '0.05em',
                            }}
                        >
                            FINISH ALL
                        </button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="tf-score-label">SCORE</div>
                        <div className="tf-score">{score}</div>
                    </div>
                </div>
            </div>

            {/* ── INTRO SCREEN ── */}
            {gamePhase === 'intro' && level && (
                <div className="tf-intro">
                    <motion.div
                        className="tf-intro-card"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <div className="tf-intro-title">{level.title}</div>
                        <div className="tf-intro-subtitle">
                            Protocolo de Desencriptación
                        </div>
                        <div className="tf-intro-level">
                            DIFICULTAD: {level.difficulty}
                        </div>
                        <div className="tf-intro-formula">{level.formulaStr}</div>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                className="tf-neon-btn cyan"
                                onClick={handleStartLevel}
                            >
                                <TfIcon name="play" size={12} style={{ marginRight: '0.35rem' }} /> INICIAR DESENCRIPTACIÓN
                            </button>
                            <button
                                className="tf-neon-btn sm magenta"
                                onClick={handleExit}
                            >
                                SALIR
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── REVEALING + PLAYING + CLASSIFY — unified layout ── */}
            {(gamePhase === 'revealing' || gamePhase === 'playing' || gamePhase === 'classify') && (
                <div className="tf-main">
                    {/* Sidebar: single persistent TodoList */}
                    <TodoList
                        segments={segments}
                        activeIndex={activeSegIdx}
                        completedSet={completedSegs}
                        focusIndex={activeSegIdx}
                        scrollBehavior="smooth"
                    />

                    {/* Center panel — content switches by phase */}
                    <div className="tf-center">
                        {/* ── Revealing animation ── */}
                        {gamePhase === 'revealing' && accumulatedTable && (
                            <>
                                <FormulaPanel
                                    formulaStr={level.formulaStr}
                                    activeSegmentLabel=''
                                    completedLabels={completedLabels}
                                />
                                <motion.div
                                    className="tf-reveal-panel"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="tf-reveal-title">
                                        <TfIcon name="grid" size={13} style={{ marginRight: '0.35rem' }} /> Desencriptando bloque: <span style={{ color: 'var(--color-cyan)' }}>{revealingSegLabel}</span>
                                    </div>
                                    <div className="tf-reveal-bar">
                                        <div className="tf-reveal-bar-fill" />
                                    </div>
                                    <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
                                        <table className="tf-truth-table">
                                            <thead>
                                                <tr>
                                                    {accumulatedTable.columns.map((col, ci) => (
                                                        <th
                                                            key={ci}
                                                            className={ci === accumulatedTable.columns.length - 1 ? 'result-col tf-new-col' : ''}
                                                        >
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {accumulatedTable.rows.map((row, ri) => (
                                                    <tr key={ri}>
                                                        {row.map((val, ci) => (
                                                            <td
                                                                key={ci}
                                                                className={ci === accumulatedTable.columns.length - 1 ? 'tf-new-col' : 'var-cell'}
                                                                style={ci === accumulatedTable.columns.length - 1 ? {
                                                                    fontWeight: 'bold',
                                                                    color: val ? 'var(--color-verde)' : 'var(--color-red)',
                                                                    textShadow: val
                                                                        ? '0 0 8px rgba(0,255,65,0.5)'
                                                                        : '0 0 8px rgba(255,0,64,0.5)',
                                                                    borderLeft: '2px solid rgba(0,255,255,0.3)',
                                                                } : undefined}
                                                            >
                                                                {boolToChip(val)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* ── Playing / Classify ── */}
                        {(gamePhase === 'playing' || gamePhase === 'classify') && (
                            <>
                                {/* Alert bar */}
                                <AlertBar current={alertLevel} max={MAX_ALERT} />

                                {/* Timer */}
                                <HackerTimer timeLeft={timeLeft} maxTime={maxTime} />

                                {/* Fórmula */}
                                <FormulaPanel
                                    formulaStr={level.formulaStr}
                                    activeSegmentLabel={activeSegment?.label || ''}
                                    completedLabels={completedLabels}
                                    activeOperands={highlightVars}
                                />

                                {/* Mini tabla (solo en fase playing) */}
                                {gamePhase === 'playing' && displayTableData && (
                                    <motion.div
                                        key={activeSegment.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <MiniTruthTable
                                            tableData={displayTableData}
                                            playerAnswers={playerAnswers}
                                            onDrop={handleCellDrop}
                                            highlightVars={highlightVars}
                                        />
                                    </motion.div>
                                )}

                                {/* Clasificación final — usa la tabla acumulada */}
                                {gamePhase === 'classify' && !classifyResult && (
                                    <ClassificationPanel
                                        onClassify={handleClassify}
                                        fullTable={accumulatedTable ? {
                                            columns: accumulatedTable.columns,
                                            rows: accumulatedTable.rows.map((row) => ({
                                                values: row.slice(0, -1),
                                                result: row[row.length - 1],
                                            })),
                                        } : null}
                                    />
                                )}

                                {/* Feedback de clasificación */}
                                {classifyResult && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{
                                            textAlign: 'center',
                                            padding: '1.5rem',
                                            border: `2px solid ${classifyResult === 'correct' ? 'var(--color-verde)' : 'var(--color-red)'}`,
                                            background: 'rgba(10,10,46,0.8)',
                                        }}
                                    >
                                        <div style={{ marginBottom: '0.5rem', color: classifyResult === 'correct' ? 'var(--color-verde)' : 'var(--color-red)' }}>
                                            {classifyResult === 'correct' ? <TfIcon name="check" size={40} /> : <TfIcon name="x" size={40} />}
                                        </div>
                                        <p style={{
                                            fontFamily: "'Orbitron'",
                                            fontSize: '1rem',
                                            color: classifyResult === 'correct' ? 'var(--color-verde)' : 'var(--color-red)',
                                            textShadow: classifyResult === 'correct'
                                                ? '0 0 10px rgba(0,255,65,0.6)'
                                                : '0 0 10px rgba(255,0,64,0.6)',
                                        }}>
                                            {classifyResult === 'correct'
                                                ? '¡CLASIFICACIÓN CORRECTA!'
                                                : `INCORRECTO — Era: ${level.classification}`}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Exit button */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    <button
                                        className="tf-neon-btn sm magenta"
                                        onClick={handleExit}
                                    >
                                        SALIR
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── LEVEL COMPLETE OVERLAY ── */}
            <AnimatePresence>
                {gamePhase === 'levelComplete' && (
                    <motion.div
                        className="tf-level-complete"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="tf-level-complete-card"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                        >
                            <div style={{ marginBottom: '0.75rem', color: '#00FFFF', filter: 'drop-shadow(0 0 10px rgba(0,255,255,0.5))' }}><TfIcon name="unlock" size={48} /></div>
                            <h3 style={{
                                fontFamily: "'Orbitron'",
                                fontSize: '1.2rem',
                                color: 'var(--color-cyan)',
                                textShadow: '0 0 15px rgba(0,255,255,0.6)',
                                marginBottom: '0.5rem',
                            }}>
                                MENSAJE DESENCRIPTADO
                            </h3>
                            <p style={{
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '0.7rem',
                                letterSpacing: '0.15em',
                                marginBottom: '0.5rem',
                            }}>
                                {level.formulaStr}
                            </p>
                            <p style={{
                                fontFamily: "'Orbitron'",
                                fontSize: '0.8rem',
                                color: 'var(--color-verde)',
                                marginBottom: '1.5rem',
                            }}>
                                {level.classification}
                            </p>
                            <div className="tf-score" style={{ marginBottom: '0.5rem' }}>
                                {score} PTS
                            </div>
                            {classifyResult === 'correct' && lastTimeBonus > 0 && (
                                <p style={{
                                    color: '#FFD700',
                                    fontSize: '0.7rem',
                                    fontFamily: "'Share Tech Mono', monospace",
                                    textShadow: '0 0 8px rgba(255,215,0,0.4)',
                                    marginBottom: '1.5rem',
                                }}>
                                    <TfIcon name="bolt" size={14} style={{ marginRight: '0.25rem' }} /> Bonus de tiempo: +{lastTimeBonus} pts
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button className="tf-neon-btn cyan" onClick={handleNextLevel}>
                                    {currentLevelIdx + 1 < finderLevels.length
                                        ? 'SIGUIENTE NIVEL →'
                                        : 'VER RESULTADOS'}
                                </button>
                                <button className="tf-neon-btn sm magenta" onClick={handleExit}>
                                    SALIR
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MANUAL DEL HACKER (flotante) ── */}
            <HackerManual isOpen={manualOpen} onToggle={() => setManualOpen(!manualOpen)} />
        </motion.div>
    )
}
