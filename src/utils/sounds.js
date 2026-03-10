/**
 * ═══════════════════════════════════════════════════════
 *  TRUEMATH — Synthetic Sound FX (Web Audio API)
 *  No external audio files needed. All sounds generated
 *  programmatically with an electronic/cyberpunk feel.
 * ═══════════════════════════════════════════════════════
 */

let ctx = null

function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
}

function tone(freq, type, vol, dur, delay = 0) {
    const c = getCtx()
    const osc = c.createOscillator()
    const g = c.createGain()
    const t = c.currentTime + delay
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    osc.connect(g)
    g.connect(c.destination)
    osc.start(t)
    osc.stop(t + dur)
}

/** Short positive blip — correct cell / correct token */
export function playCorrect() {
    try {
        tone(880, 'sine', 0.09, 0.13)
        tone(1320, 'sine', 0.04, 0.10, 0.05)
    } catch { /* AudioContext blocked */ }
}

/** Low descending buzz — wrong answer */
export function playError() {
    try {
        const c = getCtx()
        const osc = c.createOscillator()
        const g = c.createGain()
        const t = c.currentTime
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, t)
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.25)
        g.gain.setValueAtTime(0.10, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
        osc.connect(g)
        g.connect(c.destination)
        osc.start(t)
        osc.stop(t + 0.3)
    } catch {}
}

/** Ascending arpeggio — segment / level complete */
export function playSuccess() {
    try {
        const notes = [523.25, 659.25, 783.99, 1046.50]
        notes.forEach((f, i) => tone(f, 'sine', 0.07, 0.32, i * 0.09))
    } catch {}
}

/** Rich chord + sparkle — all levels complete / victory */
export function playVictory() {
    try {
        [523.25, 659.25, 783.99].forEach(f => tone(f, 'sine', 0.06, 1.4))
        [1046.5, 1318.5, 1568, 2093].forEach((f, i) =>
            tone(f, 'sine', 0.045, 0.55, 0.25 + i * 0.1)
        )
    } catch {}
}

/** Stamp impact — heavy thump + noise burst + mid click (like a rubber stamp on paper) */
export function playStamp() {
    try {
        const c = getCtx()
        const t = c.currentTime

        // Layer 1: low thump (surface impact)
        const thump = c.createOscillator()
        const tg = c.createGain()
        thump.type = 'sine'
        thump.frequency.setValueAtTime(90, t)
        thump.frequency.exponentialRampToValueAtTime(35, t + 0.18)
        tg.gain.setValueAtTime(0.28, t)
        tg.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
        thump.connect(tg)
        tg.connect(c.destination)
        thump.start(t)
        thump.stop(t + 0.25)

        // Layer 2: noise burst (paper/wood slap texture)
        const len = Math.floor(c.sampleRate * 0.07)
        const buf = c.createBuffer(1, len, c.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < len; i++) {
            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4)
        }
        const noise = c.createBufferSource()
        noise.buffer = buf
        const bp = c.createBiquadFilter()
        bp.type = 'bandpass'
        bp.frequency.value = 900
        bp.Q.value = 0.8
        const ng = c.createGain()
        ng.gain.setValueAtTime(0.18, t)
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
        noise.connect(bp)
        bp.connect(ng)
        ng.connect(c.destination)
        noise.start(t)

        // Layer 3: mid click (snap of stamp mechanism)
        const click = c.createOscillator()
        const cg = c.createGain()
        click.type = 'triangle'
        click.frequency.setValueAtTime(350, t)
        click.frequency.exponentialRampToValueAtTime(120, t + 0.06)
        cg.gain.setValueAtTime(0.14, t)
        cg.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
        click.connect(cg)
        cg.connect(c.destination)
        click.start(t)
        click.stop(t + 0.1)
    } catch {}
}

/** Security breach alarm — two-tone siren with distortion */
export function playAlarm() {
    try {
        const c = getCtx()
        const t = c.currentTime

        // Two-tone siren: 4 cycles of high-low alternation
        for (let i = 0; i < 4; i++) {
            const hi = c.createOscillator()
            const hg = c.createGain()
            const hiStart = t + i * 0.24
            hi.type = 'square'
            hi.frequency.setValueAtTime(680, hiStart)
            hg.gain.setValueAtTime(0.13, hiStart)
            hg.gain.setValueAtTime(0.13, hiStart + 0.10)
            hg.gain.exponentialRampToValueAtTime(0.001, hiStart + 0.12)
            hi.connect(hg)
            hg.connect(c.destination)
            hi.start(hiStart)
            hi.stop(hiStart + 0.12)

            const lo = c.createOscillator()
            const lg = c.createGain()
            const loStart = hiStart + 0.12
            lo.type = 'square'
            lo.frequency.setValueAtTime(440, loStart)
            lg.gain.setValueAtTime(0.13, loStart)
            lg.gain.setValueAtTime(0.13, loStart + 0.10)
            lg.gain.exponentialRampToValueAtTime(0.001, loStart + 0.12)
            lo.connect(lg)
            lg.connect(c.destination)
            lo.start(loStart)
            lo.stop(loStart + 0.12)
        }

        // Sub-bass rumble underneath for weight
        const sub = c.createOscillator()
        const sg = c.createGain()
        sub.type = 'sine'
        sub.frequency.setValueAtTime(55, t)
        sg.gain.setValueAtTime(0.15, t)
        sg.gain.setValueAtTime(0.15, t + 0.85)
        sg.gain.exponentialRampToValueAtTime(0.001, t + 1.0)
        sub.connect(sg)
        sg.connect(c.destination)
        sub.start(t)
        sub.stop(t + 1.05)
    } catch {}
}

/**
 * Neon tube flickering on — electrical hum + buzz.
 * Amplitude envelope mirrors the CSS neon-flicker-on keyframes.
 */
export function playNeonFlicker(durationMs = 2600) {
    try {
        const c = getCtx()
        const dur = durationMs / 1000
        const t = c.currentTime

        const env = [
            [0, 0], [0.04, 0.07], [0.06, 0],
            [0.10, 0.04], [0.11, 0],
            [0.18, 0],
            [0.22, 0.09], [0.25, 0.01], [0.27, 0.07], [0.29, 0],
            [0.36, 0],
            [0.39, 0.11], [0.41, 0.02], [0.43, 0.09], [0.45, 0.03],
            [0.48, 0.11], [0.56, 0.11], [0.66, 0.11],
            [0.80, 0.12], [1.0, 0.07],
        ]

        const make = (type, freq, mult) => {
            const osc = c.createOscillator()
            const g = c.createGain()
            osc.type = type
            osc.frequency.value = freq
            g.gain.setValueAtTime(0, t)
            env.forEach(([r, v]) =>
                g.gain.linearRampToValueAtTime(v * mult, t + r * dur)
            )
            g.gain.linearRampToValueAtTime(0.015 * mult, t + dur)
            g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.4)
            osc.connect(g)
            g.connect(c.destination)
            osc.start(t)
            osc.stop(t + dur + 0.5)
        }

        make('sawtooth', 60, 0.30)
        make('square', 120, 0.08)

        const res = c.createOscillator()
        const rg = c.createGain()
        res.type = 'sine'
        res.frequency.value = 220
        rg.gain.setValueAtTime(0, t)
        rg.gain.setValueAtTime(0, t + dur * 0.78)
        rg.gain.linearRampToValueAtTime(0.04, t + dur * 0.85)
        rg.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.4)
        res.connect(rg)
        rg.connect(c.destination)
        res.start(t + dur * 0.78)
        res.stop(t + dur + 0.5)
    } catch {}
}
