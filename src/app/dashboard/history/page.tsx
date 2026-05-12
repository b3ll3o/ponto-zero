'use client';

import { useState, useCallback, useEffect } from 'react';
import { TimeEntry } from '@/lib/timeTracking';
import { FilterBar, FilterPeriod } from '@/components/history/FilterBar';
import { TimeEntryList } from '@/components/history/TimeEntryList';
import { Pagination } from '@/components/history/Pagination';

interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<FilterPeriod>('today');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        period,
        sort: sortOrder,
      });

      if (period === 'custom') {
        params.set('startDate', customDateRange.start);
        params.set('endDate', customDateRange.end);
      }

      const response = await fetch(`/api/time-entries?${params.toString()}`);
      const result = await response.json();

      if (result.data) {
        setEntries(result.data);
      }
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, period, sortOrder, customDateRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEntries();
  }, [fetchEntries, refreshTrigger]);

  const handlePeriodChange = useCallback((newPeriod: FilterPeriod) => {
    setPeriod(newPeriod);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSortChange = useCallback((sort: 'asc' | 'desc') => {
    setSortOrder(sort);
    setCurrentPage(1);
  }, []);

  const handleCustomDateChange = useCallback((range: { start: string; end: string }) => {
    setCustomDateRange(range);
    setCurrentPage(1);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return 'Hoje';
      case 'week':
        return 'Esta Semana';
      case 'month':
        return 'Este Mês';
      case 'custom':
        return 'Período Personalizado';
      default:
        return '';
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-zinc-900 dark:border-b dark:border-zinc-800">
        <div className="mx-auto max-w-lg">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Histórico
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {getPeriodLabel()}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-lg px-4 py-4">
        <div className="mb-4">
          <FilterBar
            value={period}
            onChange={handlePeriodChange}
            customDateRange={customDateRange}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>

        <TimeEntryList
          entries={entries}
          loading={loading}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
        />
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
        />
      )}

      <nav className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 mt-auto">
        <div className="flex justify-around max-w-lg mx-auto">
          <a
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </a>
          <a
            href="/dashboard/history"
            className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Histórico</span>
          </a>
          <a
            href="/dashboard/reports"
            className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Relatórios</span>
          </a>
        </div>
      </nav>
    </main>
  );
}
