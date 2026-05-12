# Issue: PON-002-3 - DayRow Component

## Assignee
@frontend

## Task Reference
PON-002-3

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar component DayRow para exibir linha de dia no relatório semanal.

## Spec Reference
`specs/relatorios-ui/spec.md` - Component Inventory

## Acceptance Criteria

### Must Have
- [ ] Props: `date`, `entries`, `total`
- [ ] Display: data, horário entrada/saída, total de horas
- [ ] States: `normal`, `weekend`, `holiday`
- [ ] Indicação de overtime
- [ ] Dark mode support

### Implementation

```typescript
interface DayRowProps {
  date: string;
  entries: TimeEntry[];
  total: string;
  variant?: 'normal' | 'weekend' | 'holiday';
}
```

## Files to Create
- `src/components/reports/DayRow.tsx`
- `src/components/reports/DayRow.test.tsx`

## Verification
- [ ] `npm run test` passes
- [ ] All states render correctly
- [ ] Dark mode works

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`