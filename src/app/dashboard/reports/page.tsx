'use client';

import { useState, useCallback } from 'react';
import { TabNavigation } from '@/components/reports/TabNavigation';
import { SkeletonCard } from '@/components/reports/SkeletonCard';
import { useRouter } from 'next/navigation';

const tabs = [
  { id: 'weekly', label: 'Semanal', href: '/dashboard/reports/weekly' },
  { id: 'overtime', label: 'Horas Extras', href: '/dashboard/reports/overtime' },
];

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonCard variant="compact" />
        <SkeletonCard variant="compact" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard variant="default" />
        <SkeletonCard variant="default" />
        <SkeletonCard variant="default" />
        <SkeletonCard variant="default" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
        <svg className="h-8 w-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Erro ao carregar
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Não foi possível carregar os dados do relatório.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
        <svg className="h-8 w-8 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Sem dados
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Não há dados para exibir neste período.
      </p>
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.href) {
      router.push(tab.href);
    }
  }, [router]);

  const handleRetry = useCallback(() => {
    setError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const getHeaderPeriod = () => {
    const now = new Date();
    const weekNumber = getWeekNumber(now);
    return `Semana ${weekNumber}/${now.getFullYear()}`;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-zinc-900 dark:border-b dark:border-zinc-800">
        <div className="mx-auto max-w-lg">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Relatórios
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {getHeaderPeriod()}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-lg px-4 py-4">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        <div className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState onRetry={handleRetry} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

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
            className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Histórico</span>
          </a>
          <a
            href="/dashboard/reports"
            className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Relatórios</span>
          </a>
          <a
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Perfil</span>
          </a>
        </div>
      </nav>
    </main>
  );
}
