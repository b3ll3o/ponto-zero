import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('admin_user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, cnpj, plan_type } = body;

  if (!name || !cnpj) {
    return NextResponse.json({ error: 'Name and CNPJ are required' }, { status: 400 });
  }

  const validPlanTypes = ['free', 'pro', 'business'];
  const plan = validPlanTypes.includes(plan_type) ? plan_type : 'free';

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      name,
      cnpj,
      plan_type: plan,
      admin_user_id: user.id,
    })
    .select()
    .single();

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 });
  }

  const { error: memberError } = await supabase
    .from('company_members')
    .insert({
      company_id: company.id,
      user_id: user.id,
      role: 'admin',
    });

  if (memberError) {
    await supabase.from('companies').delete().eq('id', company.id);
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json(company, { status: 201 });
}