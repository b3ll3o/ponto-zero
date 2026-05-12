'use client';

import React from 'react';
import { TimeEntry } from '@/lib/timeTracking';

interface TimeEntryCardProps {
  entry: TimeEntry;
}

const PlayIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
  </svg>
);

const StopIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

export function TimeEntryCard({ entry }: TimeEntryCardProps) {
  const isStart = entry.type === 'start';

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(entry.timestamp));

  const formattedTime = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(entry.timestamp));

  return (
    <div className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className={`flex-shrink-0 rounded-full p-2 ${isStart ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'}`}>
        {isStart ? <PlayIcon /> : <StopIcon />}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {isStart ? 'Entrada' : 'Saída'}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {formattedTime}
          </span>
        </div>

        {entry.notes && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {entry.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default TimeEntryCard;
