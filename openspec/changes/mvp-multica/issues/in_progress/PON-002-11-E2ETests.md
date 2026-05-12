# Issue: PON-002-11 - E2E Tests

## Assignee
@qa

## Task Reference
PON-002-11

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Implementar testes E2E para o fluxo de relatórios.

## Spec Reference
`specs/relatorios-ui/spec.md` - E2E Tests

## Acceptance Criteria

### Must Have
- [ ] `e2e/reports.spec.ts`
- [ ] Navegar para relatórios
- [ ] Visualizar relatório semanal
- [ ] Visualizar relatório de overtime
- [ ] Trocar entre tabs
- [ ] Responsividade (mobile viewport)

### Performance
- [ ] Page load < 5s
- [ ] Navigation < 1s

## Dependencies
- PON-002-6 (Reports Page)
- PON-002-7 (Weekly View)
- PON-002-8 (Overtime View)
- PON-002-9 (Bottom Nav)

## Verification
- [ ] `npm run test:e2e` passes
- [ ] Performance thresholds met
- [ ] Mobile test passes

## Status
🔲 TODO

## Labels
`qa`, `high`, ` PON-002`