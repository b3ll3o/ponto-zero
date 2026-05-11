import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

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
    return NextResponse.json({ error: 'Only admins can generate invite links' }, { status: 403 });
  }

  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error: inviteError } = await supabase
    .from('company_invites')
    .insert({
      company_id: id,
      invited_by: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const inviteLink = `${baseUrl}/invite/${token}`;

  return NextResponse.json({ invite_link: inviteLink, token, expires_at: expiresAt.toISOString() });
}