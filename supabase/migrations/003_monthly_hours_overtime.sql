-- Migration 003: Monthly hours summary, overtime tracking, and paginated entries
-- Run this in Supabase SQL Editor after 001_initial_schema.sql

-- ============================================================
-- FUNCTION: get_monthly_hours(user_uuid, year, month)
-- Returns total hours worked in a given month, plus overtime
-- ============================================================
CREATE OR REPLACE FUNCTION get_monthly_hours(user_uuid UUID, year INT, month INT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_interval INTERVAL;
  total_minutes INT;
  work_days INT;
  standard_minutes INT;  -- 8h * 60 = 480 per day worked
  overtime_minutes INT;
BEGIN
  -- Count distinct work days (days with at least one start+end pair)
  SELECT COUNT(DISTINCT DATE(timestamp)) INTO work_days
  FROM time_entries
  WHERE user_id = user_uuid
    AND type = 'start'
    AND EXTRACT(YEAR FROM timestamp) = year
    AND EXTRACT(MONTH FROM timestamp) = month;

  -- Calculate total hours from end-start pairs in the month
  WITH pairs AS (
    SELECT
      te_start.timestamp AS start_ts,
      (
        SELECT te_end.timestamp
        FROM time_entries te_end
        WHERE te_end.user_id = user_uuid
          AND te_end.type = 'end'
          AND te_end.timestamp > te_start.timestamp
          AND EXTRACT(YEAR FROM te_end.timestamp) = year
          AND EXTRACT(MONTH FROM te_end.timestamp) = month
        ORDER BY te_end.timestamp ASC
        LIMIT 1
      ) AS end_ts
    FROM time_entries te_start
    WHERE te_start.user_id = user_uuid
      AND te_start.type = 'start'
      AND EXTRACT(YEAR FROM te_start.timestamp) = year
      AND EXTRACT(MONTH FROM te_start.timestamp) = month
  )
  SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (end_ts - start_ts)) / 3600), 0)::INT INTO total_minutes
  FROM pairs
  WHERE end_ts IS NOT NULL;

  standard_minutes := work_days * 480;  -- 8h per day
  overtime_minutes := GREATEST(0, total_minutes - standard_minutes);

  result := jsonb_build_object(
    'total_minutes', total_minutes,
    'total_hours', ROUND((total_minutes / 60.0)::NUMERIC, 2),
    'work_days', work_days,
    'standard_minutes', standard_minutes,
    'overtime_minutes', overtime_minutes,
    'overtime_hours', ROUND((overtime_minutes / 60.0)::NUMERIC, 2),
    'year', year,
    'month', month
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_daily_hours(user_uuid, target_date)
-- Returns hours worked in a specific day, plus overtime flag
-- ============================================================
CREATE OR REPLACE FUNCTION get_daily_hours(user_uuid UUID, target_date DATE)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_minutes INT;
  overtime_minutes INT;
BEGIN
  WITH pairs AS (
    SELECT
      te_start.timestamp AS start_ts,
      (
        SELECT te_end.timestamp
        FROM time_entries te_end
        WHERE te_end.user_id = user_uuid
          AND te_end.type = 'end'
          AND te_end.timestamp > te_start.timestamp
          AND DATE(te_end.timestamp) = target_date
        ORDER BY te_end.timestamp ASC
        LIMIT 1
      ) AS end_ts
    FROM time_entries te_start
    WHERE te_start.user_id = user_uuid
      AND te_start.type = 'start'
      AND DATE(te_start.timestamp) = target_date
  )
  SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (end_ts - start_ts)) / 3600)::INT, 0) INTO total_minutes
  FROM pairs
  WHERE end_ts IS NOT NULL;

  overtime_minutes := GREATEST(0, total_minutes - 480);  -- >8h is overtime

  result := jsonb_build_object(
    'date', target_date,
    'total_minutes', total_minutes,
    'total_hours', ROUND((total_minutes / 60.0)::NUMERIC, 2),
    'overtime_minutes', overtime_minutes,
    'overtime_hours', ROUND((overtime_minutes / 60.0)::NUMERIC, 2),
    'is_overtime', total_minutes > 480,
    'is_undertime', total_minutes < 480 AND total_minutes > 0,
    'is_complete', total_minutes >= 480
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_weekly_hours(user_uuid, week_start_date)
-- Returns hours for a ISO week, plus overtime (>44h = overtime)
-- ============================================================
CREATE OR REPLACE FUNCTION get_weekly_hours(user_uuid UUID, week_start_date DATE)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_minutes INT;
  week_end DATE;
  overtime_minutes INT;
BEGIN
  week_end := week_start_date + INTERVAL '6 days';

  WITH pairs AS (
    SELECT
      te_start.timestamp AS start_ts,
      (
        SELECT te_end.timestamp
        FROM time_entries te_end
        WHERE te_end.user_id = user_uuid
          AND te_end.type = 'end'
          AND te_end.timestamp > te_start.timestamp
          AND DATE(te_end.timestamp) BETWEEN week_start_date AND week_end
        ORDER BY te_end.timestamp ASC
        LIMIT 1
      ) AS end_ts
    FROM time_entries te_start
    WHERE te_start.user_id = user_uuid
      AND te_start.type = 'start'
      AND DATE(te_start.timestamp) BETWEEN week_start_date AND week_end
  )
  SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (end_ts - start_ts)) / 3600)::INT, 0) INTO total_minutes
  FROM pairs
  WHERE end_ts IS NOT NULL;

  overtime_minutes := GREATEST(0, total_minutes - 2640);  -- 44h = 2640min

  result := jsonb_build_object(
    'week_start', week_start_date,
    'week_end', week_end,
    'total_minutes', total_minutes,
    'total_hours', ROUND((total_minutes / 60.0)::NUMERIC, 2),
    'overtime_minutes', overtime_minutes,
    'overtime_hours', ROUND((overtime_minutes / 60.0)::NUMERIC, 2),
    'is_overtime', total_minutes > 2640
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_time_entries_paginated(user_uuid, page, page_size, month, year)
-- Returns paginated time entries, optionally filtered by month/year
-- ============================================================
CREATE OR REPLACE FUNCTION get_time_entries_paginated(
  user_uuid UUID,
  page INT DEFAULT 1,
  page_size INT DEFAULT 20,
  filter_year INT DEFAULT NULL,
  filter_month INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  offset_val INT;
  total_count INT;
  total_pages INT;
  entries JSONB;
  result JSONB;
BEGIN
  offset_val := (page - 1) * page_size;

  -- Count total
  IF filter_year IS NOT NULL AND filter_month IS NOT NULL THEN
    SELECT COUNT(*) INTO total_count
    FROM time_entries
    WHERE user_id = user_uuid
      AND EXTRACT(YEAR FROM timestamp) = filter_year
      AND EXTRACT(MONTH FROM timestamp) = filter_month;
  ELSE
    SELECT COUNT(*) INTO total_count
    FROM time_entries
    WHERE user_id = user_uuid;
  END IF;

  total_pages := CEIL(total_count::NUMERIC / page_size);

  -- Fetch entries
  IF filter_year IS NOT NULL AND filter_month IS NOT NULL THEN
    SELECT jsonb_agg(row ORDER BY row.timestamp DESC)
    INTO entries
    FROM (
      SELECT id, type, timestamp, notes, created_at
      FROM time_entries
      WHERE user_id = user_uuid
        AND EXTRACT(YEAR FROM timestamp) = filter_year
        AND EXTRACT(MONTH FROM timestamp) = filter_month
      ORDER BY timestamp DESC
      LIMIT page_size
      OFFSET offset_val
    ) AS row;
  ELSE
    SELECT jsonb_agg(row ORDER BY row.timestamp DESC)
    INTO entries
    FROM (
      SELECT id, type, timestamp, notes, created_at
      FROM time_entries
      WHERE user_id = user_uuid
      ORDER BY timestamp DESC
      LIMIT page_size
      OFFSET offset_val
    ) AS row;
  END IF;

  result := jsonb_build_object(
    'entries', COALESCE(entries, '[]'::JSONB),
    'pagination', jsonb_build_object(
      'page', page,
      'page_size', page_size,
      'total_count', total_count,
      'total_pages', total_pages,
      'has_next', page < total_pages,
      'has_prev', page > 1
    )
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_month_calendar(user_uuid, year, month)
-- Returns daily breakdown for every day of the month
-- ============================================================
CREATE OR REPLACE FUNCTION get_month_calendar(user_uuid UUID, year INT, month INT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  day_record JSONB;
  day_count INT;
  current_day DATE;
  last_day DATE;
BEGIN
  result := '[]'::JSONB;
  current_day := make_date(year, month, 1);
  last_day := (make_date(year, month, 1) + INTERVAL '1 month - 1 day')::DATE;

  WHILE current_day <= last_day LOOP
    SELECT jsonb_build_object(
      'date', current_day,
      'day_of_week', EXTRACT(DOW FROM current_day),
      'is_weekend', EXTRACT(DOW FROM current_day) IN (0, 6),
      'hours', (get_daily_hours(user_uuid, current_day))
    ) INTO day_record;

    result := result || jsonb_build_array(day_record);
    current_day := current_day + 1;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_monthly_hours TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_daily_hours TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_hours TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_time_entries_paginated TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_month_calendar TO anon, authenticated;
