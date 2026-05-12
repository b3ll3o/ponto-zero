# Proposal: Validação de Business Rules

## Intent

Implementar validações de regras de negócio no sistema de controle de jornada para prevenir erros de registro de ponto.

## Scope

### In Scope
- Impedir registro de saída sem entrada prévia no mesmo dia
- Impedir registros com timestamp no futuro
- Impedir registro de entrada duplicada no mesmo dia
- Alertar usuário quando esquecer de fechar ponto (entrada sem saída)

### Out of Scope
- Integração com GPS/localização
- Notificações push
- Alertas por e-mail

## Approach

1. **Backend**: Validar no API route antes de persistir
2. **Frontend**: Feedback visual imediato no UI
3. **UX**: Mensagens claras de erro/aviso

## Affected Areas

- `/src/app/api/time-entries/route.ts` - Validação backend
- `/src/app/dashboard/page.tsx` - Feedback visual frontend

## Risks

- Validação duplicada client/server
- Race conditions em registros simultâneos

## Rollback Plan

- Remover validações dos API routes
- Manter mensagens de erro amigáveis

## Success Criteria

- [ ] Usuário não consegue registrar saída sem entrada
- [ ] Usuário não consegue registrar timestamp futuro
- [ ] Usuário não consegue registrar entrada duplicada
- [ ] Sistema alerta quando há ponto aberto (entrada sem saída)