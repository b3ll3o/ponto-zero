# Tasks: Histórico com Filtros

## Specs

- [x] `specs/historico-filtros/proposal.md`
- [x] `specs/historico-filtros/spec.md`
- [x] `specs/historico-filtros/design.md`

---

## Implementação

### 1. Backend — API Enhancement

#### 1.1 API com filtros e paginação

- [ ] Modificar `src/app/api/time-entries/route.ts`
- [ ] Adicionar query params: `page`, `limit`, `period`, `startDate`, `endDate`, `sort`
- [ ] Implementar `calculateDateRange()`
- [ ] Retornar `pagination` object
- [ ] Testes de integração

**Arquivo:** `src/app/api/time-entries/route.ts`
**Owner:** @backend
**Status:** 🔲 Pending

---

### 2. Frontend — Components

#### 2.1 EmptyState Component

- [ ] Criar `src/components/history/EmptyState.tsx`
- [ ] Props: `title`, `description`, `action`
- [ ] Estilo mobile-friendly
- [ ] Dark mode support

**Arquivo:** `src/components/history/EmptyState.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.2 TimeEntryCard Component

- [ ] Criar `src/components/history/TimeEntryCard.tsx`
- [ ] Props: `entry: TimeEntry`
- [ ] Ícone start/end
- [ ] Data/hora formatada
- [ ] Badge localização

**Arquivo:** `src/components/history/TimeEntryCard.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.3 TimeEntryList Component

- [ ] Criar `src/components/history/TimeEntryList.tsx`
- [ ] Props: `entries`, `loading`, `onPageChange`, etc
- [ ] Loading skeleton state
- [ ] Empty state integration
- [ ] Testes unitários

**Arquivo:** `src/components/history/TimeEntryList.tsx`
**Arquivo:** `src/components/history/TimeEntryList.test.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.4 FilterBar Component

- [ ] Criar `src/components/history/FilterBar.tsx`
- [ ] Dropdown: hoje/semana/mês/custom
- [ ] Date pickers para custom
- [ ] Search input para data
- [ ] Testes unitários

**Arquivo:** `src/components/history/FilterBar.tsx`
**Arquivo:** `src/components/history/FilterBar.test.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.5 Pagination Component

- [ ] Criar `src/components/history/Pagination.tsx`
- [ ] Props: `currentPage`, `totalPages`, `totalItems`, `onPageChange`
- [ ] Botões anterior/próxima
- [ ] Indicador de página
- [ ] Testes unitários

**Arquivo:** `src/components/history/Pagination.tsx`
**Arquivo:** `src/components/history/Pagination.test.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 3. Frontend — Page

#### 3.1 History Page

- [ ] Criar `src/app/dashboard/history/page.tsx`
- [ ] Estado: entries, loading, filters, pagination
- [ ] Fetch data com filtros
- [ ] Integrar FilterBar, TimeEntryList, Pagination
- [ ] URL sync (opcional)
- [ ] Bottom nav: adicionar "Histórico"

**Arquivo:** `src/app/dashboard/history/page.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 4. Integration

#### 4.1 Bottom Navigation

- [ ] Adicionar link "Histórico" ao bottom nav
- [ ] Ícone: ClockIcon ou similar

**Arquivo:** `src/components/BottomNav.tsx` (ou similar)
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 5. Testes

#### 5.1 E2E Tests

- [ ] Testar navegação para histórico
- [ ] Testar filtros
- [ ] Testar paginação

**Arquivo:** `e2e/history.spec.ts`
**Owner:** @qa
**Status:** 🔲 Pending

---

### 6. Verificação

- [ ] `npm run build` passa
- [ ] `npm run lint` passa
- [ ] `npm run test` passa
- [ ] `npm run test:e2e` passa

---

## Task Metadata

```yaml
sdd: historico-filtros
spec_file: specs/historico-filtros/spec.md
design_file: specs/historico-filtros/design.md
priority: medium
status: in_progress
```

---

## Progress

```
[ 3/23 ] tarefas completas (specs)

🔲 Backend:
  - 1.1 API com filtros           [PENDING]

🔲 Frontend Components:
  - 2.1 EmptyState               [PENDING]
  - 2.2 TimeEntryCard            [PENDING]
  - 2.3 TimeEntryList           [PENDING]
  - 2.4 FilterBar               [PENDING]
  - 2.5 Pagination              [PENDING]

🔲 Frontend Page:
  - 3.1 History Page            [PENDING]

🔲 Integration:
  - 4.1 Bottom Nav             [PENDING]

🔲 Testes:
  - 5.1 E2E                    [PENDING]

🔲 Verificação:
  - Build, Lint, Tests        [PENDING]
```

---

## Owners

| Component | Owner |
|-----------|-------|
| Backend (API) | @backend |
| Frontend (components, page) | @frontend |
| E2E Tests | @qa |