import { useEffect, useRef } from 'react'

export default function Zori({ howling, streak, worldHealing, saturation }) {
  const zoriRef = useRef(null)

  // Saturation filter based on streak
  const sat = Math.min(100 + (streak * 8), 180)
  const filterStyle = worldHealing
    ? `saturate(${sat}%) brightness(1.1)`
    : `saturate(${Math.max(20, sat - 40)}%) brightness(0.8)`

  return (
    <div
      ref={zoriRef}
      style={{
        filter: filterStyle,
        transition: 'filter 2s ease',
        animation: howling ? 'none' : 'float 4s ease-in-out infinite',
        transformOrigin: 'center bottom',
      }}
    >
      <svg
        viewBox="0 0 200 240"
        width="180"
        height="216"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          transform: howling ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'transform 0.4s ease',
        }}
      >
        {/* Shadow */}
        <ellipse cx="100" cy="228" rx="45" ry="8" fill="rgba(0,0,0,0.3)" />

        {/* Tail */}
        <path
          d="M148 170 Q175 155 168 135 Q162 120 150 128"
          stroke="#5a4a3a"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M148 170 Q175 155 168 135 Q162 120 150 128"
          stroke="#7C5CBF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Body */}
        <ellipse cx="100" cy="175" rx="55" ry="45" fill="#3d3228" />
        {/* Body color patches */}
        <ellipse cx="85" cy="168" rx="22" ry="18" fill="#F4A435" opacity="0.55" />
        <ellipse cx="118" cy="178" rx="18" ry="14" fill="#2ABFBF" opacity="0.45" />
        <ellipse cx="95" cy="188" rx="15" ry="10" fill="#E05C8A" opacity="0.35" />

        {/* Back legs */}
        <rect x="58" y="205" width="14" height="22" rx="7" fill="#3d3228" />
        <rect x="128" y="205" width="14" height="22" rx="7" fill="#3d3228" />
        {/* Paws back */}
        <ellipse cx="65" cy="227" rx="10" ry="5" fill="#2d251e" />
        <ellipse cx="135" cy="227" rx="10" ry="5" fill="#2d251e" />

        {/* Neck */}
        <rect x="86" y="128" width="28" height="32" rx="10" fill="#3d3228" />
        <rect x="90" y="130" width="12" height="20" rx="6" fill="#7C5CBF" opacity="0.5" />

        {/* Head */}
        <ellipse
          cx="100"
          cy={howling ? "108" : "115"}
          rx="36"
          ry="32"
          fill="#3d3228"
          style={{ transition: 'cy 0.4s ease' }}
        />

        {/* Head color patches */}
        <ellipse cx="88" cy={howling ? "104" : "111"} rx="14" ry="12" fill="#F4A435" opacity="0.6" style={{ transition: 'cy 0.4s ease' }} />
        <ellipse cx="114" cy={howling ? "108" : "115"} rx="10" ry="9" fill="#2ABFBF" opacity="0.4" style={{ transition: 'cy 0.4s ease' }} />

        {/* Ears */}
        <path
          d={howling ? "M70 100 Q58 72 72 60 Q80 55 82 72 Z" : "M70 108 Q58 80 72 68 Q80 63 82 80 Z"}
          fill="#2d251e"
          style={{ transition: 'd 0.4s ease' }}
        />
        <path
          d={howling ? "M130 100 Q142 72 128 60 Q120 55 118 72 Z" : "M130 108 Q142 80 128 68 Q120 63 118 80 Z"}
          fill="#2d251e"
          style={{ transition: 'd 0.4s ease' }}
        />
        {/* Ear inner */}
        <path
          d={howling ? "M73 97 Q65 76 75 67 Q80 64 81 75 Z" : "M73 105 Q65 84 75 75 Q80 72 81 83 Z"}
          fill="#E05C8A"
          opacity="0.5"
        />
        <path
          d={howling ? "M127 97 Q135 76 125 67 Q120 64 119 75 Z" : "M127 105 Q135 84 125 75 Q120 72 119 83 Z"}
          fill="#E05C8A"
          opacity="0.5"
        />

        {/* Eyes — closed when howling */}
        {howling ? (
          <>
            <path d="M87 112 Q92 109 97 112" stroke="#c8c2b4" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M103 112 Q108 109 113 112" stroke="#c8c2b4" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="90" cy="113" rx="5" ry="4.5" fill="#1a1410" />
            <ellipse cx="110" cy="113" rx="5" ry="4.5" fill="#1a1410" />
            <ellipse cx="91.5" cy="111.5" rx="1.5" ry="1.5" fill="white" opacity="0.8" />
            <ellipse cx="111.5" cy="111.5" rx="1.5" ry="1.5" fill="white" opacity="0.8" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy={howling ? "121" : "124"} rx="6" ry="4" fill="#1a1410" style={{ transition: 'cy 0.4s ease' }} />
        <ellipse cx="98.5" cy={howling ? "119.5" : "122.5"} rx="1.5" ry="1" fill="white" opacity="0.5" />

        {/* Mouth — open O when howling */}
        {howling ? (
          <ellipse cx="100" cy="131" rx="6" ry="7" fill="#1a1410" />
        ) : (
          <path d="M95 129 Q100 133 105 129" stroke="#1a1410" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Front legs */}
        <rect x="68" y="205" width="14" height="20" rx="7" fill="#3d3228" />
        <rect x="118" y="205" width="14" height="20" rx="7" fill="#3d3228" />
        {/* Paws front */}
        <ellipse cx="75" cy="224" rx="10" ry="5" fill="#2d251e" />
        <ellipse cx="125" cy="224" rx="10" ry="5" fill="#2d251e" />

        {/* Streak glow if streak > 6 */}
        {streak >= 7 && (
          <ellipse cx="100" cy="115" rx="40" ry="36" fill="none" stroke="#F4A435" strokeWidth="1.5" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
          </ellipse>
        )}
      </svg>
    </div>
  )
}
