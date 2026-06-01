import { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import Zori from '../components/Zori'
import World from '../components/World'
import HowlButton from '../components/HowlButton'
import BloomNotification from '../components/BloomNotification'
import ShareCard from '../components/ShareCard'
import StatsBar from '../components/StatsBar'
import {
  getOrCreatePlayerId,
  getColorForPlayer,
  getStreak,
  updateStreak,
  hasHowledToday,
  submitHowl,
  fetchRecentHowls,
  ZORI_COLORS,
} from '../lib/yoka'

// Country detection via free API
async function detectCountry() {
  try {
    const res = await fetch('https://ipapi.co/country/')
    const country = await res.text()
    return country?.trim()?.slice(0, 2)?.toUpperCase() || 'XX'
  } catch {
    return 'XX'
  }
}

export default function Home() {
  const [phase, setPhase] = useState('idle') // idle | howling | blooming | shared
  const [blooms, setBlooms] = useState([])
  const [howling, setHowling] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showShare, setShowShare] = useState(false)
  const [worldNarrative, setWorldNarrative] = useState('')
  const [playerId, setPlayerId] = useState(null)
  const [playerColor, setPlayerColor] = useState(null)
  const [streak, setStreak] = useState(0)
  const [alreadyHowledToday, setAlreadyHowledToday] = useState(false)
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState('XX')
  const notificationQueue = useRef([])

  const bloomCount = blooms.length
  const worldHealing = bloomCount > 0

  useEffect(() => {
    const init = async () => {
      const id = getOrCreatePlayerId()
      const color = getColorForPlayer(id)
      const currentStreak = getStreak()
      const howledToday = hasHowledToday()
      setPlayerId(id)
      setPlayerColor(color)
      setStreak(currentStreak)
      setAlreadyHowledToday(howledToday)

      // Detect country
      const c = await detectCountry()
      setCountry(c)

      // Fetch blooms
      const { data } = await fetchRecentHowls(id)
      if (data) setBlooms(data)

      // Generate narrative
      generateNarrative(data?.length || 0)

      setLoading(false)
    }
    init()
  }, [])

  const generateNarrative = (count) => {
    const narratives = {
      0: ["The world waits in silence.", "No one has howled yet. ZORI sits alone.", "The cracks run deep today."],
      low: ["A few voices crossed the dark.", "The blooms are small but real.", "Someone heard the call."],
      mid: ["The world is remembering color.", "Voices from across the earth, reaching.", "The cracks are beginning to close."],
      high: ["The world heals tonight.", "Hundreds of dogs called out. The blooms are everywhere.", "ZORI is not alone. Neither are you."],
    }
    const key = count === 0 ? 0 : count < 5 ? 'low' : count < 20 ? 'mid' : 'high'
    const arr = narratives[key]
    setWorldNarrative(arr[Math.floor(Math.random() * arr.length)])
  }

  const handleHowl = useCallback(async (heldDuration) => {
    if (!playerId || alreadyHowledToday) return

    setHowling(true)
    setTimeout(() => setHowling(false), 1500)

    // Update streak
    const newStreak = updateStreak()
    setStreak(newStreak)
    setAlreadyHowledToday(true)

    // Submit
    const colorHex = playerColor?.hex || '#F4A435'
    await submitHowl({
      playerId,
      country,
      colorCode: colorHex,
      heldDuration,
    })

    // Re-fetch to show new blooms
    setTimeout(async () => {
      const { data } = await fetchRecentHowls(playerId)
      if (data && data.length > 0) {
        setBlooms(data)
        generateNarrative(data.length)

        // Show notification for first bloom
        const firstNew = data[0]
        if (firstNew && firstNew.country) {
          setNotification(firstNew)
        }
      }
      setShowShare(true)
    }, 1800)
  }, [playerId, alreadyHowledToday, playerColor, country])

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0e0d0b',
      }}>
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: '14px',
          color: '#3a3530',
          letterSpacing: '0.15em',
          fontStyle: 'italic',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          waking zori...
        </p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>YOKA — find your pack</title>
        <meta name="description" content="One howl. One world. Find who hears you." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:title" content="YOKA" />
        <meta property="og:description" content="One howl. One world. Find who hears you." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>" />
      </Head>

      {/* Notification */}
      {notification && (
        <BloomNotification
          bloom={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main layout */}
      <div style={{
        height: '100dvh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* World background */}
        <World blooms={blooms} healing={worldHealing} />

        {/* Content layer */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
          maxWidth: '400px',
          padding: '0 20px',
          paddingTop: 'env(safe-area-inset-top, 20px)',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        }}>

          {/* Top: Logo + stats */}
          <div style={{
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.25em',
                color: playerColor?.hex || '#F4A435',
                opacity: 0.6,
                textTransform: 'uppercase',
              }}>
                yoka
              </span>
              {streak > 0 && (
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px',
                  color: playerColor?.hex || '#F4A435',
                  opacity: 0.5,
                }}>
                  {streak}d streak
                </span>
              )}
            </div>

            {/* Bloom count */}
            <p style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--text-dim)',
              textAlign: 'center',
              animation: 'fadeIn 1s ease forwards',
            }}>
              {bloomCount > 0
                ? `${bloomCount} soul${bloomCount !== 1 ? 's' : ''} howled in the last 24h`
                : 'no one has howled yet today'}
            </p>

            <StatsBar blooms={blooms} playerColor={playerColor} />
          </div>

          {/* Middle: ZORI */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
          }}>
            <Zori
              howling={howling}
              streak={streak}
              worldHealing={worldHealing}
            />

            {/* Narrative */}
            <p style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: '15px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text-dim)',
              textAlign: 'center',
              marginTop: '12px',
              maxWidth: '240px',
              lineHeight: 1.5,
              animation: 'fadeIn 0.8s ease forwards',
            }}>
              {worldNarrative}
            </p>
          </div>

          {/* Bottom: Howl button + share */}
          <div style={{
            paddingBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
          }}>
            {showShare && (
              <div style={{ animation: 'fadeIn 0.6s ease forwards' }}>
                <ShareCard
                  bloomCount={bloomCount}
                  blooms={blooms}
                  playerColor={playerColor}
                  streak={streak}
                />
              </div>
            )}

            <HowlButton
              onHowl={handleHowl}
              disabled={false}
              playerColor={playerColor}
              alreadyHowledToday={alreadyHowledToday}
            />

            {alreadyHowledToday && !showShare && (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease forwards' }}>
                <p style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--text-dim)',
                }}>
                  zori heard you. come back tomorrow.
                </p>
                <button
                  onClick={() => setShowShare(true)}
                  style={{
                    marginTop: '8px',
                    background: 'none',
                    border: 'none',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: playerColor?.hex || '#F4A435',
                    opacity: 0.5,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textTransform: 'uppercase',
                  }}
                >
                  share
                </button>
              </div>
            )}

            {/* Color identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.35 }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: playerColor?.hex || '#F4A435',
              }} />
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.1em',
                color: 'var(--text-dim)',
              }}>
                your color is {playerColor?.name || 'amber'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
