-- ============================================================
-- OutQuest Supabase Setup
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar_preset TEXT DEFAULT '🧙‍♂️',
  xp BIGINT DEFAULT 0,
  level BIGINT DEFAULT 1,
  title TEXT DEFAULT 'Novice',
  completed_quest_count BIGINT DEFAULT 0,
  mythic_quest_count BIGINT DEFAULT 0,
  is_tester BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- 2. Quest completions table
CREATE TABLE IF NOT EXISTS quest_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  quest_id TEXT NOT NULL,
  quest_title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  xp_earned BIGINT NOT NULL,
  proof_types TEXT[] DEFAULT '{}',
  report_preview TEXT DEFAULT '',
  report_full TEXT,
  photo_url TEXT,
  created_at BIGINT NOT NULL
);

-- 3. Index for fast user lookups on leaderboard
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp DESC);

-- 4. Index for fast completion lookups
CREATE INDEX IF NOT EXISTS idx_completions_user_id ON quest_completions(user_id);

-- 5. Disable RLS completely for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE quest_completions DISABLE ROW LEVEL SECURITY;

-- 6. Also drop any existing policies just in case
DROP POLICY IF EXISTS "Allow all" ON users;
DROP POLICY IF EXISTS "Allow all" ON quest_completions;

