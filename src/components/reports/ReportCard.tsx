'use client';

import React from 'react';

export interface ReportCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'compact';
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const TrendUpIcon = () => (
  <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
  </svg>
);

const TrendNeutralIcon = () => (
  <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const RetryIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 p-4">
      <div className="h-4 w-20 rounded bg-zinc-300 dark:bg-zinc-700 mb-3" />
      <div className="h-8 w-24 rounded bg-zinc-300 dark:bg-zinc-700 mb-2" />
      <div className="h-3 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
    </div>
  );
}

function ErrorCard({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-medium">Erro ao carregar</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          <RetryIcon />
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function ReportCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  trend,
  loading = false,
  error = false,
  onRetry,
}: ReportCardProps) {
  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return <ErrorCard onRetry={onRetry} />;
  }

  const variantClasses = {
    default: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
    highlight: 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-zinc-900 border border-emerald-200 dark:border-emerald-800',
    compact: 'bg-transparent border-0 p-0',
  };

  const TrendIcon = trend === 'up' ? TrendUpIcon : trend === 'down' ? TrendDownIcon : TrendNeutralIcon;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        {icon && <div className="text-zinc-400 dark:text-zinc-500">{icon}</div>}
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{title}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{value}</span>
            {trend && <TrendIcon />}
          </div>
          {subtitle && <p className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={variantClasses[variant]}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</span>
            {trend && <TrendIcon />}
          </div>
          {subtitle && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-emerald-500 dark:text-emerald-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportCard;
