import { getFlag } from './BloomNotification'

export default function StatsBar({ blooms, playerColor }) {
  if (!blooms || blooms.length === 0) return null

  const color = playerColor?.hex || '#F4A435'

  // Count by country
  const countryCounts = {}
  blooms.forEach(b => {
    if (b.country) {
      countryCounts[b.country] = (countryCounts[b.country] || 0) + 1
    }
  })
  const sorted = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      {sorted.map(([country, count]) => (
        <div key={country} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: `${color}0D`,
          border: `1px solid ${color}20`,
          borderRadius: '20px',
          padding: '3px 10px',
        }}>
          <span style={{ fontSize: '13px' }}>{getFlag(country)}</span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            color: color,
            opacity: 0.7,
          }}>{count}</span>
        </div>
      ))}
    </div>
  )
}
