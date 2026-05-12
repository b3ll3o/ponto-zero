'use client';

import React from 'react';

export interface SkeletonCardProps {
  variant?: 'default' | 'highlight' | 'compact';
}

const variantClasses = {
  default: 'bg-zinc-200 dark:bg-zinc-800',
  highlight: 'bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900',
  compact: 'bg-transparent',
};

export function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="flex flex-col gap-1 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse">
          <div className="h-3 w-12 rounded bg-zinc-300 dark:bg-zinc-700" />
          <div className="h-5 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse rounded-lg ${variantClasses[variant]} p-4`}>
      <div className="h-4 w-20 rounded bg-zinc-300 dark:bg-zinc-700 mb-3" />
      <div className="h-8 w-24 rounded bg-zinc-300 dark:bg-zinc-700 mb-2" />
      <div className="h-3 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
    </div>
  );
}

export default SkeletonCard;