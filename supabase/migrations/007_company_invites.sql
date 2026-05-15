-- Migration 007: Company Invites Table
-- Create company_invites table for invite link flow

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create company_invites table
CREATE TABLE IF NOT EXISTS company_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT UNIQUE NOT NULL,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_company_invites_token ON company_invites(token);
CREATE INDEX IF NOT EXISTS idx_company_invites_email ON company_invites(email);
CREATE INDEX IF NOT EXISTS idx_company_invites_company_id ON company_invites(company_id);

-- Enable RLS
ALTER TABLE company_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view invite by token (for invite acceptance page)
CREATE POLICY "Anyone can view invite by token" ON company_invites
  FOR SELECT USING (true);

-- Policy: Admins can manage invites for their company
CREATE POLICY "Admin can manage company invites" ON company_invites
  FOR ALL USING (
    company_id IN (
      SELECT id FROM companies WHERE admin_user_id = auth.uid()
    )
  );

-- Policy: Invitees can accept invite (update accepted_at)
CREATE POLICY "User can accept own invite" ON company_invites
  FOR UPDATE USING (true);

-- Function to accept invite
CREATE OR REPLACE FUNCTION accept_company_invite(p_token TEXT, p_user_id UUID)
RETURNS TABLE (success BOOLEAN, error_message TEXT, company_id UUID)
AS $$
DECLARE
  v_invite company_invites;
  v_existing_member company_members;
BEGIN
  -- Get the invite
  SELECT * INTO v_invite FROM company_invites WHERE token = p_token;

  IF v_invite IS NULL THEN
    RETURN QUERY SELECT false, 'Invalid invite token', NULL::UUID;
    RETURN;
  END IF;

  IF v_invite.accepted_at IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Invite already used', v_invite.company_id;
    RETURN;
  END IF;

  IF v_invite.expires_at < NOW() THEN
    RETURN QUERY SELECT false, 'Invite expired', v_invite.company_id;
    RETURN;
  END IF;

  -- Check if user already has a membership
  SELECT * INTO v_existing_member
  FROM company_members
  WHERE user_id = p_user_id AND company_id = v_invite.company_id;

  IF v_existing_member IS NOT NULL THEN
    -- Mark invite as accepted but don't create duplicate membership
    UPDATE company_invites SET accepted_at = NOW() WHERE id = v_invite.id;
    RETURN QUERY SELECT true, 'Already a member', v_invite.company_id;
    RETURN;
  END IF;

  -- Create membership
  INSERT INTO company_members (company_id, user_id, role)
  VALUES (v_invite.company_id, p_user_id, 'employee');

  -- Mark invite as accepted
  UPDATE company_invites SET accepted_at = NOW() WHERE id = v_invite.id;

  RETURN QUERY SELECT true, 'Success', v_invite.company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;