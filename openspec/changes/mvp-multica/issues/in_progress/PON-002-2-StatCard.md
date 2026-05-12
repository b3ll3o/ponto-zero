# Issue: PON-002-2 - StatCard Component

## Assignee
@frontend

## Task Reference
PON-002-2

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar component StatCard para display de estatísticas simples.

## Spec Reference
`specs/relatorios-ui/spec.md` - Component Inventory

## Acceptance Criteria

### Must Have
- [ ] Props: `label`, `value`, `unit`
- [ ] States: `positive`, `negative`, `neutral`
- [ ] Compact display
- [ ] Dark mode support

### Implementation

```typescript
interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  variant?: 'positive' | 'negative' | 'neutral';
}
```

## Files to Create
- `src/components/reports/StatCard.tsx`
- `src/components/reports/StatCard.test.tsx`

## Verification
- [ ] `npm run test` passes
- [ ] All variants render correctly
- [ ] Dark mode works

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`