import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: membership, error: membershipError } = await supabase
    .from('company_members')
    .select('company_id, role')
    .eq('user_id', user.id)
    .eq('company_id', id)
    .single();

  if (membershipError || !membership) {
    return NextResponse.json({ error: 'Not a member of this company' }, { status: 403 });
  }

  // Use SECURITY DEFINER RPC to access auth.users (bypasses RLS on auth schema)
  const { data: members, error: membersError } = await supabase
    .rpc('get_company_members', { p_company_id: id });

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  return NextResponse.json(members || []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: membership, error: membershipError } = await supabase
    .from('company_members')
    .select('company_id, role')
    .eq('user_id', user.id)
    .eq('company_id', id)
    .single();

  if (membershipError || !membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can invite members' }, { status: 403 });
  }

  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  // Check if invite already exists for this email + company (reuse if not accepted)
  const { data: existingInvite } = await supabase
    .from('company_invites')
    .select('id, token, accepted_at')
    .eq('company_id', id)
    .eq('email', email.toLowerCase())
    .is('accepted_at', null)
    .single();

  if (existingInvite) {
    // Invite already pending — return the existing token link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/invite/${existingInvite.token}`;
    return NextResponse.json({
      message: 'Invite already pending',
      invite_link: inviteLink,
      token: existingInvite.token,
    }, { status: 200 });
  }

  // Generate new invite token
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error: inviteError } = await supabase
    .from('company_invites')
    .insert({
      company_id: id,
      email: email.toLowerCase(),
      invited_by: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const inviteLink = `${baseUrl}/invite/${token}`;

  return NextResponse.json({
    message: 'Invite created successfully',
    invite_link: inviteLink,
    token,
    expires_at: expiresAt.toISOString(),
  }, { status: 201 });
}
