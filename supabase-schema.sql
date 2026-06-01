-- Run this in your Supabase project → SQL Editor

-- Create the howls table
CREATE TABLE IF NOT EXISTS howls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  country TEXT DEFAULT 'XX',
  color_code TEXT DEFAULT '#F4A435',
  held_duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast recent howl queries
CREATE INDEX IF NOT EXISTS howls_created_at_idx ON howls(created_at DESC);
CREATE INDEX IF NOT EXISTS howls_player_id_idx ON howls(player_id);

-- Enable Row Level Security
ALTER TABLE howls ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read howls (public feed)
CREATE POLICY "howls are publicly readable" ON howls
  FOR SELECT USING (true);

-- Allow anyone to insert their own howl
CREATE POLICY "anyone can howl" ON howls
  FOR INSERT WITH CHECK (true);

-- Optional: auto-delete howls older than 7 days (keeps DB small)
-- Run as a cron job via Supabase Edge Functions or pg_cron:
-- DELETE FROM howls WHERE created_at < now() - interval '7 days';
