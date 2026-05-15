'use client';

interface StatusCardsProps {
  isWorking: boolean;
  hoursToday: string;
}

export function StatusCards({ isWorking, hoursToday }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
        <div className="text-center space-y-2">
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${isWorking ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
            {isWorking ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Status</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {isWorking ? 'Em turno' : 'Fora do turno'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Horas hoje</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {hoursToday}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
