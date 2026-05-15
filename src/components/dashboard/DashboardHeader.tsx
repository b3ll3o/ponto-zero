'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import type { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export function DashboardHeader({ user, onSignOut }: DashboardHeaderProps) {
  return (
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
          onClick={onSignOut}
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
