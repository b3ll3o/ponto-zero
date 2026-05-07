import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for timeTracking utilities.
 *
 * Functions that make Supabase RPC calls are tested by mocking
 * the Supabase client, exercising the function logic without a real DB.
 */

// --- Shared mock RPC function ---
// vi.hoisted ensures mockRpc is the SAME reference in both the mock factory
// and the test file body. Without this, vi.mock creates a different mockRpc
// than the one used in test assertions.
const { mockRpc } = vi.hoisted(() => ({ mockRpc: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    rpc: mockRpc,
  }),
}));

import {
  formatDuration,
  getCurrentMonth,
  getCurrentYear,
  getCurrentWeekStart,
  getMonthlyHours,
  getDailyHours,
  getWeeklyHours,
  getTimeEntriesPaginated,
  getMonthCalendar,
} from './timeTracking';

describe('timeTracking — utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatDuration', () => {
    it('formats 0 minutes as 0m', () => expect(formatDuration(0)).toBe('0m'));
    it('formats minutes only when less than an hour', () => {
      expect(formatDuration(1)).toBe('1m');
      expect(formatDuration(45)).toBe('45m');
      expect(formatDuration(59)).toBe('59m');
    });
    it('formats hours only when exact hour with no minutes', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(120)).toBe('2h');
      expect(formatDuration(480)).toBe('8h');
    });
    it('formats hours and minutes combined', () => {
      expect(formatDuration(61)).toBe('1h 1m');
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(485)).toBe('8h 5m');
      expect(formatDuration(479)).toBe('7h 59m');
    });
    it('handles large values', () => {
      expect(formatDuration(14400)).toBe('240h');
    });
  });

  describe('getCurrentMonth', () => {
    it('returns current month as 1-indexed number', () => {
      const month = getCurrentMonth();
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
    });
  });

  describe('getCurrentYear', () => {
    it('returns a realistic year', () => {
      const year = getCurrentYear();
      expect(year).toBeGreaterThanOrEqual(2020);
      expect(year).toBeLessThanOrEqual(2100);
    });
  });

  describe('getCurrentWeekStart', () => {
    it('returns a date string in YYYY-MM-DD format', () => {
      expect(getCurrentWeekStart()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    it('the returned date is always a Monday', () => {
      const date = new Date(getCurrentWeekStart() + 'T00:00:00');
      expect(date.getDay()).toBe(1);
    });
    it('the returned date is on or before today', () => {
      const monday = new Date(getCurrentWeekStart() + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(monday.getTime()).toBeLessThanOrEqual(today.getTime());
    });
  });
});

describe('timeTracking — Supabase RPC functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- getMonthlyHours ---
  it('getMonthlyHours returns null on RPC error', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'RPC failed' } });
    const result = await getMonthlyHours('user-1', 2026, 5);
    expect(result).toBeNull();
  });

  it('getMonthlyHours returns data on success', async () => {
    const mockData = {
      total_minutes: 2400,
      total_hours: '40 hours',
      work_days: 22,
      standard_minutes: 1760,
      overtime_minutes: 640,
      overtime_hours: '10 hours 40 mins',
      year: 2026,
      month: 5,
    };
    mockRpc.mockResolvedValueOnce({ data: mockData, error: null });
    const result = await getMonthlyHours('user-1', 2026, 5);
    expect(result).toEqual(mockData);
  });

  it('getMonthlyHours calls RPC with correct args', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });
    await getMonthlyHours('user-abc', 2026, 7);
    expect(mockRpc).toHaveBeenCalledWith('get_monthly_hours', {
      user_uuid: 'user-abc',
      year: 2026,
      month: 7,
    });
  });

  // --- getDailyHours ---
  it('getDailyHours returns null on error', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
    const result = await getDailyHours('user-1', '2026-05-07');
    expect(result).toBeNull();
  });

  it('getDailyHours returns data on success', async () => {
    const mockData = {
      date: '2026-05-07',
      total_minutes: 480,
      total_hours: 8,
      overtime_minutes: 0,
      overtime_hours: 0,
      is_overtime: false,
      is_undertime: false,
      is_complete: true,
    };
    mockRpc.mockResolvedValueOnce({ data: mockData, error: null });
    const result = await getDailyHours('user-1', '2026-05-07');
    expect(result).toEqual(mockData);
  });

  it('getDailyHours calls RPC with correct args', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });
    await getDailyHours('user-x', '2026-05-15');
    expect(mockRpc).toHaveBeenCalledWith('get_daily_hours', {
      user_uuid: 'user-x',
      target_date: '2026-05-15',
    });
  });

  // --- getWeeklyHours ---
  it('getWeeklyHours returns null on error', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'RPC failed' } });
    const result = await getWeeklyHours('user-1', '2026-05-04');
    expect(result).toBeNull();
  });

  it('getWeeklyHours returns data on success', async () => {
    const mockData = {
      week_start: '2026-05-04',
      week_end: '2026-05-10',
      total_minutes: 2400,
      total_hours: 40,
      overtime_minutes: 120,
      overtime_hours: 2,
      is_overtime: true,
    };
    mockRpc.mockResolvedValueOnce({ data: mockData, error: null });
    const result = await getWeeklyHours('user-1', '2026-05-04');
    expect(result).toEqual(mockData);
  });

  it('getWeeklyHours calls RPC with correct args', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });
    await getWeeklyHours('user-y', '2026-06-01');
    expect(mockRpc).toHaveBeenCalledWith('get_weekly_hours', {
      user_uuid: 'user-y',
      week_start_date: '2026-06-01',
    });
  });

  // --- getTimeEntriesPaginated ---
  it('getTimeEntriesPaginated returns null on error', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'RPC failed' } });
    const result = await getTimeEntriesPaginated('user-1', { page: 1, pageSize: 20 });
    expect(result).toBeNull();
  });

  it('getTimeEntriesPaginated returns paginated data on success', async () => {
    const mockData = {
      entries: [
        { id: '1', type: 'start', timestamp: '2026-05-07T09:00:00Z', notes: null, created_at: '2026-05-07T09:00:00Z' },
        { id: '2', type: 'end', timestamp: '2026-05-07T18:00:00Z', notes: null, created_at: '2026-05-07T18:00:00Z' },
      ],
      pagination: { page: 1, page_size: 20, total_count: 2, total_pages: 1, has_next: false, has_prev: false },
    };
    mockRpc.mockResolvedValueOnce({ data: mockData, error: null });
    const result = await getTimeEntriesPaginated('user-1', { page: 1, pageSize: 20 });
    expect(result).toEqual(mockData);
  });

  it('getTimeEntriesPaginated passes filter options to RPC', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });
    await getTimeEntriesPaginated('user-1', { page: 2, pageSize: 10, year: 2026, month: 5 });
    expect(mockRpc).toHaveBeenCalledWith('get_time_entries_paginated', {
      user_uuid: 'user-1',
      page: 2,
      page_size: 10,
      filter_year: 2026,
      filter_month: 5,
    });
  });

  // --- getMonthCalendar ---
  it('getMonthCalendar returns null on error', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'RPC failed' } });
    const result = await getMonthCalendar('user-1', 2026, 5);
    expect(result).toBeNull();
  });

  it('getMonthCalendar returns calendar array on success', async () => {
    const mockData = [
      { date: '2026-05-01', day_of_week: 5, is_weekend: true, hours: null },
      { date: '2026-05-02', day_of_week: 6, is_weekend: true, hours: null },
    ];
    mockRpc.mockResolvedValueOnce({ data: mockData, error: null });
    const result = await getMonthCalendar('user-1', 2026, 5);
    expect(result).toEqual(mockData);
  });

  it('getMonthCalendar calls RPC with correct args', async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });
    await getMonthCalendar('user-z', 2026, 12);
    expect(mockRpc).toHaveBeenCalledWith('get_month_calendar', {
      user_uuid: 'user-z',
      year: 2026,
      month: 12,
    });
  });
});
