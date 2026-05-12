# Design: Notificações e Lembretes

## Overview

Este SDD implementa sistema de notificações e lembretes para manter usuários informados.

## Architecture

### Notification Flow

```
Action (API success/error)
    ↓
NotificationContext.addNotification()
    ↓
Toast Queue
    ↓
Render Toast
```

### Files to Create

```
src/contexts/
├── NotificationContext.tsx        # Context provider
└── NotificationContext.test.tsx

src/components/notifications/
├── Toast.tsx                     # Toast component
├── Toast.test.tsx
├── NotificationBell.tsx          # Bell icon with badge
├── NotificationPanel.tsx         # Panel with list
└── NotificationItem.tsx          # Individual notification
```

## Components

### NotificationContext

```typescript
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
```

### Toast Component

```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: (id: string) => void;
}
```

**Styles:**
```typescript
const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100',
  warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100'
};
```

### ToastContainer

```typescript
interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}
```

- Position: fixed bottom-4 right-4 (desktop), bottom-4 center (mobile)
- Max 3 toasts visible at once
- Stack with gap-2
- z-50

### NotificationBell

```typescript
interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}
```

- Bell icon (Heroicons)
- Badge with unread count (red circle)
- Position in header or top-right

### NotificationPanel

```typescript
interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}
```

- Slide in from right (desktop) or bottom (mobile)
- Header with "Notificações" title and "Marcar todas como lida"
- Scrollable list of NotificationItem
- Empty state when no notifications

### NotificationItem

```typescript
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}
```

- Icon based on type
- Title and message
- Timestamp (relative: "há 5 minutos")
- Unread indicator (blue dot)
- Dismiss button

## Reminder Logic

### Check for Open Entry

```typescript
// In dashboard page, useEffect
useEffect(() => {
  const checkOpenEntry = async () => {
    const hasOpen = await hasOpenEntry(userId);
    if (hasOpen) {
      const lastEntry = await getLastEntry(userId);
      const hoursSinceEntry = (Date.now() - new Date(lastEntry.timestamp).getTime()) / (1000 * 60 * 60);
      if (hoursSinceEntry >= 4) {
        addNotification({
          type: 'warning',
          title: 'Ponto aberto',
          message: 'Você esqueceu de registrar saída?',
          action: {
            label: 'Registrar saída',
            onClick: () => handleRegister('end')
          }
        });
      }
    }
  };

  const interval = setInterval(checkOpenEntry, 30 * 60 * 1000); // Every 30 minutes
  return () => clearInterval(interval);
}, []);
```

### Check for Missing Entry

```typescript
// In dashboard page, useEffect
useEffect(() => {
  const checkMissingEntry = async () => {
    const now = new Date();
    const hour = now.getHours();
    const reminderHours = [9, 11, 14, 16]; // 9am, 11am, 2pm, 4pm

    if (reminderHours.includes(hour)) {
      const todayEntries = await getTodayEntries(userId);
      if (todayEntries.length === 0) {
        addNotification({
          type: 'info',
          title: 'Lembrete',
          message: 'Você ainda não registrou seu ponto hoje.'
        });
      }
    }
  };

  const interval = setInterval(checkMissingEntry, 60 * 60 * 1000); // Every hour
  return () => clearInterval(interval);
}, []);
```

## Layout

### Dashboard with NotificationBell

```
┌─────────────────────────────────────┐
│ [≡]  Logo     [🔔 Badge] [Avatar]  │  <- Header
├─────────────────────────────────────┤
│                                     │
│         Dashboard Content           │
│                                     │
├─────────────────────────────────────┤
│ [🏠] [📊] [📋] [🔔] [👤]          │  <- Bottom Nav
└─────────────────────────────────────┘
```

## Testing Strategy

### Unit Tests
- NotificationContext: add, markAsRead, markAllAsRead, remove
- Toast: rendering, dismiss
- NotificationBell: badge count
- NotificationPanel: mark as read

## Dependencies

- @frontend: All components
- @qa: E2E tests