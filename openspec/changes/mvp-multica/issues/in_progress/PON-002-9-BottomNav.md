# Issue: PON-002-9 - Bottom Navigation Update

## Assignee
@frontend

## Task Reference
PON-002-9

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Adicionar item "Relatórios" ao bottom navigation do dashboard.

## Spec Reference
`specs/relatorios-ui/spec.md` - Navigation

## Design Reference
`specs/relatorios-ui/design.md` - Bottom Nav Integration

## Acceptance Criteria

### Must Have
- [ ] Novo item no bottom nav do dashboard
- [ ] Ícone: chart bars (svg fornecido no design.md)
- [ ] Label: "Relatórios"
- [ ] Link: `/dashboard/reports`
- [ ] Estado ativo quando na página de relatórios
- [ ] Dark mode support

## Files to Modify
- `src/app/dashboard/page.tsx`

## Dependencies
- PON-002-6 (Reports Page) - pode ser feito em paralelo

## Verification
- [ ] Navigation works
- [ ] Active state displays
- [ ] Dark mode works
- [ ] `npm run build` passes

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`