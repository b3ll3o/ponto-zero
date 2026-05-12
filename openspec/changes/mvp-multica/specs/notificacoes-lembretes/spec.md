# Spec: Notificações e Lembretes

## Summary

O sistema deve exibir notificações e lembretes para ajudar usuários a registrar ponto corretamente.

## Specification

### 1. Toast Notifications

#### Scenario: Exibir toast de sucesso
**Given** uma ação foi concluída com sucesso
**When** o sistema quer notificar o usuário
**Then** exibe toast verde com mensagem de sucesso
**And** desaparece após 3 segundos

#### Scenario: Exibir toast de erro
**Given** uma ação falhou
**When** o sistema quer notificar o usuário
**Then** exibe toast vermelho com mensagem de erro
**And** desaparece após 5 segundos

#### Scenario: Exibir toast de aviso
**Given** há uma situação que requer atenção
**When** o sistema quer notificar o usuário
**Then** exibe toast amarelo com mensagem de aviso
**And** desaparece após 5 segundos

### 2. Lembrete de Ponto Aberto

#### Scenario: Usuário esqueceu de fechar ponto
**Given** o usuário tem entrada sem saída há mais de 4 horas
**When** o sistema verifica a cada 30 minutos
**Then** exibe toast "Você esqueceu de registrar saída?"
**And** oferece botão para registrar saída

### 3. Lembrete de Registro

#### Scenario: Usuário não registrou ponto hoje
**Given**现在是工作时间 (ex: 9h-18h)
**And** o usuário não registrou entrada hoje
**When** o sistema verifica a cada 2 horas (9h, 11h, 14h, 16h)
**Then** exibe toast "Lembrete: registre seu ponto"

### 4. Badge de Notificações

#### Scenario: Mostrar badge com contador
**Given** há notificações não lidas
**When** o usuário está no dashboard
**Then** exibe badge com número de notificações não lidas
**And** ícone de sino no header

#### Scenario: Abrir painel de notificações
**Given** o usuário clica no ícone de sino
**When** o painel de notificações abre
**Then** mostra lista de notificações recentes
**And** usuário pode marcar como lida

## Components

### Toast

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
}
```

### NotificationContext

```typescript
interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

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
```

### NotificationBell

```typescript
interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}
```

### NotificationPanel

```typescript
interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}
```

## Frontend UX

### Toast Styles
- Success: `bg-green-50 border-green-200 text-green-800`
- Error: `bg-red-50 border-red-200 text-red-800`
- Warning: `bg-amber-50 border-amber-200 text-amber-800`
- Info: `bg-blue-50 border-blue-200 text-blue-800`

### Toast Position
- Bottom-right in desktop
- Bottom-center in mobile

### Toast Animation
- Slide in from right
- Fade out on dismiss

## Acceptance Criteria

### Must Have
- [ ] Toast notifications funcionam (success, error, warning, info)
- [ ] Notificação de ponto aberto aparece
- [ ] Badge de unread notifications
- [ ] Painel de notificações
- [ ] Dismiss individual e dismiss all
- [ ] Mobile-friendly

### Should Have
- [ ] Lembrete de registro de ponto
- [ ] Persistir notificações no localStorage