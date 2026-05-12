# Agentes - Ponto Zero

## Stack do Projeto

- **Framework**: Next.js 16.2.4 (App Router)
- **Backend**: Supabase (@supabase/ssr + @supabase/supabase-js)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Playwright
- **Metodologia**: OpenSpec

## Estrutura de Agentes

| Agente | Role | Especialidade | Skills |
|--------|------|---------------|--------|
| `@orchestrator` | Coordenação | SDD, metodologia OpenSpec | multica, sdd-* |
| `@frontend` | UI | Next.js, mobile-first, a11y, pwa | nextjs-16, mobile-first, a11y, pwa |
| `@backend` | Domain | Supabase, DDD, TypeScript | supabase, ddd, typescript |
| `@qa` | Tests | Playwright, Vitest, coverage | testing |

## Fluxo de Desenvolvimento

```
Demanda do usuário
       ↓
@orchestrator → SDD completo
  ├── propose    (proposal.md)
  ├── spec       (specs/*/spec.md)
  ├── design     (design.md)
  └── tasks      (tasks.md)
       ↓
Cria issues no Multica (@frontend, @backend, @qa)
       ↓
Agentes executam tasks
       ↓
@orchestrator verifica (sdd-verify)
       ↓
Entrega via sdd-archive
```

## Arquitetura de Diretórios

```
openspec/changes/mvp-multica/
├── AGENTS.md              # Este arquivo
├── ORCHESTRATOR.md        # Workflow do orchestrator
├── ROLES.md               # Definição detalhada de cada role
├── tasks.md               # Tasks pendentes do MVP
└── issues/                # Issues do Multica
    ├── open/
    ├── in_progress/
    ├── review/
    ├── done/
    └── blocked/
```

## Tasks Ativas (PON-*)

| Task | Prioridade | Descrição |
|------|------------|-----------|
| PON-001 | High | Cobertura E2E Completa |
| PON-002 | High | Relatórios UI (Weekly, Overtime) |
| PON-003 | High | Validação de Business Rules |
| PON-004 | Medium | Histórico com Filtros |
| PON-005 | Medium | Notificações e Lembretes |

## Comandos

```bash
# Multica
multica setup                    # Setup inicial
multica issue create             # Criar issue
multica issue list               # Listar issues
multica daemon start             # Iniciar daemon

# OpenSpec
npm run test                     # Unit + Integration
npm run test:e2e                 # E2E
npm run lint                     # Lint
```