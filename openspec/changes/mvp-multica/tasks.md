# Tasks — MVP Multica (Ponto Zero)

## Visão Geral

Tasks globais do MVP. Tasks específicas de cada SDD estão em `specs/[sdd-name]/tasks.md`.

---

## SDDs do MVP

| SDD | Tasks | Status |
|-----|-------|--------|
| e2e-coverage | `specs/e2e-coverage/tasks.md` | ✅ done |
| relatorios-ui | `specs/relatorios-ui/tasks.md` | ✅ done |
| validacao-business-rules | `specs/validacao-business-rules/tasks.md` | ✅ done |
| historico-filtros | `specs/historico-filtros/tasks.md` | ✅ done |
| notificacoes-lembretes | `specs/notificacoes-lembretes/tasks.md` | ✅ done |

---

## Progresso Total

```
Total de SDDs: 5
Completos: 5 ✅
Em progresso: 0 🔄
Pendentes: 0 🔲
```

---

## Fase 1: Cobertura de Testes ✅

### 1.1 E2E Coverage ✅

- [x] SDD completo em `specs/e2e-coverage/`
- [x] spec.md, design.md, tasks.md
- [x] Testes E2E implementados (home, login, theme)
- [x] Coverage >= 80%
- [x] Verificação completa (build, lint, test)

**Status:** ✅ DONE
**Issue:** `issues/done/PON-001-e2e-coverage.md`

---

## Fase 2: Relatórios UI ✅

### 2.1 Relatórios UI ✅

- [x] SDD criado em `specs/relatorios-ui/`
- [x] proposal.md, spec.md, design.md
- [x] Components (ReportCard, StatCard, TabNavigation, SkeletonCard)
- [x] Pages (reports, weekly, overtime)
- [x] Bottom nav integration
- [x] Testes
- [x] Verificação

**Status:** ✅ DONE
**Issue:** `issues/done/PON-002-relatorios-ui.md`
**Owners:** @frontend, @backend, @qa

---

## Fase 3: Funcionalidades

### 3.1 Validação Business Rules ✅

- [x] SDD em `specs/validacao-business-rules/`
- [x] proposal.md, spec.md, design.md, tasks.md
- [x] Implementação (validations.ts, API, AlertBanner)
- [x] Testes unitários (12 novos testes)

**Status:** ✅ DONE
**Issue:** `issues/done/PON-003-validacao-business-rules.md`

### 3.2 Histórico com Filtros ✅

- [x] SDD em `specs/historico-filtros/`
- [x] proposal.md, spec.md, design.md, tasks.md
- [x] Implementação (EmptyState, TimeEntryCard, TimeEntryList, FilterBar, Pagination)
- [x] History page (/dashboard/history)
- [x] Bottom nav atualizado
- [x] API com filtros e paginação

**Status:** ✅ DONE
**Issue:** `issues/done/PON-004-historico-filtros.md`

### 3.3 Notificações e Lembretes ✅

- [x] SDD em `specs/notificacoes-lembretes/`
- [x] proposal.md, spec.md, design.md, tasks.md
- [x] Implementação (NotificationContext, Toast, ToastContainer, NotificationBell, NotificationPanel)
- [x] Reminder logic (ponto aberto, registro)
- [x] Testes unitários (39 novos)

**Status:** ✅ DONE
**Issue:** `issues/done/PON-005-notificacoes-lembretes.md`

---

## Como Usar Este Documento

1. Tasks globais estão aqui
2. Tasks específicas de cada SDD estão em `specs/[nome]/tasks.md`
3. Issues em `issues/` são criados pelo orchestrator

---

## Workflow

```
1. Orchestrator cria SDD (specs/ + design.md + tasks.md)
       ↓
2. Distribui tasks via issues/open/
       ↓
3. Agent executa → issues/in_progress/ → issues/done/
       ↓
4. Orchestrator verifica (build, test, lint)
```

---

## Task Metadata

```yaml
change: mvp-multica
version: 1.0.0
created: 2026-05-11
owner: @orchestrator
project: ponto-zero
last_updated: 2026-05-12
```