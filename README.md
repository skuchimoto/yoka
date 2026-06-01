# 🐾 YOKA — find your pack

> *One howl. One world. Find who hears you.*

YOKA is a browser-based, zero-install, real-time emotional signal game. Every day, ZORI (your multicolor dog) wakes in a fractured, colorless world. You have one action: **HOWL**. Your howl leaves a color bloom in every other player's world. Theirs appears in yours. The world heals, one bloom at a time.

---

## ✨ Features

- 🐾 **One action per day** — hold to howl, the world responds
- 🌸 **Asynchronous multiplayer** — no lobbies, no chat, just color traces
- 🌍 **Country blooms** — see which countries howled today
- 🔥 **Streak system** — ZORI gets brighter as your streak grows
- 📤 **Share card** — one-tap share for TikTok/Instagram
- 🎨 **Color identity** — each player has a unique color (amber, violet, teal, rose, sage, coral)
- 🌙 **Demo mode** — works without Supabase (shows fake blooms) so you can ship instantly

---

## 🚀 Deploy in 15 Minutes

### Step 1: Clone & install
```bash
git clone https://github.com/yourusername/yoka.git
cd yoka
npm install
```

### Step 2: Set up Supabase (free)
1. Go to [supabase.com](https://supabase.com) → New project
2. Open **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Go to **Settings → API** → copy your Project URL and anon key

### Step 3: Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and anon key
```

### Step 4: Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### Step 5: Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
# Follow prompts — it auto-detects Next.js
# Add environment variables in Vercel dashboard → Settings → Environment Variables
```

---

## 🗂 Project Structure

```
yoka/
├── pages/
│   ├── index.js          # Main game screen
│   ├── _app.js           # Global app wrapper
│   └── _document.js      # HTML head / meta
├── components/
│   ├── Zori.js           # Multicolor dog SVG
│   ├── World.js          # Cracked earth + bloom garden
│   ├── HowlButton.js     # Hold-to-howl interaction
│   ├── BloomNotification.js  # "Someone in Japan heard you"
│   ├── ShareCard.js      # Viral share card
│   └── StatsBar.js       # Country activity bar
├── lib/
│   └── yoka.js           # Supabase client + game logic
├── styles/
│   └── globals.css       # Global styles + animations
├── supabase-schema.sql   # Database setup (run once)
└── .env.local.example    # Environment variable template
```

---

## 🎮 How the Game Works

1. **Open YOKA** — ZORI wakes in a dark, cracked world
2. **Hold the HOWL button** — ZORI tilts his head back, a color wave radiates out
3. **Your howl is stored** with your country code, timestamp, and color
4. **Other players' howls** from the last 24 hours appear as colored blooms on the ground
5. **Miss a day** — ZORI dims. Howl every day — ZORI glows brighter
6. **Share the screen** — the loneliness screenshot is the most viral content the game produces

---

## 🌐 Demo Mode

No Supabase? No problem. The game runs in **demo mode** by default — it shows 3 fake blooms (Japan, Brazil, Germany) so the experience is complete. Just don't set `NEXT_PUBLIC_SUPABASE_URL` and it works automatically.

---

## 📊 Database Schema

```sql
howls (
  id          UUID (primary key)
  player_id   TEXT (anonymous, stored in localStorage)
  country     TEXT (2-letter ISO code, auto-detected)
  color_code  TEXT (hex color for this player)
  held_duration INTEGER (ms the button was held)
  created_at  TIMESTAMPTZ
)
```

Queries:
- **Read**: all howls from last 24h, excluding own player_id
- **Write**: insert one row per howl event
- **Cleanup**: delete rows older than 7 days (keep DB small)

---

## 🎨 Design System

Colors: `#F4A435` amber · `#7C5CBF` violet · `#2ABFBF` teal · `#E05C8A` rose · `#6BAF92` sage · `#E8714A` coral

Typography: Crimson Pro (body, narrative) + Space Mono (UI labels)

Background: near-black `#0e0d0b` with cracked SVG earth lines

---

## 📱 Viral Mechanics

| Moment | Content |
|--------|---------|
| Empty world | ZORI alone in colorless world → screenshot → "nobody howled today" |
| First bloom | "Someone in Japan heard ZORI" → share card → acquisition |
| Streak 7+ | ZORI glows → "he's been waiting" |
| Country leaderboard | "Thailand healed the most world this week" → regional spread |

---

## 🔧 Extending YOKA

**Add AI narrative** (Claude Haiku API ~$0.002/day at 100k users):
```js
// In lib/yoka.js — call Anthropic API with bloom count + countries
const narrative = await generateNarrativeAI(bloomCount, countries)
```

**Add push notifications** (Supabase Edge Functions):
- Trigger at UTC midnight
- "Someone in [country] heard your howl from yesterday"

**Add country leaderboard** (weekly):
- Aggregate howls by country, generate shareable image

---

## 📄 License

MIT — ship it, fork it, howl loudly.

---

*Built with Next.js · Supabase · Vercel · love*
