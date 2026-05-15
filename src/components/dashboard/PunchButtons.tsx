'use client';

interface PunchButtonsProps {
  canRegisterEntry: boolean;
  canRegisterExit: boolean;
  isRegistering: boolean;
  onRegister: (type: 'start' | 'end') => void;
}

export function PunchButtons({ canRegisterEntry, canRegisterExit, isRegistering, onRegister }: PunchButtonsProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Registrar Ponto
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onRegister('start')}
          disabled={isRegistering || !canRegisterEntry}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 py-5 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500 dark:hover:bg-emerald-900/40 transition-all active:scale-95"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span className="font-semibold text-sm">Entrada</span>
        </button>

        <button
          onClick={() => onRegister('end')}
          disabled={isRegistering || !canRegisterExit}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-red-50 py-5 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/40 transition-all active:scale-95"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-semibold text-sm">Saída</span>
        </button>
      </div>
    </div>
  );
}
