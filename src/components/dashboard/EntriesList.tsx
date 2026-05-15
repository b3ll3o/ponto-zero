'use client';

interface TimeEntry {
  id: string;
  type: 'start' | 'end';
  timestamp: string;
  notes: string | null;
}

interface PaginatedEntries {
  entries: TimeEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />;
}

function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
      {icon}
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}

interface EntriesListProps {
  data: PaginatedEntries | null;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function EntriesList({ data, isLoading, currentPage, onPageChange }: EntriesListProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Todas as Batidas
      </h2>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data && data.entries.length > 0 ? (
        <>
          <ul className="space-y-2">
            {data.entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
              >
                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${entry.type === 'start' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                  {entry.type === 'start' ? 'Entrada' : 'Saída'}
                </span>
                <div className="text-right">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 block">
                    {new Date(entry.timestamp).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                Anterior
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {currentPage} / {data.totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= data.totalPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          message="Nenhuma batida registrada"
          icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      )}
    </div>
  );
}
