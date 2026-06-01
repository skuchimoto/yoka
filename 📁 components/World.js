export default function World({ blooms, healing }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '55%',
        background: healing
          ? 'linear-gradient(to bottom, #0d1a1f 0%, #0e1510 100%)'
          : 'linear-gradient(to bottom, #080808 0%, #0e0d0b 100%)',
        transition: 'background 3s ease',
      }} />

      {/* Stars */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%' }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        {[
          [30,20],[80,45],[140,15],[200,35],[260,12],[320,40],[370,25],
          [55,80],[110,65],[185,90],[245,70],[310,85],[360,60],
          [20,130],[90,115],[160,140],[230,120],[290,135],[350,110],
        ].map(([x,y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7}
            fill="white"
            opacity="0.15"
            style={{
              animation: `starTwinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          />
        ))}
      </svg>

      {/* Ground */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: healing
          ? 'linear-gradient(to bottom, #131a14 0%, #0c1008 100%)'
          : 'linear-gradient(to bottom, #111008 0%, #0a0908 100%)',
        transition: 'background 3s ease',
      }} />

      {/* Crack lines */}
      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%' }}
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Main crack lines */}
        <path d="M200 0 L185 40 L170 60 L155 90 L140 110 L120 130 L100 160 L80 190 L60 220" stroke="#2a2620" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M200 0 L215 35 L225 55 L240 80 L255 100 L270 125 L290 155 L310 185 L330 220" stroke="#2a2620" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M185 40 L160 50 L130 45 L100 55" stroke="#2a2620" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M215 35 L245 42 L275 38 L305 48" stroke="#2a2620" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M170 60 L150 75 L120 72" stroke="#1e1c18" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M225 55 L248 68 L272 65" stroke="#1e1c18" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M140 110 L118 118 L95 115 L70 122" stroke="#1e1c18" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M255 100 L278 108 L302 105 L328 112" stroke="#1e1c18" strokeWidth="0.6" fill="none" opacity="0.4" />

        {/* Bloom positions */}
        {blooms.map((bloom, i) => (
          <BloomSVG key={bloom.id} bloom={bloom} index={i} />
        ))}
      </svg>

      {/* Horizon line */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '1px',
        background: healing
          ? 'linear-gradient(to right, transparent, rgba(107,175,146,0.15), transparent)'
          : 'linear-gradient(to right, transparent, rgba(42,38,32,0.4), transparent)',
        transition: 'background 3s ease',
      }} />
    </div>
  )
}

function BloomSVG({ bloom, index }) {
  const x = 30 + (Math.abs(hashStr(bloom.country + 'x')) % 340)
  const y = 20 + (Math.abs(hashStr(bloom.country + 'y')) % 160)
  const color = bloom.color_code || '#F4A435'
  const size = 6 + (Math.abs(hashStr(bloom.id)) % 6)

  return (
    <g
      style={{
        animation: `bloomAppear 0.8s ease forwards`,
        animationDelay: `${index * 0.15}s`,
        opacity: 0,
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      {/* Stem */}
      <line x1={x} y1={y + size} x2={x} y2={y + size + 10} stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Petals */}
      {[0, 72, 144, 216, 288].map((angle, pi) => {
        const rad = (angle * Math.PI) / 180
        const px = x + Math.cos(rad) * size * 0.8
        const py = y + Math.sin(rad) * size * 0.8
        return (
          <ellipse
            key={pi}
            cx={px} cy={py}
            rx={size * 0.45} ry={size * 0.28}
            fill={color}
            opacity="0.75"
            transform={`rotate(${angle}, ${px}, ${py})`}
          />
        )
      })}
      {/* Center */}
      <circle cx={x} cy={y} r={size * 0.3} fill={color} opacity="0.9" />
      {/* Glow */}
      <circle cx={x} cy={y} r={size * 1.5} fill={color} opacity="0.06" />
    </g>
  )
}

function hashStr(str) {
  if (!str) return 42
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return h
}
