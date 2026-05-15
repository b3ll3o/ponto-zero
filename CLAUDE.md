# Context: Ponto Zero

## Project Overview

**Ponto Zero** é uma aplicação mobile-first para registro e controle de jornada de trabalho. Permite que colaboradores registrem entradas/saídas, visualizem saldo de horas (regulares e extras) e acompanhem resumo mensal.

**Stack**: Next.js 16.2.4 + Supabase + Tailwind CSS 4 + Vitest + Playwright

---

## Tech Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI | React | 19.2.4 |
| Linguagem | TypeScript | 5.x |
| Backend | Supabase | @supabase/ssr 0.10.2, @supabase/supabase-js 2.105.3 |
| Styling | Tailwind CSS | 4.x |
| Testing | Vitest + Playwright | Vitest 4.1.5, Playwright 1.59.1 |

---

## Architecture

### Request Lifecycle

```
Browser → proxy.ts (middleware) → Next.js Route
                                ↓
                        AuthContext (client state)
                                ↓
                        Supabase (auth + DB + RLS)
```

### Middleware (proxy.ts)

Roteamento baseado em estado de autenticação e papel do usuário:

| Condição | Redirect |
|----------|----------|
| Sem sessão | → `/login` |
| Com sessão + sem company | → `/onboarding/company` |
| Com sessão + admin | → `/dashboard/admin/*` |
| Com sessão + employee | → `/dashboard/employee` |

---

## Directory Structure

```
src/
├── proxy.ts                         # Middleware (route protection + role routing)
├── app/
│   ├── page.tsx                    # Landing page (marketing)
│   ├── login/page.tsx              # Login + Signup (同一页面)
│   ├── auth/confirm/page.tsx        # Supabase email confirmation callback
│   ├── onboarding/company/page.tsx  # Company creation (first-run wizard)
│   ├── invite/[token]/page.tsx     # Invite acceptance flow
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard redirect (根据role)
│   │   ├── employee/page.tsx       # Employee dashboard (ponto + resumo)
│   │   ├── admin/page.tsx          # Admin dashboard (equipe + métricas)
│   │   ├── history/page.tsx        # Employee history (todas batidas)
│   │   └── reports/
│   │       ├── page.tsx            # Reports redirect
│   │       ├── weekly/page.tsx     # Weekly report
│   │       └── overtime/page.tsx   # Overtime report
│   └── api/
│       ├── time-entries/route.ts   # GET(list) / POST(create)
│       ├── companies/route.ts      # GET / POST (create company)
│       ├── companies/[id]/invite/route.ts    # POST (generate invite)
│       ├── companies/[id]/members/route.ts  # GET (list members)
│       ├── invite/[token]/route.ts           # GET (validate invite)
│       ├── invite/[token]/accept/route.ts    # POST (accept invite)
│       └── reports/
│           ├── monthly/route.ts    # Personal monthly summary
│           ├── weekly/route.ts     # Personal weekly report
│           ├── overtime/route.ts   # Personal overtime report
│           └── company/route.ts    # Admin: company-wide metrics
├── components/
│   ├── ThemeToggle.tsx
│   ├── AlertBanner.tsx
│   ├── CompanyInviteForm.tsx
│   ├── history/                     # History page components
│   ├── notifications/               # Toast + notification system
│   └── reports/                    # Report card + skeleton components
├── contexts/
│   ├── AuthContext.tsx              # Auth state + membership + role
│   └── NotificationContext.tsx      # Toast/notification state
└── lib/
    ├── supabase/
    │   ├── client.ts               # Browser client
    │   ├── server.ts               # Server-side client
    │   └── config.ts               # URL/key helpers
    ├── timeTracking.ts              # Business logic (calculate hours, etc.)
    └── validations.ts               # Validation helpers

supabase/migrations/
├── 001_initial_schema.sql           # time_entries table + RLS
├── 002_api_functions.sql           # DB functions (calculate_daily_hours, etc.)
├── 002_monthly_hours_overtime.sql  # Monthly hours + overtime calculation
├── 003_companies.sql               # companies table
├── 004_company_members.sql          # company_members table
├── 005_time_entries_company.sql    # company_id FK on time_entries
└── 006_company_invites.sql         # company_invites table
```

---

## Flows

### 1. Authentication Flow

```
Landing (/page.tsx)
  └── /login
        ├── Sign In (email + password) → Supabase Auth
        │     └── redirect → /dashboard (middleware roles)
        ├── Sign Up (email + password) → Supabase Auth
        │     └── email confirmation → /auth/confirm → redirect
        └── Esqueci senha → Supabase Auth reset
```

### 2. Onboarding Flow (Primeiro Acesso)

