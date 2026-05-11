'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface InviteInfo {
  company_id: string;
  email: string;
  expires_at: string;
  company_name?: string;
}

export default function InvitePage() {
  const { user, isLoading: authLoading, refreshMembership } = useAuth();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    const fetchInvite = async () => {
      const response = await fetch(`/api/invite/${token}`);
      if (response.ok) {
        const data = await response.json();
        setInvite(data);
      } else {
        setError('Convite inválido ou expirado');
      }
      setIsLoading(false);
    };

    fetchInvite();
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!user) {
      router.push(`/login?redirect=/invite/${token}`);
      return;
    }

    setIsAccepting(true);
    setError('');

    try {
      const response = await fetch(`/api/invite/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao aceitar convite');
        setIsAccepting(false);
        return;
      }

      setSuccess(true);
      await refreshMembership();

      setTimeout(() => {
        router.push('/dashboard/employee');
      }, 1500);
    } catch {
      setError('Erro ao aceitar convite. Tente novamente.');
      setIsAccepting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </main>
    );
  }

  if (error && !invite) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Convite Inválido
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {error}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-600 transition-colors"
          >
            Ir para Login
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Bem-vindo à Equipe!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Você foi adicionado à empresa com sucesso.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Redirecionando...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white text-xl font-bold">
              P0
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Você foi convidado!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Você recebeu um convite para fazer parte de uma empresa no Ponto Zero.
          </p>
        </div>

        {invite && (
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Empresa</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {invite.company_name || 'Empresa'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">E-mail</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {invite.email}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAcceptInvite}
          disabled={isAccepting || !invite}
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAccepting ? 'Aceitando...' : user ? 'Aceitar Convite' : 'Entrar para Aceitar'}
        </button>

        {!user && (
          <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Você precisa estar logado para aceitar o convite.
          </p>
        )}
      </div>
    </main>
  );
}