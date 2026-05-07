import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 20;
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
  const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
  const type = searchParams.get('type') || null;

  const { data, error } = await supabase.rpc('list_time_entries_paginated', {
    user_uuid: user.id,
    page_number: page,
    page_size: pageSize,
    filter_year: year,
    filter_month: month,
    filter_type: type
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = data && data[0] ? {
    entries: data[0].entries || [],
    totalCount: data[0].total_count || 0,
    totalPages: data[0].total_pages || 0,
    currentPage: data[0].current_page || page
  } : {
    entries: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: page
  };

  return NextResponse.json(result);
}
