# Issue: PON-002-5 - SkeletonCard Component

## Assignee
@frontend

## Task Reference
PON-002-5

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar component SkeletonCard para estados de loading.

## Spec Reference
`specs/relatorios-ui/spec.md` - Loading States

## Acceptance Criteria

### Must Have
- [ ] Props: `variant` (match ReportCard variants)
- [ ] Animação pulse
- [ ] Dark mode support
- [ ] Variants: `default`, `highlight`, `compact`

### Implementation

```typescript
interface SkeletonCardProps {
  variant?: 'default' | 'highlight' | 'compact';
}
```

## Files to Create
- `src/components/reports/SkeletonCard.tsx`
- `src/components/reports/SkeletonCard.test.tsx`

## Verification
- [ ] `npm run test` passes
- [ ] Animation works
- [ ] All variants
- [ ] Dark mode works

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`