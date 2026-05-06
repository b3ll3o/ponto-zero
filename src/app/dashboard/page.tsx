'use client';

import { useEffect, useState } from 'react';
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

export default function DashboardPage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [todayStart, setTodayStart] = useState<string | null>(null);
  const [todayEnd, setTodayEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchTodayEntries();
    }
  }, [user]);

  const fetchTodayEntries = async () => {
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
      setEntries(data);
      const starts = data.filter((e) => e.type === 'start');
      const ends = data.filter((e) => e.type === 'end');
      setTodayStart(starts[0]?.timestamp || null);
      setTodayEnd(ends[0]?.timestamp || null);
    }
    setIsLoading(false);
  };

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
    }
    setIsRegistering(false);
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
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Carregando...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

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

      <div className="flex-1 px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <div className="text-center space-y-3">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isWorking ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {isWorking ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Status</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {isWorking ? 'Em turno' : 'Fora do turno'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Horas hoje</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {calculateHours()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Registrar Ponto
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleRegister('start')}
              disabled={isRegistering || !!todayStart}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 py-6 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-600 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold">Entrada</span>
            </button>

            <button
              onClick={() => handleRegister('end')}
              disabled={isRegistering || !todayStart || !!todayEnd}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-red-50 py-6 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/50 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold">Saída</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Últimas Batidas
          </h2>
          {entries.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              Nenhuma batida registrada hoje
            </p>
          ) : (
            <ul className="space-y-3">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${entry.type === 'start' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
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
      </div>

      <nav className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-around">
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