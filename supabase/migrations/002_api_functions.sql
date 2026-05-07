-- Migration 002: API Functions for Reports
-- Monthly hours, overtime tracking, weekly breakdown, paginated entries

-- ============================================================
-- FUNCTION: get_monthly_hours
-- Returns total worked hours for a user in a given month
-- ============================================================
CREATE OR REPLACE FUNCTION get_monthly_hours(
  user_uuid UUID,
  target_year INTEGER,
  target_month INTEGER
)
RETURNS TABLE (
  total_hours INTERVAL,
  total_minutes INTEGER,
  regular_hours INTERVAL,
  overtime_hours INTERVAL,
  work_days INTEGER
) AS $$
DECLARE
  v_total INTERVAL := '0 hours';
  v_regular INTERVAL := '0 hours';
  v_overtime INTERVAL := '0 hours';
  v_work_days INTEGER := 0;
  v_daily_hours INTERVAL;
  v_date DATE;
BEGIN
  -- Iterate through each day of the month
  FOR v_date IN
    SELECT generate_series(
      make_date(target_year, target_month, 1),
      make_date(target_year, target_month, 1) + INTERVAL '1 month' - INTERVAL '1 day',
      INTERVAL '1 day'
    )::DATE
  LOOP
    -- Calculate hours for this day
    SELECT calculate_daily_hours(user_uuid, v_date) INTO v_daily_hours;
    
    IF v_daily_hours > INTERVAL '0 hours' THEN
      v_work_days := v_work_days + 1;
      v_total := v_total + v_daily_hours;
      
      -- Daily overtime: more than 8 hours
      IF v_daily_hours > INTERVAL '8 hours' THEN
        v_overtime := v_overtime + (v_daily_hours - INTERVAL '8 hours');
        v_regular := v_regular + INTERVAL '8 hours';
      ELSE
        v_regular := v_regular + v_daily_hours;
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_total, EXTRACT(EPOCH FROM v_total)::INTEGER / 60, v_regular, v_overtime, v_work_days;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_weekly_hours
-- Returns hours breakdown by day for a given week (ISO week)
-- ============================================================
CREATE OR REPLACE FUNCTION get_weekly_hours(
  user_uuid UUID,
  target_year INTEGER,
  target_week INTEGER
)
RETURNS TABLE (
  day_of_week INTEGER,
  day_name TEXT,
  date DATE,
  hours_worked INTERVAL,
  minutes_worked INTEGER,
  is_overtime BOOLEAN,
  overtime_minutes INTEGER
) AS $$
DECLARE
  v_week_start DATE;
  v_day_date DATE;
  v_daily_hours INTERVAL;
  v_day_of_week INTEGER;
BEGIN
  -- Get the Monday of the target ISO week
  v_week_start := DATE_TRUNC('week', to_date(target_year || '-' || target_week, 'IYYY-IW'))::DATE;

  FOR v_day_of_week IN 0..6 LOOP
    v_day_date := v_week_start + v_day_of_week;
    
    SELECT calculate_daily_hours(user_uuid, v_day_date) INTO v_daily_hours;

    RETURN QUERY SELECT
      v_day_of_week + 1,
      CASE v_day_of_week
        WHEN 0 THEN 'Segunda'
        WHEN 1 THEN 'Terça'
        WHEN 2 THEN 'Quarta'
        WHEN 3 THEN 'Quinta'
        WHEN 4 THEN 'Sexta'
        WHEN 5 THEN 'Sábado'
        WHEN 6 THEN 'Domingo'
      END,
      v_day_date,
      COALESCE(v_daily_hours, '0 hours'::INTERVAL),
      COALESCE(EXTRACT(EPOCH FROM v_daily_hours)::INTEGER / 60, 0),
      v_daily_hours > INTERVAL '8 hours',
      GREATEST(0, EXTRACT(EPOCH FROM v_daily_hours - INTERVAL '8 hours')::INTEGER / 60);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_weekly_overtime
