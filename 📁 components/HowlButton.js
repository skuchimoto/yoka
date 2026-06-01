import { useState, useRef, useCallback } from 'react'

export default function HowlButton({ onHowl, disabled, playerColor, alreadyHowledToday }) {
  const [pressing, setPressing] = useState(false)
  const [waves, setWaves] = useState([])
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef(null)
  const progressRef = useRef(null)
  const waveTimerRef = useRef(null)

  const startHowl = useCallback(() => {
    if (disabled) return
    setPressing(true)
    startTimeRef.current = Date.now()

    // Progress fill
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(elapsed / 2000, 1)
      setProgress(p)
    }, 16)

    // Wave pulses
    waveTimerRef.current = setInterval(() => {
      setWaves(w => [...w.slice(-4), { id: Date.now() }])
    }, 400)
  }, [disabled])

  const endHowl = useCallback(() => {
    if (!pressing) return
    const heldDuration = Date.now() - startTimeRef.current
    clearInterval(progressRef.current)
    clearInterval(waveTimerRef.current)
    setPressing(false)
    setProgress(0)
    setWaves([])

    if (heldDuration > 300) {
      onHowl(heldDuration)
    }
  }, [pressing, onHowl])

  const color = playerColor?.hex || '#F4A435'
  const colorLight = playerColor?.light || '#F9C878'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* Wave rings */}
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {waves.map(w => (
          <div key={w.id} style={{
            position: 'absolute',
            borderRadius: '50%',
            border: `1.5px solid ${color}`,
            width: '60px',
            height: '60px',
            animation: 'ripple 1.2s ease-out forwards',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Progress ring */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          width="160" height="160" viewBox="0 0 160 160"
        >
          <circle
            cx="80" cy="80" r="68"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.15"
          />
          <circle
            cx="80" cy="80" r="68"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity={pressing ? "0.6" : "0"}
            strokeDasharray={`${2 * Math.PI * 68}`}
            strokeDashoffset={`${2 * Math.PI * 68 * (1 - progress)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-opacity 0.2s' }}
          />
        </svg>

        {/* Main button */}
        <button
          onMouseDown={startHowl}
          onMouseUp={endHowl}
          onMouseLeave={endHowl}
          onTouchStart={e => { e.preventDefault(); startHowl() }}
          onTouchEnd={endHowl}
          disabled={disabled}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            background: pressing
              ? `radial-gradient(circle at center, ${color}33 0%, ${color}11 70%)`
              : `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'all 0.2s ease',
            transform: pressing ? 'scale(0.95)' : 'scale(1)',
            boxShadow: pressing
              ? `0 0 30px ${color}40, 0 0 60px ${color}20`
              : `0 0 15px ${color}15`,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          }}
          aria-label="Howl"
        >
          <span style={{
            fontSize: '26px',
            filter: disabled ? 'grayscale(100%) opacity(0.3)' : 'none',
          }}>
            {alreadyHowledToday ? '🌸' : '🐾'}
          </span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.15em',
            color: disabled ? 'var(--text-dim)' : color,
            textTransform: 'uppercase',
          }}>
            {alreadyHowledToday ? 'done' : pressing ? 'howling' : 'howl'}
          </span>
        </button>
      </div>

      {/* Hold instruction */}
      {!alreadyHowledToday && (
        <p style={{
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: '13px',
          color: 'var(--text-dim)',
          letterSpacing: '0.05em',
          fontStyle: 'italic',
        }}>
          {pressing ? 'keep going...' : 'hold to howl'}
        </p>
      )}
    </div>
  )
}
