# Issue: PON-002-6 - Reports Main Page

## Assignee
@frontend

## Task Reference
PON-002-6

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar página principal de relatórios com tab navigation.

## Spec Reference
`specs/relatorios-ui/spec.md` - Navigation

## Design Reference
`specs/relatorios-ui/design.md` - Pages

## Acceptance Criteria

### Must Have
- [ ] Page: `/dashboard/reports`
- [ ] Tab navigation: Semanal | Horas Extras
- [ ] Default tab: Semanal
- [ ] Fetch data from `/api/reports/weekly`
- [ ] Header com título e período
- [ ] Mobile-first responsive
- [ ] Loading state
- [ ] Error state com retry

## Files to Create
- `src/app/dashboard/reports/page.tsx`

## Dependencies
- PON-002-4 (TabNavigation) must be complete

## Verification
- [ ] Page loads at `/dashboard/reports`
- [ ] Tab navigation works
- [ ] Data displays correctly
- [ ] Mobile responsive
- [ ] `npm run build` passes

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`