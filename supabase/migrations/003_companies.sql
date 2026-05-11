-- Migration 003: Companies Table
-- Create companies table for B2B system

-- Enable UUID extension (should already be enabled, but确保)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_companies_admin_user_id ON companies(admin_user_id);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can only see their own company
CREATE POLICY "Admin can view own company" ON companies
  FOR SELECT USING (auth.uid() = admin_user_id);

-- Policy: Admin can insert their own company
CREATE POLICY "Admin can insert own company" ON companies
  FOR INSERT WITH CHECK (auth.uid() = admin_user_id);

-- Policy: Admin can update their own company
CREATE POLICY "Admin can update own company" ON companies
  FOR UPDATE USING (auth.uid() = admin_user_id);

-- Policy: Admin can delete their own company
CREATE POLICY "Admin can delete own company" ON companies
  FOR DELETE USING (auth.uid() = admin_user_id);