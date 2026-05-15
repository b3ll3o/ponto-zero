'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export function useTimeEntryRegistration(userId: string | null) {
  const supabase = createClient();

  const [isRegistering, setIsRegistering] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const registerEntry = useCallback(async (todayStart: boolean, todayEnd: boolean) => {
    if (!userId) return;

    if (!todayStart || !!todayEnd) {
      // Already has an open entry
      addToast({ type: 'error', title: 'Erro', message: 'Já existe uma entrada aberta.' });
      return;
    }

    setIsRegistering(true);
    const { error } = await supabase.from('time_entries').insert({
      user_id: userId,
      type: 'start',
      timestamp: new Date().toISOString(),
    });

    if (error) {
      addToast({ type: 'error', title: 'Erro', message: 'Erro ao registrar entrada.' });
    } else {
      addToast({ type: 'success', title: 'Sucesso', message: 'Entrada registrada!' });
    }
    setIsRegistering(false);
  }, [userId, addToast, supabase]);

  const registerExit = useCallback(async (todayStart: string | null) => {
    if (!userId) return;

    if (!todayStart) {
      addToast({ type: 'error', title: 'Erro', message: 'Não há entrada registrada para hoje.' });
      return;
    }

    setIsRegistering(true);
    const { error } = await supabase.from('time_entries').insert({
      user_id: userId,
      type: 'end',
      timestamp: new Date().toISOString(),
    });

    if (error) {
      addToast({ type: 'error', title: 'Erro', message: 'Erro ao registrar saída.' });
    } else {
      addToast({ type: 'success', title: 'Sucesso', message: 'Saída registrada!' });
    }
    setIsRegistering(false);
  }, [userId, addToast, supabase]);

  const registerYesterdayExit = useCallback(async (
    lastEntryTimestamp: string,
    onSuccess: () => void
  ) => {
    if (!userId) return;

    setIsRegistering(true);
    const yesterdayCloseTime = new Date(lastEntryTimestamp);
    yesterdayCloseTime.setHours(23, 59, 59, 0);

    const { error } = await supabase.from('time_entries').insert({
      user_id: userId,
      type: 'end',
      timestamp: yesterdayCloseTime.toISOString(),
    });

    if (error) {
      addToast({ type: 'error', title: 'Erro', message: 'Erro ao registrar saída de ontem.' });
    } else {
      addToast({ type: 'success', title: 'Sucesso', message: 'Saída de ontem registrada!' });
      onSuccess();
    }
    setIsRegistering(false);
  }, [userId, addToast, supabase]);

  return {
    isRegistering,
    toasts,
    addToast,
    removeToast,
    registerEntry,
    registerExit,
    registerYesterdayExit,
  };
}
