# PON-003: Validação de Business Rules

## Metadata

| Campo | Valor |
|-------|-------|
| **SDD** | validacao-business-rules |
| **Prioridade** | High |
| **Status** | 🔲 Em Progresso |
| **Data Criação** | 2026-05-12 |
| **Spec** | `specs/validacao-business-rules/spec.md` |
| **Design** | `specs/validacao-business-rules/design.md` |

---

## Objetivo

Implementar validações de regras de negócio para prevenir erros de registro de ponto.

---

## Requisitos Funcionais

### RF-1: Impedir Saída Sem Entrada
- Sistema deve validar que existe entrada antes de permitir saída
- Erro: "Não há entrada registrada para hoje"

### RF-2: Impedir Timestamp Futuro
- Sistema deve rejeitar registros com timestamp no futuro
- Erro: "Não é permitido registrar ponto no futuro"

### RF-3: Impedir Entrada Duplicada
- Sistema deve impedir segunda entrada no mesmo dia (sem saída)
- Erro: "Você já registrou entrada hoje"
- Exceto: nova entrada após saída (novo turno)

### RF-4: Alertar Ponto Aberto
- Sistema deve alertar quando há ponto aberto de dia anterior
- Oferecer registro de saída retroativa

---

## Critérios de Aceitação

- [ ] API retorna erro correto para cada regra violada
- [ ] Frontend exibe mensagens de erro amigáveis
- [ ] Botão de saída desabilitado quando não há entrada
- [ ] Botão de entrada desabilitado quando já existe entrada hoje
- [ ] Alerta visual quando há ponto aberto de dia anterior
- [ ] Testes unitários para validações
- [ ] Testes de integração

---

## Tasks

1. [ ] Backend: Criar `src/lib/validations.ts`
2. [ ] Backend: Integrar validações na API
3. [ ] Backend: Testes unitários
4. [ ] Frontend: Estados dos botões (dashboard)
5. [ ] Frontend: AlertBanner component
6. [ ] Frontend: Alerta de ponto aberto
7. [ ] Frontend: Employee dashboard
8. [ ] Testes de integração
9. [ ] Verificação: build, lint, test, e2e

---

## Estimativa

- **Complexidade**: Média
- **Tempo estimado**: 4-6 horas
- **Dependências**: PON-002 (opcional)