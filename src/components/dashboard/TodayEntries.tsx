'use client';

interface TimeEntry {
  id: string;
  type: 'start' | 'end';
  timestamp: string;
  notes: string | null;
}

function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
      {icon}
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}

interface TodayEntriesProps {
  entries: TimeEntry[];
}

export function TodayEntries({ entries }: TodayEntriesProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Batidas de Hoje
      </h2>
      {entries.length === 0 ? (
        <EmptyState
          message="Nenhuma batida registrada hoje"
          icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
            >
              <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${entry.type === 'start' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                {entry.type === 'start' ? 'Entrada' : 'Saída'}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
