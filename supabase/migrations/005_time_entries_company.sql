-- Migration 005: Time Entries Company Association
-- Add company_id to time_entries and update RLS for B2B filtering

-- Add company_id column to time_entries (nullable for existing entries)
ALTER TABLE time_entries
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL;

-- Create index for company filtering
CREATE INDEX IF NOT EXISTS idx_time_entries_company_id ON time_entries(company_id);

-- Create function to automatically set company_id when inserting time entries
CREATE OR REPLACE FUNCTION set_time_entry_company()
RETURNS TRIGGER AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Only set company_id if it's NULL
  IF NEW.company_id IS NULL THEN
    -- Try to get company from company_members for the current user
    SELECT cm.company_id INTO v_company_id
    FROM company_members cm
    WHERE cm.user_id = NEW.user_id
    LIMIT 1;

    IF v_company_id IS NOT NULL THEN
      NEW.company_id := v_company_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS set_time_entry_company_trigger ON time_entries;

CREATE TRIGGER set_time_entry_company_trigger
  BEFORE INSERT ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_time_entry_company();

-- Update existing RLS policies to use company filtering

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own entries" ON time_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON time_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON time_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON time_entries;

-- New Policy: Users can view their own entries OR entries from their company
CREATE POLICY "Users can view own entries" ON time_entries
  FOR SELECT USING (
    auth.uid() = user_id
    OR company_id IN (
      SELECT company_id FROM company_members WHERE user_id = auth.uid()
    )
  );

-- New Policy: Users can insert their own entries
CREATE POLICY "Users can insert own entries" ON time_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- New Policy: Users can update their own entries
CREATE POLICY "Users can update own entries" ON time_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- New Policy: Users can delete their own entries
CREATE POLICY "Users can delete own entries" ON time_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Function to get company members (for admin dashboard)
CREATE OR REPLACE FUNCTION get_company_members(p_company_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  role TEXT,
  created_at TIMESTAMPTZ,
  user_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cm.id,
    cm.user_id,
    cm.role,
    cm.created_at,
    COALESCE(u.email, '')::TEXT as user_email
  FROM company_members cm
  LEFT JOIN auth.users u ON u.id = cm.user_id
  WHERE cm.company_id = p_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get company time entries summary
CREATE OR REPLACE FUNCTION get_company_time_summary(
  p_company_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS TABLE (
  total_entries INTEGER,
  unique_employees INTEGER,
  total_hours INTERVAL
) AS $$
DECLARE
  v_total_entries INTEGER;
  v_unique_employees INTEGER;
  v_total_hours INTERVAL := '0 hours';
BEGIN
  -- Count total entries
  SELECT COUNT(*) INTO v_total_entries
  FROM time_entries
  WHERE company_id = p_company_id
    AND EXTRACT(YEAR FROM timestamp)::INTEGER = p_year
    AND EXTRACT(MONTH FROM timestamp)::INTEGER = p_month;

  -- Count unique employees with entries
  SELECT COUNT(DISTINCT user_id) INTO v_unique_employees
  FROM time_entries
  WHERE company_id = p_company_id
    AND EXTRACT(YEAR FROM timestamp)::INTEGER = p_year
    AND EXTRACT(MONTH FROM timestamp)::INTEGER = p_month;

  RETURN QUERY SELECT v_total_entries, v_unique_employees, v_total_hours;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;