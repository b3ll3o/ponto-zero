'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const supabase = createClient();

      // Get the token from URL params (Supabase callback)
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const type = params.get('type');

      if (!token || type !== 'signup') {
        setStatus('error');
        setErrorMessage('Link de confirmação inválido.');
        return;
      }

      // Exchange the token for a session
      const { error } = await supabase.auth.verifyOtp({
        type: 'signup',
        token,
      });

      if (error) {
        setStatus('error');
        setErrorMessage(error.message || 'Erro ao confirmar e-mail.');
        return;
      }

      setStatus('success');
    };

    confirmEmail();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white text-xl font-bold mx-auto">
          P0
        </div>

        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Confirmando e-mail...
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Aguarde um momento enquanto confirmamos o seu e-mail.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              E-mail confirmado!
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              A sua conta foi criada com sucesso. Já pode fazer login.
            </p>
            <Link
              href="/login"
              className="inline-flex justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors mt-4"
            >
              Ir para Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mx-auto">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Erro na confirmação
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {errorMessage || 'Não foi possível confirmar o seu e-mail.'}
            </p>
            <div className="space-y-3 mt-4">
              <Link
                href="/login"
                className="inline-flex justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
              >
                Voltar para Login
              </Link>
              <p className="text-sm text-zinc-500">
                O link pode ter expirado. Tente fazer login — a conta pode já estar confirmada.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