-- Returns weekly overtime summary (>44h/week threshold)
-- ============================================================
CREATE OR REPLACE FUNCTION get_weekly_overtime(
  user_uuid UUID,
  target_year INTEGER,
  target_week INTEGER
)
RETURNS TABLE (
  week_number INTEGER,
  year INTEGER,
  total_hours INTERVAL,
  total_minutes INTEGER,
  regular_hours INTERVAL,
  overtime_hours INTERVAL,
  overtime_threshold_hours INTEGER DEFAULT 44
) AS $$
DECLARE
  v_week_start DATE;
  v_total INTERVAL := '0 hours';
  v_regular INTERVAL := '0 hours';
  v_overtime INTERVAL := '0 hours';
  v_day_date DATE;
  v_daily_hours INTERVAL;
  v_day_of_week INTEGER;
BEGIN
  v_week_start := DATE_TRUNC('week', to_date(target_year || '-' || target_week, 'IYYY-IW'))::DATE;

  FOR v_day_of_week IN 0..6 LOOP
    v_day_date := v_week_start + v_day_of_week;
    SELECT calculate_daily_hours(user_uuid, v_day_date) INTO v_daily_hours;
    
    IF v_daily_hours > INTERVAL '0 hours' THEN
      v_total := v_total + v_daily_hours;
    END IF;
  END LOOP;

  -- Weekly overtime: more than 44 hours
  IF v_total > INTERVAL '44 hours' THEN
    v_overtime := v_total - INTERVAL '44 hours';
    v_regular := INTERVAL '44 hours';
  ELSE
    v_regular := v_total;
  END IF;

  RETURN QUERY SELECT
    target_week,
    target_year,
    v_total,
    EXTRACT(EPOCH FROM v_total)::INTEGER / 60,
    v_regular,
    v_overtime,
    44;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_monthly_overtime_summary
-- Returns monthly overtime summary aggregating daily and weekly OT
-- ============================================================
CREATE OR REPLACE FUNCTION get_monthly_overtime_summary(
  user_uuid UUID,
  target_year INTEGER,
  target_month INTEGER
)
RETURNS TABLE (
  total_overtime_hours INTERVAL,
  total_overtime_minutes INTEGER,
  daily_overtime_minutes INTEGER,
  weekly_overtime_minutes INTEGER,
  days_with_overtime INTEGER,
  weeks_with_weekly_overtime INTEGER
) AS $$
DECLARE
  v_overtime INTERVAL := '0 hours';
  v_daily_hours INTERVAL;
  v_date DATE;
  v_week_hours INTERVAL;
  v_week_overtime INTERVAL;
  v_prev_week INTEGER := -1;
  v_current_week INTEGER;
  v_days_with_ot INTEGER := 0;
  v_weeks_with_ot INTEGER := 0;
BEGIN
  FOR v_date IN
    SELECT generate_series(
      make_date(target_year, target_month, 1),
      make_date(target_year, target_month, 1) + INTERVAL '1 month' - INTERVAL '1 day',
      INTERVAL '1 day'
    )::DATE
  LOOP
    SELECT calculate_daily_hours(user_uuid, v_date) INTO v_daily_hours;
    
    -- Daily overtime (>8h)
    IF v_daily_hours > INTERVAL '8 hours' THEN
      v_overtime := v_overtime + (v_daily_hours - INTERVAL '8 hours');
      v_days_with_ot := v_days_with_ot + 1;
    END IF;

    -- Track weekly overtime (>44h)
    v_current_week := EXTRACT(ISOWEEK FROM v_date)::INTEGER;
    IF v_current_week <> v_prev_week THEN
      IF v_prev_week <> -1 THEN
        -- Check previous week's total
        SELECT * INTO v_week_overtime FROM get_weekly_overtime(user_uuid, target_year, v_prev_week);
        IF v_week_overtime.overtime_hours > INTERVAL '0 hours' THEN
          v_weeks_with_ot := v_weeks_with_ot + 1;
        END IF;
      END IF;
      v_prev_week := v_current_week;
    END IF;
  END LOOP;

  -- Check last week
  SELECT * INTO v_week_overtime FROM get_weekly_overtime(user_uuid, target_year, v_prev_week);
  IF v_week_overtime.overtime_hours > INTERVAL '0 hours' THEN
    v_weeks_with_ot := v_weeks_with_ot + 1;
  END IF;

  RETURN QUERY SELECT
    v_overtime,
    EXTRACT(EPOCH FROM v_overtime)::INTEGER / 60,
    0, -- daily overtime minutes (computed from interval above)
    0, -- weekly overtime minutes
    v_days_with_ot,
    v_weeks_with_ot;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: list_time_entries_paginated
