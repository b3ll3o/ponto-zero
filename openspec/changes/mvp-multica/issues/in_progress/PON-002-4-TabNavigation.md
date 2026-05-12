# Issue: PON-002-4 - TabNavigation Component

## Assignee
@frontend

## Task Reference
PON-002-4

## Parent Issue
`in_progress/PON-002-relatorios-ui.md`

## Description
Criar component TabNavigation para切换 entre visualizações de relatório.

## Spec Reference
`specs/relatorios-ui/spec.md` - Component Inventory

## Acceptance Criteria

### Must Have
- [ ] Props: `tabs`, `activeTab`, `onChange`
- [ ] Acessibilidade: `role="tablist"`, `role="tab"`
- [ ] Keyboard navigation
- [ ] Active state visual
- [ ] Dark mode support

### Implementation

```typescript
interface Tab {
  id: string;
  label: string;
  href?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}
```

## Files to Create
- `src/components/reports/TabNavigation.tsx`
- `src/components/reports/TabNavigation.test.tsx`

## Verification
- [ ] `npm run test` passes
- [ ] Keyboard navigation works
- [ ] Acessibilidade verificada
- [ ] Dark mode works

## Status
🔲 TODO

## Labels
`frontend`, `high`, ` PON-002`