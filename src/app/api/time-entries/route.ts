import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateTimestamp, canRegisterEntry, canRegisterExit, VALIDATION_ERRORS } from '@/lib/validations';

type FilterPeriod = 'today' | 'week' | 'month' | 'custom';

function calculateDateRange(period: FilterPeriod, params: URLSearchParams): { start: Date; end: Date } {
  const now = new Date();
  let start: Date, end: Date = now;

  switch (period) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      end = new Date();
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date();
      break;
    case 'custom':
      start = new Date(params.get('startDate')!);
      end = new Date(params.get('endDate')!);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  return { start, end };
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const period = (searchParams.get('period') || 'today') as FilterPeriod;
  const sort = (searchParams.get('sort') || 'desc') as 'asc' | 'desc';
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
  const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
  const type = searchParams.get('type') || null;

  if (period === 'custom' && (!searchParams.get('startDate') || !searchParams.get('endDate'))) {
    return NextResponse.json(
      { error: 'startDate and endDate are required when period is custom' },
      { status: 400 }
    );
  }

  if (period && ['today', 'week', 'month', 'custom'].includes(period)) {
    const { start, end } = calculateDateRange(period, searchParams);

    let query = supabase
      .from('time_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('timestamp', start.toISOString())
      .lte('timestamp', end.toISOString())
      .order('timestamp', { ascending: sort === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        totalPages,
        totalItems
      }
    });
  }

  const { data, error } = await supabase.rpc('list_time_entries_paginated', {
    user_uuid: user.id,
    page_number: page,
    page_size: limit,
    filter_year: year,
    filter_month: month,
    filter_type: type
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = data && data[0] ? {
    data: data[0].entries || [],
    pagination: {
      page: data[0].current_page || page,
      limit,
      totalPages: data[0].total_pages || 0,
      totalItems: data[0].total_count || 0
    }
  } : {
    data: [],
    pagination: {
      page,
      limit,
      totalPages: 0,
      totalItems: 0
    }
  };

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, timestamp, notes } = body;

  if (!type || !['start', 'end'].includes(type)) {
    return NextResponse.json({ error: 'Invalid entry type' }, { status: 400 });
  }

  const entryTimestamp = timestamp || new Date().toISOString();
  const timestampDate = new Date(entryTimestamp);

  const timestampValidation = validateTimestamp(timestampDate);
  if (!timestampValidation.valid) {
    return NextResponse.json(
      { error: timestampValidation.error, code: timestampValidation.code },
      { status: VALIDATION_ERRORS.FUTURE_TIMESTAMP.httpStatus }
    );
  }

  if (type === 'start') {
    const entryCheck = await canRegisterEntry(user.id);
    if (!entryCheck.valid) {
      const errorInfo = VALIDATION_ERRORS[entryCheck.code!];
      return NextResponse.json(
        { error: entryCheck.error, code: entryCheck.code },
        { status: errorInfo.httpStatus }
      );
    }
  }

  if (type === 'end') {
    const exitCheck = await canRegisterExit(user.id);
    if (!exitCheck.valid) {
      const errorInfo = VALIDATION_ERRORS[exitCheck.code!];
      return NextResponse.json(
        { error: exitCheck.error, code: exitCheck.code },
        { status: errorInfo.httpStatus }
      );
    }
  }

  let companyId = null;
  const { data: membership } = await supabase
    .from('company_members')
    .select('company_id')
    .eq('user_id', user.id)
    .single();

  if (membership) {
    companyId = membership.company_id;
  }

  const { data, error } = await supabase
    .from('time_entries')
    .insert({
      user_id: user.id,
      type,
      timestamp: entryTimestamp,
      notes: notes || null,
      company_id: companyId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
