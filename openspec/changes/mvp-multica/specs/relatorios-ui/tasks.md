# Tasks: Relatórios UI

## Specs

- [x] `specs/relatorios-ui/proposal.md`
- [x] `specs/relatorios-ui/spec.md`
- [x] `specs/relatorios-ui/design.md`

---

## Implementação

### 1. Backend — APIs (JÁ EXISTEM)

#### 1.1 Verificar APIs existentes

- [x] `GET /api/reports/weekly` existe
- [x] `GET /api/reports/overtime` existe
- [x] `GET /api/reports/monthly` existe

**Status:** ✅ APIs já existem

---

### 2. Frontend — Components

#### 2.1 ReportCard Component

- [x] Criar `src/components/reports/ReportCard.tsx`
- [x] Props: `title`, `value`, `subtitle`, `icon`, `variant`, `trend`
- [x] Estados: loading, default, error
- [x] Variants: default, highlight, compact
- [x] Testes unitários

**Arquivo:** `src/components/reports/ReportCard.tsx`
**Owner:** @frontend
**Status:** ✅ Done

#### 2.2 StatCard Component

- [x] Criar `src/components/reports/StatCard.tsx`
- [x] Props: `label`, `value`, `unit`
- [x] Estados: positive, negative, neutral
- [x] Testes unitários

**Arquivo:** `src/components/reports/StatCard.tsx`
**Owner:** @frontend
**Status:** ✅ Done

#### 2.4 TabNavigation Component

- [x] Criar `src/components/reports/TabNavigation.tsx`
- [x] Props: `tabs`, `activeTab`, `onChange`
- [x] Acessibilidade: role="tablist"

**Arquivo:** `src/components/reports/TabNavigation.tsx`
**Owner:** @frontend
**Status:** ✅ Done

#### 2.5 SkeletonCard Component

- [x] Criar `src/components/reports/SkeletonCard.tsx`
- [x] Props: `variant` (match ReportCard)
- [x] Animação de pulse

**Arquivo:** `src/components/reports/SkeletonCard.tsx`
**Owner:** @frontend
**Status:** ✅ Done

---

### 3. Frontend — Pages

#### 3.1 Reports Main Page

- [x] Criar `src/app/dashboard/reports/page.tsx`
- [x] Tab navigation: Semanal | Horas Extras
- [x] Default: weekly tab
- [x] Fetch data from `/api/reports/weekly`

**Arquivo:** `src/app/dashboard/reports/page.tsx`
**Owner:** @frontend
**Status:** ✅ Done

#### 3.2 Weekly Report View

- [x] Criar `src/app/dashboard/reports/weekly/page.tsx`
- [x] Exibir ReportCard com total de horas
- [x] Exibir lista de dias (inline DayRow)
- [x] Loading state com SkeletonCard
- [x] Error state com retry button

**Arquivo:** `src/app/dashboard/reports/weekly/page.tsx`
**Owner:** @frontend
**Status:** ✅ Done

#### 3.3 Overtime Report View

- [x] Criar `src/app/dashboard/reports/overtime/page.tsx`
- [x] Exibir acumulado de overtime
- [x] Exibir breakdown semanal
- [x] Loading state
- [x] Error state

**Arquivo:** `src/app/dashboard/reports/overtime/page.tsx`
**Owner:** @frontend
**Status:** ✅ Done

---

### 4. Frontend — Navigation

#### 4.1 Add Reports to Bottom Nav

- [x] Modificar `src/app/dashboard/page.tsx`
- [x] Adicionar item "Relatórios" no bottom nav
- [x] Ícone: chart bars
- [x] Link: `/dashboard/reports`

**Arquivo:** `src/app/dashboard/page.tsx`
**Owner:** @frontend
**Status:** ✅ Done

---

### 5. Testes

#### 5.1 Unit Tests

- [x] `ReportCard.test.tsx` - DONE
- [x] `StatCard.test.tsx` - DONE
- [x] `TabNavigation.test.tsx` - DONE
- [x] `SkeletonCard.test.tsx` - DONE

**Owner:** @qa
**Status:** ✅ Done

---

### 6. Verificação

- [x] `npm run build` passa
- [x] `npm run lint` passa
- [x] `npm run test` passa
- [x] `npm run test:e2e` passa
- [x] Coverage >= 80%

---

## Task Metadata

```yaml
sdd: relatorios-ui
spec_file: specs/relatorios-ui/spec.md
design_file: specs/relatorios-ui/design.md
priority: high
status: in_progress
```

---

## Dependencies

- PON-001 (e2e-coverage) ✅ - Must be complete first

---

## Progress

```
[ 3/24 ] tarefas completas (specs)

✅ Backend:
  - 1.1 APIs existentes       [COMPLETO]

🔲 Frontend Components:
  - 2.1 ReportCard           [PENDING]
  - 2.2 StatCard            [PENDING]
  - 2.3 DayRow              [PENDING]
  - 2.4 TabNavigation        [PENDING]
  - 2.5 SkeletonCard        [PENDING]

🔲 Frontend Pages:
  - 3.1 Reports Page         [PENDING]
  - 3.2 Weekly View        [PENDING]
  - 3.3 Overtime View      [PENDING]

🔲 Navigation:
  - 4.1 Bottom Nav         [PENDING]

🔲 Testes:
  - 5.1 Unit Tests         [PENDING]
  - 5.2 Integration       [PENDING]
  - 5.3 E2E                [PENDING]

🔲 Verificação:
  - Build, Lint, Tests      [PENDING]
```

---

## Owners

| Component | Owner |
|-----------|-------|
| Components | @frontend |
| Pages | @frontend |
| Navigation | @frontend |
| Unit Tests | @qa |
| E2E Tests | @qa |