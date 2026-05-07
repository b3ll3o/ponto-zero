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

  // Get monthly overtime summary
  const { data, error } = await supabase.rpc('get_monthly_overtime_summary', {
    user_uuid: user.id,
    target_year: year,
    target_month: month
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = data && data[0] ? {
    year,
    month,
    totalOvertimeHours: data[0].total_overtime_hours || '0 seconds',
    totalOvertimeMinutes: data[0].total_overtime_minutes || 0,
    daysWithOvertime: data[0].days_with_overtime || 0,
    weeksWithWeeklyOvertime: data[0].weeks_with_weekly_overtime || 0
  } : {
    year,
    month,
    totalOvertimeHours: '0 seconds',
    totalOvertimeMinutes: 0,
    daysWithOvertime: 0,
    weeksWithWeeklyOvertime: 0
  };

  return NextResponse.json(result);
}
