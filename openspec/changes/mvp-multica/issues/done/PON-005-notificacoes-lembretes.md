# PON-005: Notificações e Lembretes

## Metadata

| Campo | Valor |
|-------|-------|
| **SDD** | notificacoes-lembretes |
| **Prioridade** | Medium |
| **Status** | 🔲 Em Progresso |
| **Data Criação** | 2026-05-12 |
| **Spec** | `specs/notificacoes-lembretes/spec.md` |
| **Design** | `specs/notificacoes-lembretes/design.md` |

---

## Objetivo

Implementar sistema de notificações e lembretes para manter usuários informados.

---

## Requisitos Funcionais

### RF-1: Toast Notifications
- Notificações temporárias (success, error, warning, info)
- Auto-dismiss após tempo configurável
- Action button opcional

### RF-2: Lembrete de Ponto Aberto
- Verificar a cada 30 minutos
- Notificar se ponto aberto há mais de 4 horas

### RF-3: Lembrete de Registro
- Notificar em horários: 9h, 11h, 14h, 16h
- Se usuário não registrou ponto hoje

### RF-4: Badge de Notificações
- Contador de não lidas
- Painel com lista de notificações
- Marcar como lida

---

## Critérios de Aceitação

- [ ] Toast notifications funcionam
- [ ] NotificationBell com badge
- [ ] NotificationPanel com lista
- [ ] Lembrete de ponto aberto
- [ ] Lembrete de registro
- [ ] Mobile-friendly
- [ ] Dark mode

---

## Tasks

1. [ ] Frontend: NotificationContext
2. [ ] Frontend: Toast component
3. [ ] Frontend: ToastContainer
4. [ ] Frontend: NotificationBell
5. [ ] Frontend: NotificationItem
6. [ ] Frontend: NotificationPanel
7. [ ] Integration: Layout provider
8. [ ] Integration: Reminder logic
9. [ ] Testes E2E
10. [ ] Verificação: build, lint, test, e2e

---

## Estimativa

- **Complexidade**: Média
- **Tempo estimado**: 3-4 horas
- **Dependências**: PON-003 (validacao-business-rules) - usa hasOpenEntry