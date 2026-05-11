'use client';

import { useState } from 'react';

interface CompanyInviteFormProps {
  companyId: string;
  onInviteSent?: () => void;
}

export function CompanyInviteForm({ companyId, onInviteSent }: CompanyInviteFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'E-mail inválido' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/companies/${companyId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao enviar convite' });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Funcionário adicionado com sucesso!' });
      setEmail('');
      onInviteSent?.();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao enviar convite. Tente novamente.' });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail do funcionário"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !email}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Enviando...' : 'Convidar'}
        </button>
      </div>
      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}