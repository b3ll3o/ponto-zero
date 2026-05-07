'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Basic email format check (more robust than just length)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Password must be at least 6 characters (Supabase minimum)
  const isPasswordStrong = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordStrong;

  // Check if returning from email confirmation
  useEffect(() => {
    const checkConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard');
      }
    };
    checkConfirmation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha para entrar.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('E-mail ou senha incorretos');
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Double-guard: also validate here in case button was clicked despite disabled state
    if (!email || !password) {
      setError('Preencha e-mail e senha para criar uma conta.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Digite um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    setIsSignUp(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError('Erro ao criar conta. Tente novamente.');
      setIsLoading(false);
      setIsSignUp(false);
      return;
    }

    setSuccessMessage('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
    setIsLoading(false);
    setIsSignUp(false);
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Digite o seu e-mail para reenviar a confirmação.');
      return;
    }
    setIsResending(true);
    setError('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      setError('Erro ao reenviar e-mail. Tente novamente.');
    } else {
      setResendSent(true);
      setSuccessMessage(`E-mail de confirmação reenviado para ${email}.`);
    }
    setIsResending(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white text-xl font-bold">
              P0
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Login
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Entre para registrar sua jornada
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-sm">
              {successMessage}
              {successMessage.includes('Verifique') && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  className="ml-2 underline hover:no-underline disabled:opacity-50"
                >
                  {isResending ? 'Reenviando...' : 'Reenviar e-mail'}
                </button>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || isSignUp || !isFormValid}
              className="w-full flex justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && !isSignUp ? 'Entrando...' : 'Entrar'}
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading || isSignUp || !isFormValid}
              className="w-full flex justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              {isLoading && isSignUp ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          <Link href="/" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
            ← Voltar para home
          </Link>
        </p>
      </div>
    </main>
  );
}