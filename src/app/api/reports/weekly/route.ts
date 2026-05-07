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
  const week = searchParams.get('week') ? parseInt(searchParams.get('week')!) : 
    parseInt(getISOWeek(new Date().toISOString().split('T')[0]));

  // Get weekly hours breakdown
  const { data: breakdownData, error: breakdownError } = await supabase.rpc('get_weekly_hours', {
    user_uuid: user.id,
    target_year: year,
    target_week: week
  });

  // Get weekly overtime summary
  const { data: overtimeData, error: overtimeError } = await supabase.rpc('get_weekly_overtime', {
    user_uuid: user.id,
    target_year: year,
    target_week: week
  });

  if (breakdownError || overtimeError) {
    return NextResponse.json({ 
      error: breakdownError?.message || overtimeError?.message 
    }, { status: 500 });
  }

  // Format breakdown
  const breakdown = (breakdownData || []).map((day: Record<string, unknown>) => ({
    dayOfWeek: day.day_of_week,
    dayName: day.day_name,
    date: day.date,
    hoursWorked: day.hours_worked || '0 seconds',
    minutesWorked: day.minutes_worked || 0,
    isOvertime: day.is_overtime || false,
    overtimeMinutes: day.overtime_minutes || 0
  }));

  // Format overtime
  const overtime = overtimeData && overtimeData[0] ? {
    weekNumber: overtimeData[0].week_number,
    year: overtimeData[0].year,
    totalHours: overtimeData[0].total_hours || '0 seconds',
    totalMinutes: overtimeData[0].total_minutes || 0,
    regularHours: overtimeData[0].regular_hours || '0 seconds',
    overtimeHours: overtimeData[0].overtime_hours || '0 seconds',
    overtimeThresholdHours: overtimeData[0].overtime_threshold_hours || 44
  } : null;

  return NextResponse.json({
    year,
    week,
    breakdown,
    overtime
  });
}

function getISOWeek(dateStr: string): string {
  const date = new Date(dateStr);
  const monday = new Date(date);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);
  return String(getWeekNumber(monday));
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
