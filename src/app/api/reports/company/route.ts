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

  const { data: membership } = await supabase
    .from('company_members')
    .select('company_id, role')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: 'User is not a company member' }, { status: 403 });
  }

  const companyId = membership.company_id;

  const { data: company } = await supabase
    .from('companies')
    .select('id, name, plan_type')
    .eq('id', companyId)
    .single();

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const { data: members } = await supabase
    .from('company_members')
    .select('id, user:auth!user_id(email)')
    .eq('company_id', companyId);

  const memberCount = members?.length || 0;

  const firstDayOfNextMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);

  const { data: monthEntries } = await supabase
    .from('time_entries')
    .select('timestamp, user_id, type')
    .eq('company_id', companyId)
    .gte('timestamp', `${year}-${String(month).padStart(2, '0')}-01`)
    .lte('timestamp', lastDayOfMonth.toISOString().split('T')[0] + 'T23:59:59');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: todayEntries } = await supabase
    .from('time_entries')
    .select('user_id, type')
    .eq('company_id', companyId)
    .gte('timestamp', today.toISOString())
    .lt('timestamp', tomorrow.toISOString());

  interface TimeEntry {
    user_id: string;
    type: string;
  }

  const employeesWhoEnteredToday = new Set(todayEntries?.filter((e: TimeEntry) => e.type === 'start').map((e: TimeEntry) => e.user_id) || []);

  let totalMinutes = 0;
  const userDailyMap: Record<string, { date: string; start: string | null; end: string | null }> = {};

  if (monthEntries) {
    for (const entry of monthEntries) {
      const dateKey = entry.timestamp.split('T')[0];
      const userKey = entry.user_id;

      if (!userDailyMap[userKey]) {
        userDailyMap[userKey] = { date: dateKey, start: null, end: null };
      }

      if (entry.type === 'start') {
        userDailyMap[userKey].start = entry.timestamp;
      } else if (entry.type === 'end' && userDailyMap[userKey].start) {
        userDailyMap[userKey].end = entry.timestamp;
        const startTime = new Date(userDailyMap[userKey].start!).getTime();
        const endTimestamp = userDailyMap[userKey].end!;
        const endTime = new Date(endTimestamp).getTime();
        totalMinutes += Math.floor((endTime - startTime) / (1000 * 60));
      }
    }
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const workingDaysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }).filter(Boolean).length;

  const result = {
    company: {
      id: company.id,
      name: company.name,
      plan_type: company.plan_type,
    },
    period: {
      year,
      month,
    },
    metrics: {
      total_members: memberCount,
      active_employees_today: employeesWhoEnteredToday.size,
      total_hours_this_month: `${totalHours}h ${remainingMinutes}m`,
      total_minutes_this_month: totalMinutes,
      work_days_in_month: workingDaysInMonth,
    },
  };

  return NextResponse.json(result);
}