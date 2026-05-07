'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

// Loading skeleton component
function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />;
}

// Empty state component
function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
      {icon}
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}

// Format interval string to human readable
function formatInterval(intervalStr: string | null): string {
  if (!intervalStr) return '0h 0m';
  // Handle PostgreSQL interval format like "8 hours 30 minutes" or "0 seconds"
  const match = intervalStr.match(/((?:(\d+)\s*hours?)?\s*(?:(\d+)\s*minutes?)?\s*(?:(\d+)\s*seconds?)?)/i);
  if (!match) return '0h 0m';
  
  let totalMinutes = 0;
  if (match[2]) totalMinutes += parseInt(match[2]) * 60;
  if (match[3]) totalMinutes += parseInt(match[3]);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

// Format minutes to human readable
function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export default function DashboardPage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [todayStart, setTodayStart] = useState<string | null>(null);
  const [todayEnd, setTodayEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Monthly summary state
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  
  // Paginated entries state
  const [allEntries, setAllEntries] = useState<PaginatedEntries | null>(null);
  const [entriesPage, setEntriesPage] = useState(1);
  const [entriesLoading, setEntriesLoading] = useState(false);
  
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

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTodayEntries();
       
      fetchMonthlySummary();
       
      fetchAllEntries(1);
    }
  }, [user, fetchTodayEntries, fetchMonthlySummary, fetchAllEntries]);

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

  const calculateHours = () => {
    if (!todayStart) return '0h 0m';
    const start = new Date(todayStart);
    const end = todayEnd ? new Date(todayEnd) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const isWorking = todayStart && !todayEnd;

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

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Sair
          </button>
        </div>
      </header>

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

        {/* Monthly Summary Card */}
        <div className="rounded-2xl bg-white p-5 shadow-lg dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Resumo Mensal
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
              {currentMonth}
            </span>
          </div>
          {monthlyLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <LoadingSkeleton className="h-16 w-full" />
              <LoadingSkeleton className="h-16 w-full" />
            </div>
          ) : monthlySummary ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {formatMinutes(monthlySummary.totalMinutes)}
                  </p>
                </div>
                <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Dias úteis</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {monthlySummary.workDays}
                  </p>
                </div>
              </div>
              {monthlySummary.totalMinutes > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Regulares</span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {formatMinutes(Math.min(monthlySummary.totalMinutes, monthlySummary.workDays * 480))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      Extras
                      {monthlySummary.overtimeHours !== '0 seconds' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-medium">
                          +
                        </span>
                      )}
                    </span>
                    <span className={`font-medium ${parseInt(monthlySummary.overtimeHours) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {formatInterval(monthlySummary.overtimeHours)}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              message="Dados não disponíveis"
              icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
          )}
        </div>

        {/* Today's Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
            <div className="text-center space-y-2">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${isWorking ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {isWorking ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Status</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {isWorking ? 'Em turno' : 'Fora do turno'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
            <div className="text-center space-y-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Horas hoje</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {calculateHours()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Punch Buttons - Improved Mobile Layout */}
        <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Registrar Ponto
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRegister('start')}
              disabled={isRegistering || !!todayStart}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 py-5 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500 dark:hover:bg-emerald-900/40 transition-all active:scale-95"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold text-sm">Entrada</span>
            </button>

            <button
              onClick={() => handleRegister('end')}
              disabled={isRegistering || !todayStart || !!todayEnd}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-red-50 py-5 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/40 transition-all active:scale-95"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold text-sm">Saída</span>
            </button>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Batidas de Hoje
          </h2>
          {todayEntries.length === 0 ? (
            <EmptyState 
              message="Nenhuma batida registrada hoje"
              icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          ) : (
            <ul className="space-y-2">
              {todayEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${entry.type === 'start' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {entry.type === 'start' ? 'Entrada' : 'Saída'}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* All Entries with Pagination */}
        <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Todas as Batidas
          </h2>
          {entriesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <LoadingSkeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : allEntries && allEntries.entries.length > 0 ? (
            <>
              <ul className="space-y-2">
                {allEntries.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                  >
                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${entry.type === 'start' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                      {entry.type === 'start' ? 'Entrada' : 'Saída'}
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 block">
                        {new Date(entry.timestamp).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Pagination */}
              {allEntries.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => handlePageChange(entriesPage - 1)}
                    disabled={entriesPage <= 1}
                    className="px-3 py-1.5 text-sm rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {entriesPage} / {allEntries.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(entriesPage + 1)}
                    disabled={entriesPage >= allEntries.totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              message="Nenhuma batida registrada"
              icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
          )}
        </div>
      </div>

      <nav className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-around max-w-lg mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Relatórios</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
