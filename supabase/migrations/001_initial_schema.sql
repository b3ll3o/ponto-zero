-- Ponto Zero Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('start', 'end')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_timestamp ON time_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_timestamp ON time_entries(user_id, timestamp);

-- Enable Row Level Security
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own entries
CREATE POLICY "Users can view own entries" ON time_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own entries
CREATE POLICY "Users can insert own entries" ON time_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own entries
CREATE POLICY "Users can update own entries" ON time_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own entries
CREATE POLICY "Users can delete own entries" ON time_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Function to calculate daily worked hours
CREATE OR REPLACE FUNCTION calculate_daily_hours(user_uuid UUID, entry_date DATE)
RETURNS INTERVAL AS $$
DECLARE
  total_hours INTERVAL;
BEGIN
  SELECT COALESCE(
    SUM(
      CASE
        WHEN type = 'end' AND EXISTS (
          SELECT 1 FROM time_entries te2
          WHERE te2.user_id = user_uuid
          AND te2.type = 'start'
          AND te2.timestamp <= time_entries.timestamp
          AND te2.timestamp::date = entry_date
          ORDER BY te2.timestamp DESC
          LIMIT 1
        )
        THEN time_entries.timestamp - (
          SELECT te2.timestamp FROM time_entries te2
          WHERE te2.user_id = user_uuid
          AND te2.type = 'start'
          AND te2.timestamp <= time_entries.timestamp
          ORDER BY te2.timestamp DESC
          LIMIT 1
        )
        ELSE NULL
      END
    ),
    '0 hours'::INTERVAL
  ) INTO total_hours
  FROM time_entries
  WHERE user_id = user_uuid
  AND timestamp::date = entry_date
  AND type = 'end';

  RETURN total_hours;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;