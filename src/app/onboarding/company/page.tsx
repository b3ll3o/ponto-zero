'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

const PLAN_OPTIONS = [
  {
    id: 'free',
    name: 'Grátis',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para freelancers e autônomos',
    features: ['Até 1 colaborador', 'Registro ilimitado', 'Relatórios básicos'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29',
    period: '/mês',
    description: 'Para pequenas empresas',
    features: ['Até 10 colaboradores', 'Registro ilimitado', 'Relatórios avançados', 'Suporte prioritário'],
  },
  {
    id: 'business',
    name: 'Empresarial',
    price: 'R$ 99',
    period: '/mês',
    description: 'Para médias e grandes empresas',
    features: ['Colaboradores ilimitados', 'Tudo do plano Pro', 'Gerente de conta dedicado'],
  },
];

export default function CompanyOnboardingPage() {
  const { user, isLoading: authLoading, refreshMembership } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 14) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const validateCNPJ = (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, '');
    return digits.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Razão Social é obrigatória');
      return;
    }

    if (!validateCNPJ(cnpj)) {
      setError('CNPJ inválido');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName.trim(),
          cnpj: cnpj.replace(/\D/g, ''),
          plan_type: selectedPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar empresa');
        setIsSubmitting(false);
        return;
      }

      await refreshMembership();
      router.push('/dashboard/admin');
    } catch {
      setError('Erro ao criar empresa. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
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
            P0
          </div>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Criar Empresa
          </span>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Cadastro da Empresa
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Complete os dados para criar sua empresa no sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Dados da Empresa
              </h2>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Razão Social <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Empresa ABC Ltda"
                  required
                />
              </div>

              <div>
                <label htmlFor="tradingName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Nome Fantasia <span className="text-zinc-400">(opcional)</span>
                </label>
                <input
                  id="tradingName"
                  type="text"
                  value={tradingName}
                  onChange={(e) => setTradingName(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="ABC Contabilidade"
                />
              </div>

              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  id="cnpj"
                  type="text"
                  value={cnpj}
                  onChange={handleCNPJChange}
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="00.000.000/0001-00"
                  maxLength={18}
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Escolha seu Plano
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                {PLAN_OPTIONS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-xl p-4 text-left transition-all ${
                      selectedPlan === plan.id
                        ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {plan.id === 'pro' && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {plan.name}
                      </span>
                      {selectedPlan === plan.id && (
                        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {plan.price}
                      </span>
                      <span className="text-sm text-zinc-500">{plan.period}</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                      {plan.description}
                    </p>
                    <ul className="space-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <svg className="h-3 w-3 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-center text-zinc-500 dark:text-zinc-400">
                Pagamento não implementado no MVP. Seleção de plano apenas para demonstração.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Criando empresa...' : 'Criar Empresa'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}