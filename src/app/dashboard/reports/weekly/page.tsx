'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReportCard } from '@/components/reports/ReportCard';
import { StatCard } from '@/components/reports/StatCard';
import { SkeletonCard } from '@/components/reports/SkeletonCard';

interface DayEntry {
  date: string;
  dayOfWeek: number;
  dayName: string;
  hoursWorked: string;
  minutesWorked: number;
  isOvertime: boolean;
  overtimeMinutes: number;
}

interface WeeklyData {
  year: number;
  week: number;
  breakdown: DayEntry[];
  overtime: {
    weekNumber: number;
    year: number;
    totalHours: string;
    totalMinutes: number;
    regularHours: string;
    overtimeHours: string;
    overtimeThresholdHours: number;
  } | null;
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function DayRow({ entry }: { entry: DayEntry }) {
  const isWeekend = entry.dayOfWeek === 0 || entry.dayOfWeek === 6;
  const date = new Date(entry.date + 'T00:00:00');
  const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className={`flex items-center justify-between py-3 px-3 rounded-lg ${isWeekend ? 'bg-zinc-50 dark:bg-zinc-800/50' : 'bg-white dark:bg-zinc-900'} border border-zinc-200 dark:border-zinc-800`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
          {formattedDate}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {entry.dayName}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {entry.minutesWorked > 0 ? formatMinutes(entry.minutesWorked) : '-'}
          </span>
          {entry.isOvertime && entry.overtimeMinutes > 0 && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-medium">
              +{formatMinutes(entry.overtimeMinutes)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <SkeletonCard variant="default" />
        <SkeletonCard variant="default" />
        <SkeletonCard variant="default" />
        <SkeletonCard variant="default" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 h-14" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
      <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-sm">Sem dados para este período</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-6 text-center">
        <svg className="h-10 w-10 mx-auto text-red-500 dark:text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">
          Erro ao carregar relatório
        </p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export default function WeeklyReportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeeklyData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/reports/weekly');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWeeklyData();
    }
  }, [user, fetchWeeklyData]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Relatório Semanal</h1>
        </header>
        <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
          <LoadingState />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Relatório Semanal</h1>
        </header>
        <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
          <ErrorState onRetry={fetchWeeklyData} />
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Relatório Semanal</h1>
        </header>
        <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
          <EmptyState />
        </div>
      </main>
    );
  }

  const totalMinutes = data.breakdown.reduce((acc, day) => acc + day.minutesWorked, 0);
  const workDays = data.breakdown.filter(day => day.minutesWorked > 0).length;
  const avgMinutesPerDay = workDays > 0 ? Math.round(totalMinutes / workDays) : 0;
  const overtimeMinutes = data.overtime?.totalMinutes ? data.overtime.totalMinutes - (workDays * 480) : 0;

  const weekLabel = `Semana ${data.week}/${data.year}`;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Relatório Semanal</h1>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">{weekLabel}</span>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          <ReportCard
            title="Total semana"
            value={formatMinutes(totalMinutes)}
            variant="highlight"
          />
          <ReportCard
            title="Horas extras"
            value={overtimeMinutes > 0 ? `+${formatMinutes(overtimeMinutes)}` : '0h 0m'}
            variant={overtimeMinutes > 0 ? 'default' : 'default'}
          />
          <StatCard
            label="Dias trabalhados"
            value={String(workDays)}
            unit="dias"
          />
          <StatCard
            label="Média/dia"
            value={formatMinutes(avgMinutesPerDay)}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Dias da semana
          </h2>
          {data.breakdown.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {data.breakdown.map((entry, index) => (
                <DayRow key={index} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
