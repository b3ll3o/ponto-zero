/**
 * Time tracking utility functions
 * Wraps Supabase RPC calls for monthly hours, overtime, and paginated entries
 */

import { createClient } from './supabase/client';

export interface DailyHours {
  date: string;
  total_minutes: number;
  total_hours: number;
  overtime_minutes: number;
  overtime_hours: number;
  is_overtime: boolean;
  is_undertime: boolean;
  is_complete: boolean;
}

export interface MonthlyHours {
  total_minutes: number;
  total_hours: number;
  work_days: number;
  standard_minutes: number;
  overtime_minutes: number;
  overtime_hours: number;
  year: number;
  month: number;
}

export interface WeeklyHours {
  week_start: string;
  week_end: string;
  total_minutes: number;
  total_hours: number;
  overtime_minutes: number;
  overtime_hours: number;
  is_overtime: boolean;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedEntries {
  entries: TimeEntry[];
  pagination: PaginationMeta;
}

export interface TimeEntry {
  id: string;
  type: 'start' | 'end';
  timestamp: string;
  notes: string | null;
  created_at: string;
}

export interface CalendarDay {
  date: string;
  day_of_week: number;
  is_weekend: boolean;
  hours: DailyHours;
}

/**
 * Get total hours worked in a given month, plus overtime summary
 */
export async function getMonthlyHours(
  userId: string,
  year: number,
  month: number
): Promise<MonthlyHours | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_monthly_hours', {
    user_uuid: userId,
    year,
    month,
  });

  if (error || !data) {
    console.error('getMonthlyHours error:', error);
    return null;
  }

  return data as MonthlyHours;
}

/**
 * Get hours worked on a specific day, with overtime flag
 */
export async function getDailyHours(
  userId: string,
  date: string // YYYY-MM-DD
): Promise<DailyHours | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_daily_hours', {
    user_uuid: userId,
    target_date: date,
  });

  if (error || !data) {
    console.error('getDailyHours error:', error);
    return null;
  }

  return data as DailyHours;
}

/**
 * Get total hours for a week (Mon-Sun), plus overtime if >44h
 */
export async function getWeeklyHours(
  userId: string,
  weekStartDate: string // YYYY-MM-DD (Monday)
): Promise<WeeklyHours | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_weekly_hours', {
    user_uuid: userId,
    week_start_date: weekStartDate,
  });

  if (error || !data) {
    console.error('getWeeklyHours error:', error);
    return null;
  }

  return data as WeeklyHours;
}

/**
 * Get paginated time entries, optionally filtered by year/month
 */
export async function getTimeEntriesPaginated(
  userId: string,
  options: {
    page?: number;
    pageSize?: number;
    year?: number;
    month?: number;
  } = {}
): Promise<PaginatedEntries | null> {
  const supabase = createClient();
  const { page = 1, pageSize = 20, year, month } = options;

  const { data, error } = await supabase.rpc('get_time_entries_paginated', {
    user_uuid: userId,
    page,
    page_size: pageSize,
    filter_year: year ?? null,
    filter_month: month ?? null,
  });

  if (error || !data) {
    console.error('getTimeEntriesPaginated error:', error);
    return null;
  }

  return data as PaginatedEntries;
}

/**
 * Get a full month calendar with daily breakdown
 */
export async function getMonthCalendar(
  userId: string,
  year: number,
  month: number
): Promise<CalendarDay[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_month_calendar', {
    user_uuid: userId,
    year,
    month,
  });

  if (error || !data) {
    console.error('getMonthCalendar error:', error);
    return null;
  }

  return data as CalendarDay[];
}

/**
 * Get current month number (1-indexed)
 */
export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

/**
 * Get current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Get the Monday of the current week
 */
export function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

/**
 * Format minutes as "Xh Ym"
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
