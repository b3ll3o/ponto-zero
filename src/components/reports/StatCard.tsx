'use client';

import React from 'react';

export interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  variant?: 'positive' | 'negative' | 'neutral';
}

const variantClasses = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-zinc-600 dark:text-zinc-400',
};

export function StatCard({
  label,
  value,
  unit,
  variant = 'neutral',
}: StatCardProps) {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold ${variantClasses[variant]}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
