# Design: Histórico com Filtros

## Overview

Este SDD implementa página de histórico de ponto com filtros e paginação.

## Architecture

### Page Structure

```
/dashboard/history
├── FilterBar (period selector, date search)
├── TimeEntryList
│   ├── TimeEntryCard (repeated)
│   └── EmptyState (when no entries)
└── Pagination
```

### Files to Modify/Create

```
src/app/dashboard/history/page.tsx    # Nova página
src/app/api/time-entries/route.ts    # Adicionar query params
src/components/history/
├── TimeEntryList.tsx               # Lista de entradas
├── TimeEntryList.test.tsx
├── FilterBar.tsx                   # Barra de filtros
├── FilterBar.test.tsx
├── Pagination.tsx                  # Controles de paginação
├── Pagination.test.tsx
└── EmptyState.tsx                   # Estado vazio
```

## Components

### TimeEntryList

```typescript
'use client';

import { TimeEntry } from '@/lib/types';

interface TimeEntryListProps {
  entries: TimeEntry[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sort: 'asc' | 'desc') => void;
}
```

- Renderiza lista de TimeEntryCard ou EmptyState
- Skeleton loading state
- Props para paginação e ordenação

### TimeEntryCard

```typescript
interface TimeEntryCardProps {
  entry: TimeEntry;
}
```

- Ícone indicando start/end
- Data/hora formatada
- Badge de localização (se disponível)

### FilterBar

```typescript
interface FilterPeriod {
  type: 'today' | 'week' | 'month' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

interface FilterBarProps {
  value: FilterPeriod;
  onChange: (period: FilterPeriod) => void;
  onSearch?: (date: Date) => void;
}
```

- Dropdown para período (hoje/semana/mês/custom)
- Date picker para custom
- Search input para data específica

### Pagination

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}
```

- "Anterior" / "Próxima" buttons
- Indicador "Página X de Y"
- Items count "Mostrando X-Y de Z"

### EmptyState

```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

- Ilustração ou ícone
- Mensagem amigável
- CTA button opcional

## API Changes

### GET /api/time-entries

Adicionar query parameter handling:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const period = searchParams.get('period') || 'today';
  const sort = searchParams.get('sort') || 'desc';

  // Calculate date range based on period
  const dateRange = calculateDateRange(period, searchParams);

  // Query with filters
  const { data, count } = await supabase
    .from('time_entries')
    .select('*', { count: 'exact' })
    .gte('timestamp', dateRange.start)
    .lte('timestamp', dateRange.end)
    .order('timestamp', { ascending: sort === 'asc' })
    .range((page - 1) * limit, page * limit - 1);

  return Response.json({
    data,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    }
  });
}
```

### calculateDateRange

```typescript
function calculateDateRange(period: string, params: URLSearchParams) {
  const now = new Date();
  let start: Date, end: Date = now;

  switch (period) {
    case 'today':
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      start = new Date(now.setDate(now.getDate() - dayOfWeek));
      start.setHours(0, 0, 0, 0);
      end = new Date();
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date();
      break;
    case 'custom':
      start = new Date(params.get('startDate'));
      end = new Date(params.get('endDate'));
      break;
  }

  return { start, end };
}
```

## Navigation

Adicionar ao bottom nav:

```typescript
// In bottom navigation component
{
  label: 'Histórico',
  href: '/dashboard/history',
  icon: ClockIcon
}
```

## Styling

### TimeEntryCard
```
bg-white dark:bg-gray-800
border border-gray-200 dark:border-gray-700
rounded-lg p-4
```

### FilterBar
```
sticky top-0 z-10
bg-gray-50 dark:bg-gray-900
border-b border-gray-200 dark:border-gray-700
p-4
```

### Pagination
```
flex items-center justify-between
border-t border-gray-200 dark:border-gray-700
p-4
```

## Testing Strategy

### Unit Tests
- FilterBar: period changes
- Pagination: page navigation
- TimeEntryList: empty/loading states

### Integration Tests
- Full filter flow
- Pagination with API

## Dependencies

- @frontend: Components e página
- @backend: API endpoint enhancement
- @qa: E2E tests para filtros