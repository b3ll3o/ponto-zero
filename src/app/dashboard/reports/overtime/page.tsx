'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReportCard } from '@/components/reports/ReportCard';
import { StatCard } from '@/components/reports/StatCard';
import { SkeletonCard } from '@/components/reports/SkeletonCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OvertimeData {
  year: number;
  month: number;
  totalOvertimeHours: string;
  totalOvertimeMinutes: number;
  daysWithOvertime: number;
  weeksWithWeeklyOvertime: number;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const ClockIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrendIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function OvertimeReportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<OvertimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOvertimeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reports/overtime');
      if (!response.ok) {
        throw new Error('Failed to fetch overtime data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const currentMonth = data
    ? new Date(data.year, data.month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '';

  const totalMinutes = data?.totalOvertimeMinutes ?? 0;
  const projectedMonthMinutes = data && data.weeksWithWeeklyOvertime > 0
    ? Math.round(totalMinutes / data.weeksWithWeeklyOvertime * 4)
    : null;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Horas Extras
          </h1>
        </div>
        {data && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
            {currentMonth}
          </span>
        )}
      </header>

      <div className="flex-1 px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
        {isLoading ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard variant="highlight" />
              <SkeletonCard />
            </div>
            <SkeletonCard variant="highlight" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} variant="compact" />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertIcon />
                <span className="text-sm font-medium">Erro ao carregar dados</span>
              </div>
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={fetchOvertimeData}
              className="w-full rounded-lg bg-emerald-500 text-white py-3 text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ReportCard
                title="Total Acumulado"
                value={formatDuration(totalMinutes)}
                subtitle={`${data.daysWithOvertime} dias com extras`}
                icon={<ClockIcon />}
                variant="highlight"
                trend={totalMinutes > 0 ? 'up' : 'neutral'}
              />
              <ReportCard
                title="Semanas"
                value={String(data.weeksWithWeeklyOvertime)}
                subtitle="semanas com extras"
                icon={<CalendarIcon />}
              />
            </div>

            {projectedMonthMinutes !== null && (
              <ReportCard
                title="Projeção Fim do Mês"
                value={formatDuration(projectedMonthMinutes)}
                subtitle="baseado na média atual"
                icon={<TrendIcon />}
                variant="default"
              />
            )}

            <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Detalhamento
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Horas Extras"
                  value={formatDuration(totalMinutes)}
                  variant={totalMinutes > 0 ? 'positive' : 'neutral'}
                />
                <StatCard
                  label="Dias Úteis"
                  value={String(data.daysWithOvertime)}
                  variant="neutral"
                />
              </div>
            </div>

            {totalMinutes === 0 && (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                <svg className="h-12 w-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Nenhuma hora extra registrada</p>
                <p className="text-xs mt-1">nos dias úteis do mês</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">Sem dados para este período</p>
          </div>
        )}
      </div>

      <nav className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-around max-w-lg mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard/history" className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Histórico</span>
          </Link>
          <Link href="/dashboard/reports" className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Relatórios</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
