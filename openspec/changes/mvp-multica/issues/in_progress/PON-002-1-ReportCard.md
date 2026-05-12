# Issue: PON-002-1 - ReportCard Component

## Assignee
@frontend

## Task Reference
PON-002-1

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar component ReportCard para display de métricas de relatório.

## Spec Reference
`specs/relatorios-ui/spec.md` - Component Inventory

## Design Reference
`specs/relatorios-ui/design.md` - ReportCard Component

## Acceptance Criteria

### Must Have
- [ ] Props: `title`, `value`, `subtitle`, `icon`, `variant`, `trend`
- [ ] Variants: `default`, `highlight`, `compact`
- [ ] Trend indicator: `up`, `down`, `neutral`
- [ ] Loading state com skeleton
- [ ] Error state
- [ ] Dark mode support

### Implementation

```typescript
interface ReportCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'compact';
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}
```

## Files to Create
- `src/components/reports/ReportCard.tsx`
- `src/components/reports/ReportCard.test.tsx`

## Verification
- [ ] `npm run test` passes
- [ ] Component renders correctly
- [ ] All variants work
- [ ] Loading state displays
- [ ] Dark mode works

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`