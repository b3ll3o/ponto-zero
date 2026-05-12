# Spec: Histórico com Filtros

## Summary

O sistema deve exibir histórico de registros de ponto com filtros por período e busca por data, com paginação.

## Specification

### 1. Página de Histórico

#### Scenario: Usuário acessa página de histórico
**Given** o usuário está autenticado
**When** o usuário acessa `/dashboard/history`
**Then** o sistema exibe lista de registros de ponto
**And** mostra filtros padrão (hoje)

#### Scenario: Histórico vazio
**Given** o usuário não tem registros de ponto
**When** o sistema busca registros
**Then** exibe mensagem "Nenhum registro encontrado"
**And** mostra dica para registrar ponto

### 2. Filtro por Período

#### Scenario: Filtrar por hoje
**Given** o usuário está na página de histórico
**When** o usuário seleciona filtro "Hoje"
**Then** o sistema exibe apenas registros de hoje

#### Scenario: Filtrar por semana
**Given** o usuário está na página de histórico
**When** o usuário seleciona filtro "Esta Semana"
**Then** o sistema exibe registros da semana atual

#### Scenario: Filtrar por mês
**Given** o usuário está na página de histórico
**When** o usuário seleciona filtro "Este Mês"
**Then** o sistema exibe registros do mês atual

#### Scenario: Filtrar por período custom
**Given** o usuário está na página de histórico
**When** o usuário seleciona filtro "Personalizado"
**And** escolhe data início e data fim
**Then** o sistema exibe registros no período

### 3. Busca por Data

#### Scenario: Buscar data específica
**Given** o usuário está na página de histórico
**When** o usuário digita data no campo de busca
**Then** o sistema filtra registros para aquela data

### 4. Paginação

#### Scenario: Navegar entre páginas
**Given** há mais de 10 registros
**When** o usuário clica em "Próxima"
**Then** o sistema exibe próximos 10 registros
**And** atualiza indicador de página

#### Scenario: Voltar para página anterior
**Given** o usuário está na página 2+
**When** o usuário clica em "Anterior"
**Then** o sistema exibe registros da página anterior

### 5. Ordenação

#### Scenario: Ordenar por data (novo primeiro)
**Given** o usuário está na página de histórico
**When** o usuário clica em ordenar por "Mais recente"
**Then** registros aparecem do mais novo ao mais antigo

#### Scenario: Ordenar por data (antigo primeiro)
**Given** o usuário está na página de histórico
**When** o usuário clica em ordenar por "Mais antigo"
**Then** registros aparecem do mais antigo ao mais novo

## Components

### TimeEntryList
Lista de registros de ponto.

```typescript
interface TimeEntryListProps {
  entries: TimeEntry[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSort?: (sort: 'asc' | 'desc') => void;
}
```

### FilterBar
Barra de filtros.

```typescript
interface FilterBarProps {
  period: 'today' | 'week' | 'month' | 'custom';
  customDateRange?: { start: Date; end: Date };
  onPeriodChange: (period: FilterPeriod) => void;
  onSearch: (date: Date) => void;
}
```

### Pagination
Controles de paginação.

```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}
```

### EmptyState
Estado quando não há registros.

```typescript
interface EmptyStateProps {
  message: string;
  hint?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## API Endpoint

### GET /api/time-entries

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `period` ('today' | 'week' | 'month' | 'custom')
- `startDate` (ISO string, required if period=custom)
- `endDate` (ISO string, required if period=custom)
- `sort` ('asc' | 'desc', default: 'desc')

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "start" | "end",
      "timestamp": "2026-05-12T08:00:00Z",
      "location": "string | null"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 47
  }
}
```

## Frontend UX

### Loading State
- Skeleton com 5 itens
- Animação de pulse

### Error State
- Toast notification
- Retry button

### Mobile Layout
- Filtros em dropdown
- Lista full-width
- Paginação minimalista (anterior/próxima)

## Acceptance Criteria

### Must Have
- [ ] Página `/dashboard/history` funcional
- [ ] Filtros por período funcionando
- [ ] Busca por data
- [ ] Paginação com 10 itens por página
- [ ] Ordenação por data
- [ ] Empty state quando sem registros
- [ ] Loading state durante carregamento
- [ ] Mobile-friendly

### Should Have
- [ ] URL sync com filtros
- [ ] Persistir filtros no localStorage