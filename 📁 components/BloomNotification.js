import { useEffect, useState } from 'react'

const FLAG_EMOJIS = {
  JP: '🇯🇵', US: '🇺🇸', BR: '🇧🇷', DE: '🇩🇪', GB: '🇬🇧',
  FR: '🇫🇷', IN: '🇮🇳', CN: '🇨🇳', KR: '🇰🇷', TH: '🇹🇭',
  AU: '🇦🇺', CA: '🇨🇦', MX: '🇲🇽', AR: '🇦🇷', ZA: '🇿🇦',
  NG: '🇳🇬', EG: '🇪🇬', RU: '🇷🇺', UA: '🇺🇦', PL: '🇵🇱',
  NL: '🇳🇱', ES: '🇪🇸', IT: '🇮🇹', PT: '🇵🇹', SE: '🇸🇪',
  NO: '🇳🇴', FI: '🇫🇮', DK: '🇩🇰', TR: '🇹🇷', ID: '🇮🇩',
  PH: '🇵🇭', MY: '🇲🇾', VN: '🇻🇳', PK: '🇵🇰', BD: '🇧🇩',
}

export function getFlag(countryCode) {
  return FLAG_EMOJIS[countryCode] || '🌍'
}

export default function BloomNotification({ bloom, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 500)
    }, 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onClose])

  const flag = getFlag(bloom.country)
  const color = bloom.color_code || '#F4A435'

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '-120%'})`,
      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 100,
      background: 'rgba(20, 18, 14, 0.95)',
      border: `1px solid ${color}40`,
      borderRadius: '12px',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 4px 30px ${color}20`,
      maxWidth: '300px',
      width: '90vw',
    }}>
      <span style={{ fontSize: '20px' }}>{flag}</span>
      <div>
        <p style={{
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: '14px',
          color: '#c8c2b4',
          lineHeight: 1.4,
        }}>
          Someone in <strong style={{ color }}>{bloom.country || 'the world'}</strong> just heard your howl
        </p>
      </div>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    </div>
  )
}
