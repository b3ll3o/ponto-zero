# Issue: PON-002-7 - Weekly Report View

## Assignee
@frontend

## Task Reference
PON-002-7

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar view de relatório semanal.

## Spec Reference
`specs/relatorios-ui/spec.md` - Relatório Semanal

## Design Reference
`specs/relatorios-ui/design.md` - Weekly Report

## Acceptance Criteria

### Must Have
- [ ] Display: Total horas semana
- [ ] Display: Total horas extras
- [ ] Display: Dias trabalhados
- [ ] Display: Média horas/dia
- [ ] Lista de dias (DayRow)
- [ ] Loading state (SkeletonCard)
- [ ] Empty state
- [ ] Error state com retry
- [ ] Mobile-first responsive

## Files to Create
- `src/app/dashboard/reports/weekly/page.tsx`

## Dependencies
- PON-002-1 (ReportCard)
- PON-002-3 (DayRow)
- PON-002-5 (SkeletonCard)

## Verification
- [ ] Data displays correctly
- [ ] All states work
- [ ] Mobile responsive
- [ ] `npm run build` passes

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`