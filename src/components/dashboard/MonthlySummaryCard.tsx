'use client';

interface MonthlySummary {
  year: number;
  month: number;
  totalHours: string;
  totalMinutes: number;
  regularHours: string;
  overtimeHours: string;
  workDays: number;
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

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatInterval(intervalStr: string | null): string {
  if (!intervalStr) return '0h 0m';
  const match = intervalStr.match(/((?:(\d+)\s*hours?)?\s*(?:(\d+)\s*minutes?)?\s*(?:(\d+)\s*seconds?)?)/i);
  if (!match) return '0h 0m';
  let totalMinutes = 0;
  if (match[2]) totalMinutes += parseInt(match[2]) * 60;
  if (match[3]) totalMinutes += parseInt(match[3]);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

interface MonthlySummaryCardProps {
  summary: MonthlySummary | null;
  isLoading: boolean;
  currentMonth: string;
}

export function MonthlySummaryCard({ summary, isLoading, currentMonth }: MonthlySummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Resumo Mensal
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
          {currentMonth}
        </span>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          <LoadingSkeleton className="h-16 w-full" />
          <LoadingSkeleton className="h-16 w-full" />
        </div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {formatMinutes(summary.totalMinutes)}
              </p>
            </div>
            <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Dias úteis</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {summary.workDays}
              </p>
            </div>
          </div>
          {summary.totalMinutes > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Regulares</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {formatMinutes(Math.min(summary.totalMinutes, summary.workDays * 480))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  Extras
                  {summary.overtimeHours !== '0 seconds' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-medium">
                      +
                    </span>
                  )}
                </span>
                <span className={`font-medium ${parseInt(summary.overtimeHours) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {formatInterval(summary.overtimeHours)}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          message="Dados não disponíveis"
          icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
      )}
    </div>
  );
}
