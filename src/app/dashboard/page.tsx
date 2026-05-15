'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertBanner } from '@/components/AlertBanner';
import { hasOpenEntryFromYesterday } from '@/lib/validations';
import { useRouter } from 'next/navigation';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthlySummaryCard } from '@/components/dashboard/MonthlySummaryCard';
import { StatusCards } from '@/components/dashboard/StatusCards';
import { PunchButtons } from '@/components/dashboard/PunchButtons';
import { TodayEntries } from '@/components/dashboard/TodayEntries';
import { EntriesList } from '@/components/dashboard/EntriesList';
import { BottomNav } from '@/components/dashboard/BottomNav';

interface TimeEntry {
  id: string;
  type: 'start' | 'end';
  timestamp: string;
  notes: string | null;
}

interface MonthlySummary {
  year: number;
  month: number;
  totalHours: string;
  totalMinutes: number;
  regularHours: string;
  overtimeHours: string;
  workDays: number;
}

interface PaginatedEntries {
  entries: TimeEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />;
}

function formatHours(todayStart: string | null, todayEnd: string | null): string {
  if (!todayStart) return '0h 0m';
  const start = new Date(todayStart);
  const end = todayEnd ? new Date(todayEnd) : new Date();
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export default function DashboardPage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [todayStart, setTodayStart] = useState<string | null>(null);
  const [todayEnd, setTodayEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  const [allEntries, setAllEntries] = useState<PaginatedEntries | null>(null);
  const [entriesPage, setEntriesPage] = useState(1);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const [openEntryFromYesterday, setOpenEntryFromYesterday] = useState<{ hasOpen: boolean; lastEntryTimestamp?: string }>({ hasOpen: false });
  const [dismissedYesterdayAlert, setDismissedYesterdayAlert] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const fetchTodayEntries = useCallback(async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', today.toISOString())
      .lt('timestamp', tomorrow.toISOString())
      .order('timestamp', { ascending: true });

    if (!error && data) {
      setTodayEntries(data);
      const starts = data.filter((e: TimeEntry) => e.type === 'start');
      const ends = data.filter((e: TimeEntry) => e.type === 'end');
      setTodayStart(starts[0]?.timestamp || null);
      setTodayEnd(ends[0]?.timestamp || null);
    }
    setIsLoading(false);
  }, [user, supabase]);

  const fetchMonthlySummary = useCallback(async () => {
    if (!user) return;
    setMonthlyLoading(true);

    try {
      const response = await fetch('/api/reports/monthly');
      if (response.ok) {
        const data = await response.json();
        setMonthlySummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch monthly summary:', err);
    }
    setMonthlyLoading(false);
  }, [user]);

  const fetchAllEntries = useCallback(async (page: number) => {
    if (!user) return;
    setEntriesLoading(true);

    try {
      const response = await fetch(`/api/time-entries?page=${page}&pageSize=10`);
      if (response.ok) {
        const data = await response.json();
        setAllEntries(data);
      }
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    }
    setEntriesLoading(false);
  }, [user]);

  const checkOpenEntryFromYesterday = useCallback(async () => {
    if (!user) return;
    const result = await hasOpenEntryFromYesterday(user.id);
    setOpenEntryFromYesterday(result);
  }, [user]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTodayEntries();
      fetchMonthlySummary();
      fetchAllEntries(1);
      checkOpenEntryFromYesterday();
    }
  }, [user, fetchTodayEntries, fetchMonthlySummary, fetchAllEntries, checkOpenEntryFromYesterday]);

  const handleRegister = async (type: 'start' | 'end') => {
    if (!user) return;

    if (type === 'end' && !todayStart) {
      alert('Não há entrada registrada para hoje.');
      return;
    }

    setIsRegistering(true);

    const { error } = await supabase.from('time_entries').insert({
      user_id: user.id,
      type,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      alert('Erro ao registrar. Tente novamente.');
    } else {
      await fetchTodayEntries();
      await fetchMonthlySummary();
      await fetchAllEntries(1);
    }
    setIsRegistering(false);
  };

  const handlePageChange = async (newPage: number) => {
    setEntriesPage(newPage);
    await fetchAllEntries(newPage);
  };

  const handleRegisterYesterdayExit = async () => {
    if (!user || !openEntryFromYesterday.lastEntryTimestamp) return;

    setIsRegistering(true);

    const yesterdayCloseTime = new Date(openEntryFromYesterday.lastEntryTimestamp);
    yesterdayCloseTime.setHours(23, 59, 59, 0);

    const { error } = await supabase.from('time_entries').insert({
      user_id: user.id,
      type: 'end',
      timestamp: yesterdayCloseTime.toISOString(),
    });

    if (error) {
      alert('Erro ao registrar saída. Tente novamente.');
    } else {
      setOpenEntryFromYesterday({ hasOpen: false });
      setDismissedYesterdayAlert(true);
      await fetchTodayEntries();
      await fetchMonthlySummary();
    }
    setIsRegistering(false);
  };

  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="space-y-4 w-full max-w-md px-4">
          <LoadingSkeleton className="h-12 w-full" />
          <LoadingSkeleton className="h-32 w-full" />
          <LoadingSkeleton className="h-24 w-full" />
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const isWorking = !!todayStart && !todayEnd;
  const canRegisterEntry = !todayStart || !!todayEnd;
  const canRegisterExit = !todayStart || !!todayEnd;
  const hoursToday = formatHours(todayStart, todayEnd);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <DashboardHeader user={user} onSignOut={signOut} />

      {openEntryFromYesterday.hasOpen && !dismissedYesterdayAlert && (
        <div className="px-4 pt-4">
          <AlertBanner
            message="Você esqueceu de registrar saída ontem"
            type="warning"
            onAction={handleRegisterYesterdayExit}
            actionLabel="Registrar saída"
            onDismiss={() => setDismissedYesterdayAlert(true)}
          />
        </div>
      )}

      <div className="flex-1 px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        <MonthlySummaryCard
          summary={monthlySummary}
          isLoading={monthlyLoading}
          currentMonth={currentMonth}
        />

        <StatusCards isWorking={isWorking} hoursToday={hoursToday} />

        <PunchButtons
          canRegisterEntry={canRegisterEntry}
          canRegisterExit={canRegisterExit}
          isRegistering={isRegistering}
          onRegister={handleRegister}
        />

        <TodayEntries entries={todayEntries} />

        <EntriesList
          data={allEntries}
          isLoading={entriesLoading}
          currentPage={entriesPage}
          onPageChange={handlePageChange}
        />
      </div>

      <BottomNav />
    </main>
  );
}
