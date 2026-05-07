import Link from "next/link";

const features = [
  {
    title: "Registro Simples",
    description: "Batidas de ponto com um clique no início e fim do expediente. Sem complicação.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "emerald",
  },
  {
    title: "Horas Extras",
    description: "Cálculo automático de extras e banco de horas. Você sempre sabe onde está.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "blue",
  },
  {
    title: "Relatórios Mensais",
    description: "Gere relatórios detalhados para fechamento de ponto em segundos.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "purple",
  },
  {
    title: "100% Online",
    description: "Acesse de qualquer lugar, qualquer dispositivo. Nada para instalar.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "orange",
  },
  {
    title: "Seguro",
    description: "Seus dados protegidos com criptografia. Conformidade com LGPD.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "green",
  },
  {
    title: "Suporte Rápido",
    description: "Equipe pronta para ajudar via chat e e-mail.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "pink",
  },
];

const steps = [
  { number: "1", title: "Cadastre-se", description: "Crie sua conta em 30 segundos" },
  { number: "2", title: "Registre", description: "Marque entrada e saída diariamente" },
  { number: "3", title: "Acompanhe", description: "Veja relatórios e saldos em tempo real" },
];

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "/mês",
    description: "Para freelancers e autônomos",
    features: [
      "Até 1 colaborador",
      "Registro ilimitado",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
    cta: "Começar Grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "/mês",
    description: "Para pequenas empresas",
    features: [
      "Até 10 colaboradores",
      "Registro ilimitado",
      "Relatórios avançados",
      "Exportação PDF/Excel",
      "Suporte prioritário",
      "Integrações (Slack, Teams)",
    ],
    cta: "Assinar Pro",
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "R$ 99",
    period: "/mês",
    description: "Para médias e grandes empresas",
    features: [
      "Colaboradores ilimitados",
      "Tudo do plano Pro",
      "API de integração",
      "White-label",
      "Gerente de conta dedicado",
      "SLA de 99.9%",
    ],
    cta: "Falar com Vendas",
    highlight: false,
  },
];

const colorMap: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", darkBg: "dark:bg-emerald-900/50", darkText: "dark:text-emerald-400" },
  blue: { bg: "bg-blue-100", text: "text-blue-600", darkBg: "dark:bg-blue-900/50", darkText: "dark:text-blue-400" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", darkBg: "dark:bg-purple-900/50", darkText: "dark:text-purple-400" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", darkBg: "dark:bg-orange-900/50", darkText: "dark:text-orange-400" },
  green: { bg: "bg-green-100", text: "text-green-600", darkBg: "dark:bg-green-900/50", darkText: "dark:text-green-400" },
  pink: { bg: "bg-pink-100", text: "text-pink-600", darkBg: "dark:bg-pink-900/50", darkText: "dark:text-pink-400" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white text-lg font-bold shadow-sm">
              P0
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Ponto Zero
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Funcionalidades
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Como Funciona
            </a>
            <a href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Preços
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Novo: Relatórios mensais automatizados
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
                Controle de Jornada
                <br />
                <span className="text-emerald-500">Sem Complicação</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                O sistema de ponto eletrônico feito para quem valoriza simplicidade.
                Registre suas horas, acompanhe extras e gere relatórios em poucos cliques.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="w-full sm:w-auto rounded-xl bg-emerald-500 px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all hover:shadow-emerald-500/40"
                >
                  Começar Gratuitamente
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto rounded-xl border border-zinc-300 bg-white px-8 py-4 text-center text-base font-semibold text-zinc-700 shadow-lg hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Ver Como Funciona
                </Link>
              </div>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
                Sem cartão de crédito · Configure em 2 minutos
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Tudo que você precisa
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Funcionalidades pensadas para facilitar o dia a dia
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const colors = colorMap[feature.color];
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`}>
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 py-20 bg-white dark:bg-zinc-900/50 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Como Funciona
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Três passos para controlar sua jornada
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-zinc-300 dark:from-emerald-500 dark:to-zinc-700" />
                  )}
                  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white text-xl font-bold shadow-lg shadow-emerald-500/30 z-10">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Planos e Preços
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Escolha o plano ideal para você
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 ${
                    plan.highlight
                      ? "bg-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400"
                      : "bg-white dark:bg-zinc-900 shadow-lg"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-4 py-1 text-sm font-semibold text-white shadow-sm">
                      Mais Popular
                    </div>
                  )}
                  <h3 className={`text-xl font-semibold ${plan.highlight ? "text-white" : "text-zinc-900 dark:text-zinc-50"}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-zinc-900 dark:text-zinc-50"}`}>
                      {plan.price}
                    </span>
                    <span className={plan.highlight ? "text-emerald-200" : "text-zinc-500 dark:text-zinc-400"}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 ${plan.highlight ? "text-emerald-100" : "text-zinc-600 dark:text-zinc-400"}`}>
                    {plan.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg
                          className={`h-5 w-5 shrink-0 ${plan.highlight ? "text-emerald-300" : "text-emerald-500"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlight ? "text-white" : "text-zinc-600 dark:text-zinc-400"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-white text-emerald-600 hover:bg-emerald-50"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 bg-emerald-500 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mt-4 text-lg text-emerald-100">
              Junte-se a milhares de profissionais que já simplificaram seu controle de ponto.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-emerald-600 shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Criar Minha Conta Grátis
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white text-lg font-bold">
                P0
              </div>
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Ponto Zero
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Sobre</a>
              <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100">Funcionalidades</a>
              <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100">Preços</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Privacidade</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Termos</a>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © 2024 Ponto Zero. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
