# Ponto Zero - Agentes

## Fluxo de Desenvolvimento (Multica)

O projeto segue o fluxo **Multica** para orquestrar agentes de IA:

```
Demanda → @orchestrator → SDD (propose → spec → design → tasks)
    ↓
Cria issues no Multica
    ↓
@frontend/@backend/@qa executam as tasks
    ↓
@orchestrator verifica (sdd-verify)
    ↓
Entrega via sdd-archive
```

## Stack

- Next.js 16.2.4 (App Router)
- Supabase (@supabase/ssr + @supabase/supabase-js)
- Tailwind CSS 4
- Vitest + Playwright

## Agentes

| Agente | Role | Especialidade |
|--------|------|---------------|
| `@orchestrator` | Coordenação | SDD, metodologia OpenSpec |
| `@frontend` | UI | Next.js, mobile-first, a11y, pwa |
| `@backend` | Domain | Supabase, DDD, TypeScript |
| `@qa` | Tests | Playwright, Vitest, coverage |

---

## Convenção de Testes (PON-13)

- Cobertura mínima: **80%** para statements, branches, functions e lines
- Deve haver: testes unitários, testes de integração e testes e2e
- **Todos os testes devem sempre passar** (CI bloqueia merge se falhar)

| Type | Framework | Location |
|------|-----------|----------|
| Unit | Vitest | `*.test.ts`, `*.test.tsx` |
| Integration | Vitest | Same as unit |
| E2E | Playwright | `e2e/*.spec.ts` |

```bash
npm run test        # Unit + Integration (com coverage)
npm run test:run    # Unit + Integration (sem coverage, CI)
npm run test:e2e    # E2E com Playwright
npm run test:ui     # UI interativa Vitest
```

---

## Supabase

- Clientes em `src/lib/supabase/`
- Server: `src/lib/supabase/server.ts`
- Browser: `src/lib/supabase/client.ts`
- Proxy (Auth): `src/proxy.ts`
- Auth state: `src/contexts/AuthContext.tsx`

### RLS (Row Level Security)

O banco Supabase utiliza RLS para segurança multi-tenant:

- `time_entries`: usuário só acessa suas próprias batidas
- `companies`: admin só acessa sua própria empresa
- `company_members`: usuário só vê seus próprios memberships
- `company_invites`: acesso por token (sem RLS do auth)

Empresa é isolada via `company_id` em `company_members` e `company_invites`.

---

## OpenSpec

O projeto segue a metodologia OpenSpec para especificação:

- Propostas em `openspec/changes/<nome>/proposal.md`
- Design em `openspec/changes/<nome>/design.md`
- Specs em `openspec/changes/<nome>/specs/<area>/spec.md`

### SDDs Ativos

> Nenhum SDD ativo no momento. O projeto `mvp-multica` foi concluído.

> Os SDDs `auth-basica`, `dashboard-horas`, `database-schema`, `registro-ponto`, `sistema-controle-jornada` e `archive` foram removidos.

---

## Configuração Multica

```bash
# Setup inicial
multica setup

# Comandos úteis
multica issue create      # Criar issue
multica issue list        # Listar issues
multica daemon start      # Iniciar daemon local
multica daemon status     # Status do daemon
```

### Arquivos de Configuração

- `.multica/config.json` - Configuração do projeto no Multica
- `openspec/changes/mvp-multica/AGENTS.md` - Definição dos agentes
- `openspec/changes/mvp-multica/ORCHESTRATOR.md` - Workflow do orchestrator
- `openspec/changes/mvp-multica/ROLES.md` - Roles detalhadas

---

## Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```