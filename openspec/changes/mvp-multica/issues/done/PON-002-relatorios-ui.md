# Issue: PON-002 - Relatórios UI

## Assignee
@frontend, @backend, @qa

## Task Reference
PON-002

## SDD Reference
`specs/relatorios-ui/`

## Description

Implementar páginas de relatórios com visualização de horas trabalhadas semanalmente e horas extras acumuladas.

## Goals

1. Criar components de relatório (`ReportCard`, `StatCard`, `DayRow`, `TabNavigation`, `SkeletonCard`)
2. Criar página `/dashboard/reports` com tabs (Semanal | Horas Extras)
3. Criar view de relatório semanal (`/dashboard/reports/weekly`)
4. Criar view de relatório de overtime (`/dashboard/reports/overtime`)
5. Adicionar item "Relatórios" no bottom nav
6. Implementar testes unitários e e2e

## Criteria

### Components
- [ ] `ReportCard.tsx` com props: title, value, subtitle, icon, variant, trend
- [ ] `StatCard.tsx` com props: label, value, unit
- [ ] `DayRow.tsx` com props: date, entries, total
- [ ] `TabNavigation.tsx` acessível (role="tablist")
- [ ] `SkeletonCard.tsx` com animação pulse

### Pages
- [ ] `/dashboard/reports` - Main page com tab navigation
- [ ] `/dashboard/reports/weekly` - Weekly report view
- [ ] `/dashboard/reports/overtime` - Overtime report view

### Navigation
- [ ] Bottom nav item "Relatórios" em `/dashboard`

### Tests
- [ ] Unit tests para todos components
- [ ] Integration tests para pages
- [ ] E2E tests para navegação

### Verification
- [ ] Build passa
- [ ] Lint passa
- [ ] Tests passam (unit + e2e)
- [ ] Coverage >= 80%

## Dependencies

- PON-001 (e2e-coverage) ✅ - COMPLETO

## Sub-tasks

| ID | Task | Owner | Status |
|----|------|-------|--------|
| PON-002-1 | ReportCard component | @frontend | 🔲 |
| PON-002-2 | StatCard component | @frontend | 🔲 |
| PON-002-3 | DayRow component | @frontend | 🔲 |
| PON-002-4 | TabNavigation component | @frontend | 🔲 |
| PON-002-5 | SkeletonCard component | @frontend | 🔲 |
| PON-002-6 | Reports page | @frontend | 🔲 |
| PON-002-7 | Weekly view | @frontend | 🔲 |
| PON-002-8 | Overtime view | @frontend | 🔲 |
| PON-002-9 | Bottom nav | @frontend | 🔲 |
| PON-002-10 | Unit tests | @qa | 🔲 |
| PON-002-11 | E2E tests | @qa | 🔲 |
| PON-002-12 | Verification | @orchestrator | 🔲 |

## Status
🔲 IN PROGRESS

## Created
2026-05-12