'use client';

import React from 'react';

export type FilterPeriod = 'today' | 'week' | 'month' | 'custom';

interface FilterBarProps {
  value: FilterPeriod;
  onChange: (period: FilterPeriod) => void;
  onSearch?: (date: Date) => void;
  customDateRange?: {
    start: string;
    end: string;
  };
  onCustomDateChange?: (range: { start: string; end: string }) => void;
}

const periods: { id: FilterPeriod; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'custom', label: 'Personalizado' },
];

export function FilterBar({
  value,
  onChange,
  customDateRange,
  onCustomDateChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => onChange(period.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              value === period.id
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {value === 'custom' && onCustomDateChange && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Data início
            </label>
            <input
              type="date"
              value={customDateRange?.start || ''}
              onChange={(e) =>
                onCustomDateChange({
                  start: e.target.value,
                  end: customDateRange?.end || e.target.value,
                })
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Data fim
            </label>
            <input
              type="date"
              value={customDateRange?.end || ''}
              onChange={(e) =>
                onCustomDateChange({
                  start: customDateRange?.start || e.target.value,
                  end: e.target.value,
                })
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
