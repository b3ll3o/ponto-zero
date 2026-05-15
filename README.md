# Ponto Zero — Controle de Jornada de Trabalho

Aplicação mobile-first para registro e controle de jornada de trabalho.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, React 19
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Styling**: Tailwind CSS 4, CSS Variables (dark mode)
- **Testing**: Vitest (unit), Playwright (e2e)

## Getting Started

### 1. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 2. Setup do Supabase

Execute as migrations em `supabase/migrations/` na ordem numerada:

```bash
# Via Supabase Dashboard > SQL Editor, ou:
psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql
# ... repetir para cada migration
```

### 3. Servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build de produção |
| `npm run start` | Produção |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (com coverage) |
| `npm run test:run` | Vitest (CI) |
| `npm run test:e2e` | Playwright E2E |
| `npm run test:ui` | Vitest UI |

## Arquitetura

### Multi-tenant

O sistema é multi-tenant via `company_members`:

- Admin cria empresa e convida membros
- Cada usuário pertence a uma empresa (`company_members.company_id`)
- RLS garante isolamento total entre empresas

### Fluxos Principais

```
Signup → Criar empresa (onboarding) → Dashboard Admin
                                         ↓
Admin gera invite → Funcionário aceita → Dashboard Employee
                                                      ↓
                          Registro de ponto → Relatórios mensais
```

### API Routes

```
POST /api/companies              Criar empresa
GET  /api/companies             Buscar empresa do admin
POST /api/companies/[id]/invite  Gerar invite
GET  /api/companies/[id]/members Listar membros
GET  /api/invite/[token]         Validar invite
POST /api/invite/[token]/accept  Aceitar invite
GET  /api/time-entries           Listar batidas
POST /api/time-entries          Registrar batida
GET  /api/reports/monthly        Resumo mensal (pessoal)
GET  /api/reports/weekly        Resumo semanal (pessoal)
GET  /api/reports/overtime       Horas extras (pessoal)
GET  /api/reports/company       Métricas da empresa (admin)
```

## Testes

- **Cobertura mínima**: 80% (statements, branches, functions, lines)
- **CI**: bloqueia merge se qualquer teste falhar
- **E2E**: Playwright — cobre fluxos críticos (login, registro, dashboard)

## Pasta `openspec/`

Metodologia OpenSpec para especificação de mudanças. SDDs ativos em `openspec/changes/`.

## Pasta `agents/`

Definição dos agentes de IA para workflow Multica (orchestrator, frontend, backend, qa).
