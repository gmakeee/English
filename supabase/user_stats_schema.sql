-- User word statistics for tracking learning progress
-- Run this migration in Supabase SQL Editor

-- Table for tracking per-user, per-word statistics
CREATE TABLE IF NOT EXISTS user_word_stats (
  tg_uid text NOT NULL,
  word_id int NOT NULL,
  correct_count int DEFAULT 0,
  wrong_count int DEFAULT 0,
  last_seen timestamp with time zone DEFAULT NOW(),
  is_learned boolean DEFAULT false,
  PRIMARY KEY (tg_uid, word_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_word_stats_tg_uid ON user_word_stats(tg_uid);
CREATE INDEX IF NOT EXISTS idx_user_word_stats_is_learned ON user_word_stats(tg_uid, is_learned);
CREATE INDEX IF NOT EXISTS idx_user_word_stats_wrong_count ON user_word_stats(tg_uid, wrong_count DESC);

-- RLS policies
ALTER TABLE user_word_stats ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own stats (using anon key for Telegram Mini Apps)
CREATE POLICY "Allow all operations" ON user_word_stats
  FOR ALL
  USING (true)
  WITH CHECK (true);
