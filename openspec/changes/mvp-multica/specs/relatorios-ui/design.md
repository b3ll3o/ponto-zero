# Design: Relatórios UI

## Overview

Este SDD implementa a interface de relatórios para visualização de horas trabalhadas e horas extras.

## Architecture

### Pages

```
src/app/dashboard/reports/
├── page.tsx              # Main reports page with tabs
├── weekly/
│   └── page.tsx         # Weekly report view
└── overtime/
    └── page.tsx         # Overtime report view
```

### Components

```
src/components/reports/
├── ReportCard.tsx        # Card component for metrics
├── StatCard.tsx         # Small stat display
├── DayRow.tsx           # Day entry row
├── TabNavigation.tsx    # Tab switcher
└── SkeletonCard.tsx     # Loading skeleton
```

### API Integration

| Endpoint | Usage |
|----------|-------|
| `GET /api/reports/weekly` | Fetch weekly report data |
| `GET /api/reports/overtime` | Fetch overtime data |
| `GET /api/reports/monthly` | Already used in dashboard |

### Data Models

```typescript
interface WeeklyReport {
  week: number;
  year: number;
  startDate: string;
  endDate: string;
  totalMinutes: number;
  regularMinutes: number;
  overtimeMinutes: number;
  workDays: number;
  days: DayData[];
}

interface DayData {
  date: string;
  dayOfWeek: string;
  entries: TimeEntry[];
  totalMinutes: number;
  overtimeMinutes: number;
}

interface OvertimeReport {
  month: number;
  year: number;
  totalOvertimeMinutes: number;
  regularMinutes: number;
  weeklyBreakdown: WeeklyOvertime[];
}

interface WeeklyOvertime {
  week: number;
  overtimeMinutes: number;
}
```

## Design System

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `overtime-positive` | emerald-500 | emerald-400 | Horas extras positivas |
| `overtime-warning` | amber-500 | amber-400 | Próximo do limite |
| `overtime-negative` | red-500 | red-400 | Ultrapassou limite |

### Typography

- Headings: `font-bold text-zinc-900 dark:text-zinc-50`
- Body: `text-sm text-zinc-600 dark:text-zinc-400`
- Values: `text-2xl font-bold`

### Spacing

- Card padding: `p-4` or `p-5`
- Card gap: `gap-4`
- Section gap: `space-y-6`

## Implementation Details

### ReportCard Component

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

### Tab Navigation

```typescript
const tabs = [
  { id: 'weekly', label: 'Semanal', href: '/dashboard/reports' },
  { id: 'overtime', label: 'Horas Extras', href: '/dashboard/reports/overtime' },
];
```

### Bottom Nav Integration

Adicionar ao bottom nav existente em `src/app/dashboard/page.tsx`:

```typescript
<Link href="/dashboard/reports" className={cn(
  "flex flex-col items-center gap-1",
  isActive ? "text-emerald-600" : "text-zinc-400"
)}>
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
  <span className="text-xs">Relatórios</span>
</Link>
```

## Dependencies

- `@/lib/timeTracking` - existing time tracking utilities
- `/api/reports/weekly` - existing API
- `/api/reports/overtime` - existing API
- Tailwind CSS 4 - already in project

## Testing Strategy

### Unit Tests
- `ReportCard.test.tsx`
- `StatCard.test.tsx`
- `DayRow.test.tsx`

### Integration Tests
- Page loads with correct data
- Tab switching works
- Navigation works

### E2E Tests
- Navigate to reports
- View weekly report
- View overtime report

## File Changes

### New Files
- `src/app/dashboard/reports/page.tsx`
- `src/app/dashboard/reports/weekly/page.tsx`
- `src/app/dashboard/reports/overtime/page.tsx`
- `src/components/reports/ReportCard.tsx`
- `src/components/reports/StatCard.tsx`
- `src/components/reports/DayRow.tsx`
- `src/components/reports/TabNavigation.tsx`
- `src/components/reports/SkeletonCard.tsx`
- `src/app/dashboard/reports/reports.test.tsx`

### Modified Files
- `src/app/dashboard/page.tsx` - Add Reports nav item
- `src/app/dashboard/layout.tsx` - (if exists, add nav)

## Verification

| Check | Command |
|-------|---------|
| Build | `npm run build` |
| Lint | `npm run lint` |
| Unit Tests | `npm run test` |
| E2E Tests | `npm run test:e2e` |
| Coverage | `npm run test` (check >= 80%) |