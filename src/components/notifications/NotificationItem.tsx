'use client';

import type { Notification } from '@/contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const iconPaths = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const iconColors = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-amber-500 dark:text-amber-400',
  info: 'text-blue-500 dark:text-blue-400',
};

const bgColors = {
  success: 'bg-green-100 dark:bg-green-900/50',
  error: 'bg-red-100 dark:bg-red-900/50',
  warning: 'bg-amber-100 dark:bg-amber-900/50',
  info: 'bg-blue-100 dark:bg-blue-900/50',
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'agora mesmo';
  }
  if (diffMin < 60) {
    return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffHour < 24) {
    return `há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
  }
  if (diffDay < 7) {
    return `há ${diffDay} ${diffDay === 1 ? 'dia' : 'dias'}`;
  }
  return date.toLocaleDateString('pt-BR');
}

export function NotificationItem({ notification, onMarkAsRead, onDismiss }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`relative flex gap-3 p-3 rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
      }`}
      role="listitem"
    >
      {!notification.read && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
      )}
      <button
        onClick={handleClick}
        className="flex-shrink-0 mt-0.5"
        aria-label={notification.title}
      >
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${bgColors[notification.type]}`}>
          <svg
            className={`h-4 w-4 ${iconColors[notification.type]}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[notification.type]} />
          </svg>
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {notification.title}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {formatRelativeTime(notification.timestamp)}
        </p>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
