import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();
  const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth() + 1;

  const { data, error } = await supabase.rpc('get_monthly_hours', {
    user_uuid: user.id,
    target_year: year,
    target_month: month
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format the response
  const result = data && data[0] ? {
    year,
    month,
    totalHours: data[0].total_hours || '0 seconds',
    totalMinutes: data[0].total_minutes || 0,
    regularHours: data[0].regular_hours || '0 seconds',
    overtimeHours: data[0].overtime_hours || '0 seconds',
    workDays: data[0].work_days || 0
  } : {
    year,
    month,
    totalHours: '0 seconds',
    totalMinutes: 0,
    regularHours: '0 seconds',
    overtimeHours: '0 seconds',
    workDays: 0
  };

  return NextResponse.json(result);
}
