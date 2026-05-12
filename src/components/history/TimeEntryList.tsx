'use client';

import React from 'react';
import { TimeEntry } from '@/lib/timeTracking';
import { TimeEntryCard } from './TimeEntryCard';
import { EmptyState } from './EmptyState';

interface TimeEntryListProps {
  entries: TimeEntry[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sort: 'asc' | 'desc') => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-start gap-4">
            <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimeEntryList({
  entries,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  sortOrder = 'desc',
  onSortChange,
  onPageChange,
}: TimeEntryListProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title="Nenhum registro encontrado"
        description="Comece a registrar seu ponto para ver o histórico aqui."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {entries.length} registro{entries.length !== 1 ? 's' : ''}
        </span>
        {onSortChange && (
          <button
            onClick={() => onSortChange(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {sortOrder === 'desc' ? 'Mais recente' : 'Mais antigo'}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {sortOrder === 'desc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              )}
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <TimeEntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeEntryList;
