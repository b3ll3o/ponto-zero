# Proposal: Notificações e Lembretes

## Intent

Implementar sistema de notificações e lembretes para lembrar usuários de registrar ponto.

## Scope

### In Scope
- Notificação de lembrete de registro de ponto
- Notificação de hora extra可疑
- Notificação de ponto aberto (lembrete de fechar)
- Toast notifications no frontend

### Out of Scope
- Push notifications (mobile)
- Notificações por e-mail
- Integração com service worker

## Approach

1. **Frontend**: Toast notifications via React context
2. **Reminder Logic**: Verificar no dashboard a cada X minutos
3. **Visual**: Badge no header, toast para lembretes

## Affected Areas

- `/src/contexts/NotificationContext.tsx` - Context para notificações
- `/src/components/Toast.tsx` - Componente de toast
- `/src/app/dashboard/page.tsx` - Lógica de lembretes

## Risks

- Performance com checks frequentes
- User experience com muitas notificações

## Rollback Plan

- Remover context e componentes
- Desabilitar lógica de reminder

## Success Criteria

- [ ] Toast notifications funcionam
- [ ] Lembrete de ponto aberto aparece
- [ ] Badge de notificações no header
- [ ] usuário pode ver lista de notificações