import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createClient();
  const { token } = await params;

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { user_id } = body;

  if (user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: invite } = await supabase
    .from('company_invites')
    .select('id, company_id, email, expires_at, accepted_at')
    .eq('token', token)
    .single();

  if (!invite) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  }

  if (invite.accepted_at) {
    return NextResponse.json({ error: 'Invite already used' }, { status: 400 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 400 });
  }

  // Security: validate that the invite was sent to this user's email
  const userEmail = user.email?.toLowerCase();
  const inviteEmail = invite.email?.toLowerCase();
  if (inviteEmail && userEmail && userEmail !== inviteEmail) {
    return NextResponse.json(
      { error: 'This invite was sent to a different email address' },
      { status: 403 }
    );
  }

  const { data: existingMember } = await supabase
    .from('company_members')
    .select('id')
    .eq('user_id', user.id)
    .eq('company_id', invite.company_id)
    .single();

  if (existingMember) {
    await supabase
      .from('company_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token);

    return NextResponse.json({ message: 'Already a member', company_id: invite.company_id });
  }

  const { error: memberError } = await supabase
    .from('company_members')
    .insert({
      company_id: invite.company_id,
      user_id: user.id,
      role: 'employee',
    });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  await supabase
    .from('company_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('token', token);

  return NextResponse.json({ message: 'Success', company_id: invite.company_id });
}