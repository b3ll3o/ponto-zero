# Spec: Validação de Business Rules

## Summary

O sistema deve validar regras de negócio antes de persistir registros de ponto para garantir integridade dos dados.

## Specification

### 1. Regra: Impedir Saída Sem Entrada

#### Scenario: Registrar saída sem entrada
**Given** o usuário não tem registro de entrada hoje
**When** o usuário tenta registrar saída
**Then** o sistema exibe erro "Não há entrada registrada para hoje"
**And** o registro NÃO é persistido

#### Scenario: Registrar saída com entrada
**Given** o usuário tem registro de entrada hoje
**When** o usuário tenta registrar saída
**Then** o sistema permite o registro
**And** o registro é persistido com sucesso

### 2. Regra: Impedir Timestamp Futuro

#### Scenario: Registrar timestamp futuro
**Given** o usuário tenta registrar ponto com timestamp no futuro
**When** o sistema recebe a requisição
**Then** o sistema exibe erro "Não é permitido registrar ponto no futuro"
**And** o registro NÃO é persistido

### 3. Regra: Impedir Entrada Duplicada

#### Scenario: Registrar entrada duplicada
**Given** o usuário já tem registro de entrada hoje
**When** o usuário tenta registrar outra entrada
**Then** o sistema exibe erro "Você já registrou entrada hoje"
**And** o registro NÃO é persistido

#### Scenario: Segunda entrada após saída
**Given** o usuário tem registro de entrada e saída hoje
**When** o usuário tenta registrar nova entrada
**Then** o sistema permite o registro (início de novo turno)

### 4. Regra: Alertar Ponto Aberto

#### Scenario: Usuário esqueceu de fechar ponto
**Given** o usuário tem registro de entrada sem saída do dia anterior
**When** o usuário acessa o dashboard
**Then** o sistema exibe alerta "Você esqueceu de registrar saída ontem"
**And** oferece opção de registrar saída retroativa

### 5. Estado: Entrada Em Andamento

#### Scenario: Mostrar status de ponto aberto
**Given** o usuário tem registro de entrada sem saída
**When** o dashboard é carregado
**Then** o sistema exibe badge "Ponto aberto" ou indicador visual
**And** o tempo em turno é atualizado em tempo real

## Validation Logic (Backend)

```typescript
interface TimeEntryValidation {
  canRegisterEntry(userId: string): ValidationResult;
  canRegisterExit(userId: string): ValidationResult;
  validateTimestamp(timestamp: Date): ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: 'NO_ENTRY_TODAY' | 'ENTRY_ALREADY_EXISTS' | 'FUTURE_TIMESTAMP' | 'EXIT_WITHOUT_ENTRY';
}
```

## API Response Errors

| Code | HTTP Status | Message |
|------|-------------|---------|
| NO_ENTRY_TODAY | 400 | "Não há entrada registrada para hoje" |
| ENTRY_ALREADY_EXISTS | 400 | "Você já registrou entrada hoje" |
| FUTURE_TIMESTAMP | 400 | "Não é permitido registrar ponto no futuro" |
| EXIT_WITHOUT_ENTRY | 400 | "Não é permitido registrar saída sem entrada" |

## Frontend UX

### Error Handling
- Toast notification para erros de validação
- Botão de registro desabilitado quando não permitido
- Feedback visual claro

### Alert for Open Entry
- Banner no topo do dashboard quando há ponto aberto de dia anterior
- Botão "Registrar saída" disponível no banner

## Acceptance Criteria

### Must Have
- [ ] API retorna erro correto para cada regra violada
- [ ] Frontend exibe mensagens de erro amigáveis
- [ ] Botão de saída desabilitado quando não há entrada
- [ ] Botão de entrada desabilitado quando já existe entrada hoje
- [ ] Alerta visual quando há ponto aberto de dia anterior
- [ ] Testes unitários para validações

### Should Have
- [ ] Toast notification para erros
- [ ] Opção de registrar saída retroativa