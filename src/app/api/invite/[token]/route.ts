import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createClient();
  const { token } = await params;

  const { data: invite, error } = await supabase
    .from('company_invites')
    .select('id, company_id, email, expires_at, accepted_at')
    .eq('token', token)
    .single();

  if (error || !invite) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  }

  if (invite.accepted_at) {
    return NextResponse.json({ error: 'Invite already used' }, { status: 400 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 400 });
  }

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('id', invite.company_id)
    .single();

  return NextResponse.json({
    company_id: invite.company_id,
    email: invite.email,
    expires_at: invite.expires_at,
    company_name: company?.name || null,
  });
}