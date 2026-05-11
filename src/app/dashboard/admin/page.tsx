'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CompanyInviteForm } from '@/components/CompanyInviteForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  plan_type: 'free' | 'pro' | 'business';
}

interface Member {
  id: string;
  user_id: string;
  role: 'admin' | 'employee';
  created_at: string;
  email: string | null;
}

interface CompanyMetrics {
  company: Company;
  period: { year: number; month: number };
  metrics: {
    total_members: number;
    active_employees_today: number;
    total_hours_this_month: string;
    total_minutes_this_month: number;
    work_days_in_month: number;
  };
}

function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />;
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

const PLAN_LABELS = {
  free: { label: 'Grátis', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  pro: { label: 'Pro', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
  business: { label: 'Empresarial', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
};

export default function AdminDashboardPage() {
  const { user, companyId, companyRole, isLoading: authLoading, signOut } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [metrics, setMetrics] = useState<CompanyMetrics['metrics'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!user || !companyId) return;

    const [companyRes, membersRes, metricsRes] = await Promise.all([
      fetch('/api/companies'),
      fetch(`/api/companies/${companyId}/members`),
      fetch('/api/reports/company'),
    ]);

    if (companyRes.ok) {
      const companyData = await companyRes.json();
      setCompany(companyData);
    }

    if (membersRes.ok) {
      const membersData = await membersRes.json();
      setMembers(membersData);
    }

    if (metricsRes.ok) {
      const metricsData = await metricsRes.json();
      setMetrics(metricsData.metrics);
    }

    setIsLoading(false);
  }, [user, companyId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (!authLoading && user && companyRole !== 'admin') {
      router.push('/dashboard/employee');
      return;
    }

    if (user && companyId && companyRole === 'admin') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [authLoading, user, companyRole, companyId, router, fetchData]);

  const handleInviteSent = () => {
    fetchData();
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

  if (!user || !company) {
    return null;
  }

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
            P0
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {company.name}
            </p>
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_LABELS[company.plan_type].color}`}>
              {PLAN_LABELS[company.plan_type].label}
            </span>
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
            Dashboard Admin
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
            {currentMonth}
          </p>
        </div>

        {metrics && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900 text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {metrics.total_members}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Funcionários
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {metrics.active_employees_today}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Ativos hoje
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatMinutes(metrics.total_minutes_this_month)}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Horas/mês
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Funcionários
            </h2>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              {showInviteForm ? 'Cancelar' : 'Convidar'}
            </button>
          </div>

          {showInviteForm && (
            <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <CompanyInviteForm companyId={companyId!} onInviteSent={handleInviteSent} />
            </div>
          )}

          {members.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
              Nenhum funcionário cadastrado
            </div>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      {member.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {member.email || 'Usuário'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Desde {new Date(member.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    member.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {member.role === 'admin' ? 'Admin' : 'Funcionário'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <nav className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-around max-w-lg mx-auto">
          <Link href="/dashboard/admin" className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard/employee" className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Ponto</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}