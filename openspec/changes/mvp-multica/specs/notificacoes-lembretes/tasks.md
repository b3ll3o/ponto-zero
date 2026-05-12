# Tasks: Notificações e Lembretes

## Specs

- [x] `specs/notificacoes-lembretes/proposal.md`
- [x] `specs/notificacoes-lembretes/spec.md`
- [x] `specs/notificacoes-lembretes/design.md`

---

## Implementação

### 1. Context & Core

#### 1.1 NotificationContext

- [ ] Criar `src/contexts/NotificationContext.tsx`
- [ ] Provider com notifications state
- [ ] addNotification, markAsRead, markAllAsRead, removeNotification
- [ ] unreadCount computed
- [ ] Testes unitários

**Arquivo:** `src/contexts/NotificationContext.tsx`
**Arquivo:** `src/contexts/NotificationContext.test.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 2. Components

#### 2.1 Toast Component

- [ ] Criar `src/components/notifications/Toast.tsx`
- [ ] Props: id, type, message, duration, action, onDismiss
- [ ] Estilos por type (success, error, warning, info)
- [ ] Auto-dismiss após duration
- [ ] Animation (slide in/out)
- [ ] Testes unitários

**Arquivo:** `src/components/notifications/Toast.tsx`
**Arquivo:** `src/components/notifications/Toast.test.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.2 ToastContainer

- [ ] Criar `src/components/notifications/ToastContainer.tsx`
- [ ] Renderiza lista de toasts
- [ ] Position: bottom-right (desktop), bottom-center (mobile)
- [ ] Max 3 toasts visíveis

**Arquivo:** `src/components/notifications/ToastContainer.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.3 NotificationBell

- [ ] Criar `src/components/notifications/NotificationBell.tsx`
- [ ] Props: unreadCount, onClick
- [ ] Ícone de sino
- [ ] Badge com contador
- [ ] Dark mode support

**Arquivo:** `src/components/notifications/NotificationBell.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.4 NotificationItem

- [ ] Criar `src/components/notifications/NotificationItem.tsx`
- [ ] Props: notification, onMarkAsRead, onDismiss
- [ ] Ícone baseado no type
- [ ] Timestamp relativo
- [ ] Indicador de não lida
- [ ] Botão dismiss

**Arquivo:** `src/components/notifications/NotificationItem.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.5 NotificationPanel

- [ ] Criar `src/components/notifications/NotificationPanel.tsx`
- [ ] Props: notifications, onMarkAsRead, onClose
- [ ] Header com título e "Marcar todas como lida"
- [ ] Lista de NotificationItem
- [ ] Empty state
- [ ] Slide-in animation

**Arquivo:** `src/components/notifications/NotificationPanel.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 3. Integration

#### 3.1 Layout Provider

- [ ] Adicionar NotificationProvider ao layout
- [ ] Adicionar ToastContainer
- [ ] Header com NotificationBell

**Arquivo:** `src/app/dashboard/layout.tsx` (ou similar)
**Owner:** @frontend
**Status:** 🔲 Pending

#### 3.2 Reminder Logic

- [ ] Adicionar useEffect no dashboard
- [ ] Verificar ponto aberto a cada 30 min
- [ ] Lembrete de registro (9h, 11h, 14h, 16h)
- [ ] Usar hasOpenEntry do PON-003

**Arquivo:** `src/app/dashboard/page.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 4. Testes

#### 4.1 E2E Tests

- [ ] Testar abertura do painel de notificações
- [ ] Testar toast de sucesso/erro
- [ ] Testar badge de unread

**Arquivo:** `e2e/notifications.spec.ts`
**Owner:** @qa
**Status:** 🔲 Pending

---

### 5. Verificação

- [ ] `npm run build` passa
- [ ] `npm run lint` passa
- [ ] `npm run test` passa
- [ ] `npm run test:e2e` passa

---

## Task Metadata

```yaml
sdd: notificacoes-lembretes
spec_file: specs/notificacoes-lembretes/spec.md
design_file: specs/notificacoes-lembretes/design.md
priority: medium
status: in_progress
```

---

## Progress

```
[ 3/18 ] tarefas completas (specs)

🔲 Context:
  - 1.1 NotificationContext          [PENDING]

🔲 Components:
  - 2.1 Toast                      [PENDING]
  - 2.2 ToastContainer             [PENDING]
  - 2.3 NotificationBell           [PENDING]
  - 2.4 NotificationItem           [PENDING]
  - 2.5 NotificationPanel          [PENDING]

🔲 Integration:
  - 3.1 Layout Provider            [PENDING]
  - 3.2 Reminder Logic            [PENDING]

🔲 Testes:
  - 4.1 E2E                       [PENDING]

🔲 Verificação:
  - Build, Lint, Tests            [PENDING]
```

---

## Owners

| Component | Owner |
|-----------|-------|
| All components | @frontend |
| E2E Tests | @qa |