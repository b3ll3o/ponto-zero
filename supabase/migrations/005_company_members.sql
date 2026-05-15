-- Migration 005: Company Members Table
-- Create company_members table for B2B membership management

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create company_members table
CREATE TABLE IF NOT EXISTS company_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_members_company_id ON company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user_id ON company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user_company ON company_members(user_id, company_id);

-- Enable RLS
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

-- Policy: User can view their own memberships
CREATE POLICY "User can view own memberships" ON company_members
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: User can insert their own membership (for invite acceptance)
CREATE POLICY "User can insert own membership" ON company_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: User can update their own membership
CREATE POLICY "User can update own membership" ON company_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: User can delete their own membership
CREATE POLICY "User can delete own membership" ON company_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Admin can view all members of their company
CREATE POLICY "Admin can view company members" ON company_members
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE admin_user_id = auth.uid()
    )
  );

-- Policy: Admin can insert members to their company
CREATE POLICY "Admin can insert company members" ON company_members
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE admin_user_id = auth.uid()
    )
  );

-- Policy: Admin can update members of their company
CREATE POLICY "Admin can update company members" ON company_members
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE admin_user_id = auth.uid()
    )
  );

-- Policy: Admin can delete members from their company
CREATE POLICY "Admin can delete company members" ON company_members
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE admin_user_id = auth.uid()
    )
  );