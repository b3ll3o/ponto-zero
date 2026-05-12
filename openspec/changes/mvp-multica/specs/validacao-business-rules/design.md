# Design: Validação de Business Rules

## Overview

Este SDD implementa validações de regras de negócio para garantir integridade dos registros de ponto.

## Architecture

### Validation Flow

```
Frontend (handleRegister)
    ↓
API Route (/api/time-entries)
    ↓
Validation Layer
    ↓
Database (time_entries)
```

### Files to Modify

```
src/app/api/time-entries/route.ts    # Adicionar validações
src/app/dashboard/page.tsx          # Feedback visual + alertas
src/lib/timeTracking.ts             # Funções de validação
```

### New Files

```
src/lib/validations.ts              # Funções de validação reutilizáveis
src/lib/validations.test.ts         # Testes unitários
```

## Validation Functions

### `canRegisterEntry(userId: string)`

Verifica se usuário pode registrar entrada:

1. Verificar se já existe entrada hoje (sem saída)
2. Se existir entrada sem saída → ERRO: ENTRY_ALREADY_EXISTS
3. Verificar timestamp não é futuro
4. Se timestamp futuro → ERRO: FUTURE_TIMESTAMP
5. OK → permitir registro

### `canRegisterExit(userId: string)`

Verifica se usuário pode registrar saída:

1. Verificar se existe entrada hoje (sem saída)
2. Se não existir → ERRO: NO_ENTRY_TODAY
3. OK → permitir registro

### `hasOpenEntry(userId: string)`

Verifica se há ponto aberto de dia anterior:

1. Buscar última entrada do usuário
2. Se não houver saída após essa entrada
3. E a entrada for de dia anterior → true

## Error Codes

```typescript
const VALIDATION_ERRORS = {
  NO_ENTRY_TODAY: {
    code: 'NO_ENTRY_TODAY',
    message: 'Não há entrada registrada para hoje',
    httpStatus: 400
  },
  ENTRY_ALREADY_EXISTS: {
    code: 'ENTRY_ALREADY_EXISTS',
    message: 'Você já registrou entrada hoje',
    httpStatus: 400
  },
  FUTURE_TIMESTAMP: {
    code: 'FUTURE_TIMESTAMP',
    message: 'Não é permitido registrar ponto no futuro',
    httpStatus: 400
  },
  EXIT_WITHOUT_ENTRY: {
    code: 'EXIT_WITHOUT_ENTRY',
    message: 'Não é permitido registrar saída sem entrada',
    httpStatus: 400
  }
};
```

## API Changes

### POST /api/time-entries

Adicionar validação no início:

```typescript
export async function POST(request: Request) {
  const { user } = await getUser();
  const { type, timestamp } = await request.json();

  // Validar timestamp não é futuro
  if (new Date(timestamp) > new Date()) {
    return Response.json(
      VALIDATION_ERRORS.FUTURE_TIMESTAMP,
      { status: 400 }
    );
  }

  if (type === 'start') {
    const entryCheck = await canRegisterEntry(user.id);
    if (!entryCheck.valid) {
      return Response.json(entryCheck, { status: 400 });
    }
  }

  if (type === 'end') {
    const exitCheck = await canRegisterExit(user.id);
    if (!exitCheck.valid) {
      return Response.json(exitCheck, { status: 400 });
    }
  }

  // Persistir...
}
```

## Frontend Changes

### Dashboard - Button States

```typescript
// Entrada desabilitada se já existe entrada hoje
const canRegisterEntry = !todayStart || todayEnd;

// Saída desabilitada se não existe entrada hoje
const canRegisterExit = !todayStart || todayEnd;
```

### Dashboard - Open Entry Alert

```typescript
// Verificar se há ponto aberto de dia anterior
const hasOpenEntryFromYesterday = async () => {
  const lastEntry = await getLastEntryWithoutExit();
  if (lastEntry && isYesterday(lastEntry.timestamp)) {
    return true;
  }
  return false;
};

// Exibir banner se verdadeiro
{hasOpenEntryFromYesterday && (
  <AlertBanner
    message="Você esqueceu de registrar saída ontem"
    onAction={() => handleRegister('end')}
    actionLabel="Registrar saída"
  />
)}
```

## Alert Banner Component

```typescript
interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'error' | 'info';
  onAction?: () => void;
  actionLabel?: string;
  onDismiss?: () => void;
}
```

- Warning: `bg-amber-50 border-amber-200 text-amber-800`
- Error: `bg-red-50 border-red-200 text-red-800`
- Info: `bg-blue-50 border-blue-200 text-blue-800`

## Testing Strategy

### Unit Tests
- `canRegisterEntry` - todos os cenários
- `canRegisterExit` - todos os cenários
- `hasOpenEntry` - todos os cenários
- Timestamp validation

### Integration Tests
- API route retorna erros corretos
- Frontend exibe estados corretos dos botões

## Dependencies

- `@frontend`: Dashboard UI changes
- `@backend`: API validation logic