```
Nova conta + sem company membership
  → redirect para /onboarding/company
        └── Preenche dados da empresa (nome, CNPJ, plano)
              └── POST /api/companies
                    └── Cria company + membership (admin)
                          └── redirect → /dashboard/admin
```

### 3. Invite Flow (Admin Convida Funcionário)

```
Admin (/dashboard/admin)
  └── Clica "Convidar" → POST /api/companies/[id]/invite
        └── Gera invite token (UUID, expira em 7 dias)
              └── Exibe link: /invite/[token]

Funcionário acessa /invite/[token]
  └── GET /api/invite/[token] → valida token
        └── POST /api/invite/[token]/accept
              └── Insere company_members (role: employee)
                    └── redirect → /dashboard/employee
```

### 4. Time Entry Flow (Registro de Ponto)

```
Employee (/dashboard/employee)
  └── Clica "Registrar Entrada"
        └── POST /api/time-entries { type: 'start' }
              └── Supabase INSERT (RLS: user_id = auth.uid)
  └── Clica "Registrar Saída"
        └── POST /api/time-entries { type: 'end' }
              └── INSERT (RLS: user_id = auth.uid)
  └── GET /api/reports/monthly
        └── Calcula total horas + extras do mês
```

### 5. Admin Team Management Flow

```
Admin (/dashboard/admin)
  ├── Métricas da empresa (GET /api/reports/company)
  │     └── total_members, active_today, total_hours_month
  ├── Lista membros (GET /api/companies/[id]/members)
  └── Convida funcionário (POST /api/companies/[id]/invite)
```

### 6. Reports Flow

| Endpoint | Quem | Retorno |
|----------|------|---------|
| `GET /api/reports/monthly` | Employee | Horas totais, dias úteis, extras do mês |
| `GET /api/reports/weekly` | Employee | Resumo semanal |
| `GET /api/reports/overtime` | Employee | Banco de horas detalhado |
| `GET /api/reports/company` | Admin | Métricas agregadas da empresa |

---

## Database Schema

### Tabelas Principais

**`companies`** — empresas criadas na plataforma
**`company_members`** — relação usuário ↔ empresa com papel (admin/employee)
**`company_invites`** — convites pendentes (token, email, expiry)
**`time_entries`** — batidas de ponto (user_id, type, timestamp)

### RLS Policies

Todos os acessos ao banco passam por RLS:

| Tabela | Policy | Condição |
|--------|--------|----------|
| `companies` | admin read/write | `admin_user_id = auth.uid()` |
| `company_members` | member read | `user_id = auth.uid()` |
| `company_invites` | read by token | `token = params` |
| `time_entries` | CRUD próprio | `user_id = auth.uid()` |

---

## Key Implementation Details

### AuthContext State

```typescript
interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  companyRole: 'admin' | 'employee' | null;
  companyId: string | null;
  signOut: () => Promise<void>;
  refreshMembership: () => Promise<void>;
}
```

### Theme System

- `next-themes` para dark/light mode
- `ThemeToggle` component no header
- Persistido em localStorage
- CSS variables via Tailwind 4

---

## Conventions

### Test Coverage Requirements (PON-13)

- **Minimum 80%** for statements, branches, functions, and lines
- Must have: unit tests, integration tests, e2e tests
- **All tests must pass** (CI blocks merge on failure)

### Test Structure

| Type | Framework | Location |
|------|-----------|----------|
| Unit | Vitest | `*.test.ts`, `*.test.tsx` |
| Integration | Vitest | Same as unit |
| E2E | Playwright | `e2e/*.spec.ts` |

### Performance Requirements

- Page load: < 5s
- Navigation: < 1s
- Max 20 external requests per page
- Document thresholds in e2e tests

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

---

## Common Tasks

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Unit + Integration (coverage)
npm run test:run     # Unit + Integration (CI mode)
npm run test:e2e     # E2E with Playwright
npm run test:ui      # Vitest UI
```

---

## Current State

- ✅ Landing page (marketing)
- ✅ Login + Signup (Supabase Auth)
- ✅ Email confirmation callback
- ✅ Onboarding (criar empresa)
- ✅ Invite flow (admin gera link, employee aceita)
- ✅ Employee dashboard (registrar ponto + resumo mensal)
- ✅ Employee history (todas batidas com paginação)
- ✅ Admin dashboard (métricas + equipe)
- ✅ Reports (monthly, weekly, overtime, company)
- ✅ Dark/light theme toggle
- ✅ Protected routes via middleware
- ✅ Paginated time entries list
- ✅ Toast notifications
- ✅ Unit tests (184 tests passing)
- ✅ E2E tests (Playwright)
