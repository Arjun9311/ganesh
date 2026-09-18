-- VIGHNAHARTA RUN — Supabase Database Schema

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  city TEXT DEFAULT 'Mumbai',
  latitude NUMERIC,
  longitude NUMERIC,
  avatar TEXT DEFAULT 'saffron',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Game Sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  distance INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  vighnas_destroyed INTEGER NOT NULL DEFAULT 0,
  modaks_collected INTEGER NOT NULL DEFAULT 0,
  powerups_collected INTEGER NOT NULL DEFAULT 0,
  max_combo INTEGER NOT NULL DEFAULT 1,
  weather TEXT DEFAULT 'Sunny',
  environment TEXT DEFAULT 'Festival Street',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

-- 4. Player Stats aggregate table
CREATE TABLE IF NOT EXISTS player_stats (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_score BIGINT DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  total_distance BIGINT DEFAULT 0,
  total_vighnas INTEGER DEFAULT 0,
  total_modaks INTEGER DEFAULT 0,
  best_combo INTEGER DEFAULT 1,
  games_played INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for fast leaderboard lookups
CREATE INDEX IF NOT EXISTS idx_game_sessions_score ON game_sessions (score DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_best_score ON player_stats (best_score DESC);

-- 6. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User write
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Game Sessions: Public read for leaderboards, User write
CREATE POLICY "Game sessions are viewable by everyone" ON game_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own game session" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements: Public read, User insert
CREATE POLICY "Achievements viewable by everyone" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can unlock achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Player Stats: Public read, User upsert
CREATE POLICY "Player stats viewable by everyone" ON player_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can update own player stats" ON player_stats
  FOR ALL USING (auth.uid() = user_id);
