import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white text-3xl font-bold">
              P0
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ponto Zero
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Controle de Jornada de Trabalho
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Registre seus horários</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Batidas de ponto simples e rápidas no início e fim do expediente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Acompanhe horas extras</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Visualize saldo de horas, extras e banco de horas em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Relatórios detalhados</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Gere relatórios mensais para fechamento de ponto
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
          >
            Entrar
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Novo por aqui? Crie uma conta na página de login.
          </p>
        </div>
      </div>
    </main>
  );
}