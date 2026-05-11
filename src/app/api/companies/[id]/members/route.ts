import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

  const { data: members, error: membersError } = await supabase
    .from('company_members')
    .select(`
      id,
      user_id,
      role,
      created_at,
      user:auth!user_id (
        email
      )
    `)
    .eq('company_id', id);

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  interface MemberWithUser {
    id: string;
    user_id: string;
    role: string;
    created_at: string;
    user: { email?: string } | null;
  }

  const formattedMembers = members?.map((m: MemberWithUser) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    created_at: m.created_at,
    email: m.user?.email || null,
  })) || [];

  return NextResponse.json(formattedMembers);
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

  const { data: existingUser } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    const { error: existingMemberError } = await supabase
      .from('company_members')
      .select('id')
      .eq('user_id', existingUser.id)
      .eq('company_id', id)
      .single();

    if (!existingMemberError) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
    }

    const { error: addMemberError } = await supabase
      .from('company_members')
      .insert({
        company_id: id,
        user_id: existingUser.id,
        role: 'employee',
      });

    if (addMemberError) {
      return NextResponse.json({ error: addMemberError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Member added successfully', user_id: existingUser.id }, { status: 201 });
  }

  const { error: inviteError } = await supabase
    .from('company_invites')
    .insert({
      company_id: id,
      email,
      invited_by: user.id,
    });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invite sent successfully', email }, { status: 201 });
}