-- Returns paginated time entries for a user
-- ============================================================
CREATE OR REPLACE FUNCTION list_time_entries_paginated(
  user_uuid UUID,
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20,
  filter_year INTEGER DEFAULT NULL,
  filter_month INTEGER DEFAULT NULL,
  filter_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  entries JSON,
  total_count BIGINT,
  total_pages INTEGER,
  current_page INTEGER
) AS $$
DECLARE
  v_offset INTEGER := (page_number - 1) * page_size;
  v_total BIGINT;
  v_pages INTEGER;
  v_entries JSON;
BEGIN
  -- Build query with optional filters
  -- Count total
  SELECT COUNT(*) INTO v_total
  FROM time_entries
  WHERE user_id = user_uuid
    AND (filter_year IS NULL OR EXTRACT(YEAR FROM timestamp)::INTEGER = filter_year)
    AND (filter_month IS NULL OR EXTRACT(MONTH FROM timestamp)::INTEGER = filter_month)
    AND (filter_type IS NULL OR type = filter_type);

  v_pages := CEIL(v_total::REAL / page_size);

  -- Get entries
  SELECT json_agg(row_to_json(t))
  INTO v_entries
  FROM (
    SELECT id, type, timestamp, notes, created_at
    FROM time_entries
    WHERE user_id = user_uuid
      AND (filter_year IS NULL OR EXTRACT(YEAR FROM timestamp)::INTEGER = filter_year)
      AND (filter_month IS NULL OR EXTRACT(MONTH FROM timestamp)::INTEGER = filter_month)
      AND (filter_type IS NULL OR type = filter_type)
    ORDER BY timestamp DESC
    LIMIT page_size
    OFFSET v_offset
  ) t;

  RETURN QUERY SELECT v_entries, v_total, v_pages, page_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_current_month_summary
-- Returns summary for the current month (convenience function)
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_month_summary(user_uuid UUID)
RETURNS TABLE (
  year INTEGER,
  month INTEGER,
  total_hours INTERVAL,
  total_minutes INTEGER,
  regular_hours INTERVAL,
  overtime_hours INTERVAL,
  work_days INTEGER,
  avg_daily_hours INTERVAL
) AS $$
DECLARE
  v_now DATE := CURRENT_DATE;
  v_year INTEGER := EXTRACT(YEAR FROM v_now)::INTEGER;
  v_month INTEGER := EXTRACT(MONTH FROM v_now)::INTEGER;
  v_result RECORD;
BEGIN
  SELECT * INTO v_result FROM get_monthly_hours(user_uuid, v_year, v_month);
  
  RETURN QUERY SELECT
    v_year,
    v_month,
    v_result.total_hours,
    v_result.total_minutes,
    v_result.regular_hours,
    v_result.overtime_hours,
    v_result.work_days,
    CASE WHEN v_result.work_days > 0
      THEN (v_result.total_hours / v_result.work_days)
      ELSE '0 hours'::INTERVAL
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: get_current_week_summary
-- Returns summary for the current ISO week (convenience function)
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_week_summary(user_uuid UUID)
RETURNS TABLE (
  year INTEGER,
  week_number INTEGER,
  total_hours INTERVAL,
  total_minutes INTEGER,
  overtime_hours INTERVAL,
  overtime_threshold INTEGER
) AS $$
DECLARE
  v_now DATE := CURRENT_DATE;
  v_year INTEGER := EXTRACT(YEAR FROM v_now)::INTEGER;
  v_week INTEGER := EXTRACT(ISOWEEK FROM v_now)::INTEGER;
BEGIN
  RETURN QUERY SELECT * FROM get_weekly_overtime(user_uuid, v_year, v_week);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
