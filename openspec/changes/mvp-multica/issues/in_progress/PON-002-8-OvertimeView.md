# Issue: PON-002-8 - Overtime Report View

## Assignee
@frontend

## Task Reference
PON-002-8

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar view de relatório de horas extras (overtime).

## Spec Reference
`specs/relatorios-ui/spec.md` - Relatório de Horas Extras

## Design Reference
`specs/relatorios-ui/design.md` - Overtime Report

## Acceptance Criteria

### Must Have
- [ ] Display: Total overtime acumulado
- [ ] Display: Meta horas extras
- [ ] Display: Evolução semanal
- [ ] Display: Projeção fim do mês
- [ ] Loading state
- [ ] Error state com retry
- [ ] Mobile-first responsive

## Files to Create
- `src/app/dashboard/reports/overtime/page.tsx`

## Dependencies
- PON-002-1 (ReportCard)
- PON-002-2 (StatCard)
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