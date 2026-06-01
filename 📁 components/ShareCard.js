import { useRef } from 'react'
import { getFlag } from './BloomNotification'

export default function ShareCard({ bloomCount, blooms, playerColor, streak }) {
  const countries = [...new Set(blooms.map(b => b.country).filter(Boolean))].slice(0, 6)
  const color = playerColor?.hex || '#F4A435'

  const copyAndShare = () => {
    const countries_text = countries.length > 0
      ? `Someone in ${countries.join(', ')} heard ZORI.`
      : 'The world is still waiting.'
    const text = `🐾 ${bloomCount} dog${bloomCount !== 1 ? 's' : ''} howled today. ${countries_text} Play YOKA — find your pack. yoka.vercel.app`

    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Caption copied! Paste it with your screenshot.')
    }
  }

  return (
    <div style={{
      background: 'rgba(15, 13, 10, 0.95)',
      border: `1px solid ${color}30`,
      borderRadius: '16px',
      padding: '20px',
      maxWidth: '280px',
      width: '100%',
      backdropFilter: 'blur(10px)',
    }}>
      {/* Card preview */}
      <div style={{
        background: 'linear-gradient(135deg, #0e0d0b 0%, #131210 100%)',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '14px',
        border: `1px solid ${color}20`,
      }}>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: color,
          opacity: 0.7,
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}>yoka</p>

        <p style={{
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: '22px',
          fontWeight: 300,
          color: '#c8c2b4',
          lineHeight: 1.2,
          marginBottom: '10px',
        }}>
          {bloomCount > 0 ? (
            <>{bloomCount} souls<br />howled today</>
          ) : (
            <>nobody howled.<br />the world is dark.</>
          )}
        </p>

        {countries.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {countries.map(c => (
              <span key={c} style={{ fontSize: '16px' }}>{getFlag(c)}</span>
            ))}
          </div>
        )}

        {streak > 0 && (
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            color: color,
            marginTop: '8px',
            opacity: 0.6,
          }}>
            {streak} day streak 🔥
          </p>
        )}
      </div>

      <button
        onClick={copyAndShare}
        style={{
          width: '100%',
          padding: '10px',
          background: `${color}18`,
          border: `1px solid ${color}40`,
          borderRadius: '8px',
          color: color,
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        share yoka
      </button>
    </div>
  )
}
