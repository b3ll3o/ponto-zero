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

## Directory Structure

```
src/
├── app/                           # Next.js App Router
│   ├── login/
│   │   ├── page.tsx              # Login page
│   │   └── login.test.tsx        # Login tests
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard (mobile-first)
│   ├── auth/confirm/page.tsx     # Supabase auth callback
│   ├── api/
│   │   ├── time-entries/route.ts # GET/POST time entries
│   │   └── reports/
│   │       ├── monthly/route.ts  # Monthly summary
│   │       ├── weekly/route.ts   # Weekly summary
│   │       └── overtime/route.ts  # Overtime report
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page (redirects to dashboard)
├── components/
│   └── ThemeToggle.tsx           # Dark/light mode toggle
├── contexts/
│   └── AuthContext.tsx           # Auth state management (@supabase/ssr)
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client (createClient)
│   │   ├── server.ts            # Server components client
│   │   ├── config.ts            # Supabase config helpers
│   │   └── config.test.ts
│   ├── timeTracking.ts           # Time tracking business logic
│   └── timeTracking.test.ts
└── middleware.ts                  # Route protection

supabase/migrations/
├── 001_initial_schema.sql        # Tables + RLS policies
├── 002_api_functions.sql         # Database functions
└── 002_monthly_hours_overtime.sql # Monthly hours calculation
```

---

## Key Implementation Details

### Authentication Flow

1. User visits `/login`
2. `AuthContext` uses `@supabase/ssr` to manage session
3. `middleware.ts` protects routes: redirects unauthenticated users to `/login`
4. On login success, redirects to `/dashboard`
5. Logout calls `supabase.auth.signOut()` and redirects to `/login`

**AuthContext** (`src/contexts/AuthContext.tsx`):
```typescript
interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}
```

### Database Schema

**Table: `time_entries`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default uuid_generate_v4() |
| user_id | uuid | FK → auth.users, NOT NULL |
| type | text | CHECK IN ('start', 'end') |
| timestamp | timestamptz | NOT NULL, DEFAULT NOW() |
| notes | text | nullable |
| created_at | timestamptz | DEFAULT NOW() |

**Indexes**: `idx_time_entries_user_id`, `idx_time_entries_timestamp`, `idx_time_entries_user_timestamp`

**RLS Policies**: Users can only CRUD their own entries (auth.uid() = user_id)

### Dashboard Features

1. **Resumo Mensal** - Total hours, work days, regular vs overtime
2. **Status do Dia** - Working/not working indicator
3. **Horas Hoje** - Real-time worked hours calculation
4. **Registrar Ponto** - Entry/exit buttons (disabled when inappropriate)
5. **Batidas de Hoje** - Today's entries list
6. **Todas as Batidas** - Paginated historical entries

### Theme System

- Uses `next-themes` for dark/light mode
- `ThemeToggle` component in header
- Theme persisted in localStorage
- Tailwind CSS 4 with CSS variables for theming

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

Copy `.env.local.example` to `.env.local` for local development.

---

## OpenSpec Methodology

Project uses OpenSpec for change specification:

```
openspec/changes/sistema-controle-jornada/
├── proposal.md           # Intent, scope, risks
├── design.md            # Architecture decisions
└── specs/
    ├── auth/spec.md     # Auth specification
    ├── time-tracking/spec.md
    └── dashboard/spec.md
```

---

## Common Tasks

### Run Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm run test         # Unit + Integration (coverage)
npm run test:run     # Unit + Integration (CI mode)
npm run test:e2e     # E2E with Playwright
npm run test:ui      # Vitest UI
```

### Build for Production
```bash
npm run build && npm run start
```

### Lint
```bash
npm run lint
```

---

## Important Notes

1. **Next.js 16**: This is NOT the Next.js you know. APIs and conventions may differ from training data. Read `node_modules/next/dist/docs/` for current documentation.

2. **RLS is critical**: Supabase RLS policies ensure users only access their own data. Never disable RLS in production.

3. **Auth session handling**: Always use `@supabase/ssr` for proper SSR auth. Never create Supabase clients directly.

4. **Mobile-first**: UI is designed for 320px+ screens. Dashboard uses mobile-optimized layout with bottom navigation.

---

## Current State

- ✅ Authentication (login/logout/session)
- ✅ Time entry registration (start/end)
- ✅ Dashboard with daily summary
- ✅ Monthly summary with overtime calculation
- ✅ Dark/light theme toggle
- ✅ Protected routes via middleware
- ✅ Paginated time entries list
- ✅ Basic unit tests
- 🔲 Complete e2e test coverage
- 🔲 Reports (weekly, overtime) - endpoints exist but UI not complete
