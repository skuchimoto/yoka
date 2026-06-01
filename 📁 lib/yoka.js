import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const ZORI_COLORS = [
  { name: 'amber',   hex: '#F4A435', light: '#F9C878' },
  { name: 'violet',  hex: '#7C5CBF', light: '#A98FD8' },
  { name: 'teal',    hex: '#2ABFBF', light: '#72D9D9' },
  { name: 'rose',    hex: '#E05C8A', light: '#F09AB8' },
  { name: 'sage',    hex: '#6BAF92', light: '#9FCFB8' },
  { name: 'coral',   hex: '#E8714A', light: '#F2A488' },
]

export function getColorForPlayer(playerId) {
  const index = Math.abs(hashCode(playerId)) % ZORI_COLORS.length
  return ZORI_COLORS[index]
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

export function getBloomPosition(countryCode) {
  const h = Math.abs(hashCode(countryCode + 'x'))
  const h2 = Math.abs(hashCode(countryCode + 'y'))
  return {
    x: 10 + (h % 80),
    y: 20 + (h2 % 60),
  }
}

export function getOrCreatePlayerId() {
  if (typeof window === 'undefined') return null
  let id = localStorage.getItem('yoka_player_id')
  if (!id) {
    id = 'player_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('yoka_player_id', id)
  }
  return id
}

export function getStreak() {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem('yoka_streak') || '0', 10)
}

export function getLastHowlDate() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('yoka_last_howl_date')
}

export function updateStreak() {
  const today = new Date().toISOString().slice(0, 10)
  const lastDate = getLastHowlDate()
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  let streak = getStreak()
  if (lastDate === today) return streak
  if (lastDate === yesterday) {
    streak += 1
  } else if (lastDate !== today) {
    streak = 1
  }
  localStorage.setItem('yoka_streak', streak.toString())
  localStorage.setItem('yoka_last_howl_date', today)
  return streak
}

export function hasHowledToday() {
  if (typeof window === 'undefined') return false
  const today = new Date().toISOString().slice(0, 10)
  return getLastHowlDate() === today
}

export async function submitHowl({ playerId, country, colorCode, heldDuration }) {
  if (!supabase) {
    // Demo mode — no Supabase configured
    return { data: null, error: null, demo: true }
  }
  const { data, error } = await supabase
    .from('howls')
    .insert([{ player_id: playerId, country, color_code: colorCode, held_duration: heldDuration }])
  return { data, error }
}

export async function fetchRecentHowls(playerId) {
  if (!supabase) {
    // Demo mode — return fake howls
    return {
      data: [
        { id: 'demo1', player_id: 'demo_a', country: 'JP', color_code: '#F4A435', created_at: new Date().toISOString() },
        { id: 'demo2', player_id: 'demo_b', country: 'BR', color_code: '#2ABFBF', created_at: new Date().toISOString() },
        { id: 'demo3', player_id: 'demo_c', country: 'DE', color_code: '#E05C8A', created_at: new Date().toISOString() },
      ],
      error: null
    }
  }
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('howls')
    .select('*')
    .gte('created_at', since)
    .neq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(50)
  return { data, error }
}
