# Tasks: Validação de Business Rules

## Specs

- [x] `specs/validacao-business-rules/proposal.md`
- [x] `specs/validacao-business-rules/spec.md`
- [x] `specs/validacao-business-rules/design.md`

---

## Implementação

### 1. Backend — API Validation

#### 1.1 Criar funções de validação

- [ ] Criar `src/lib/validations.ts`
- [ ] `canRegisterEntry(userId: string)`
- [ ] `canRegisterExit(userId: string)`
- [ ] `hasOpenEntry(userId: string)`
- [ ] `validateTimestamp(timestamp: Date)`
- [ ] Códigos de erro padronizados

**Arquivo:** `src/lib/validations.ts`
**Owner:** @backend
**Status:** 🔲 Pending

#### 1.2 Integrar validações na API

- [ ] Modificar `src/app/api/time-entries/route.ts`
- [ ] Adicionar validação de timestamp futuro
- [ ] Adicionar validação para entrada
- [ ] Adicionar validação para saída
- [ ] Retornar erros com códigos corretos

**Arquivo:** `src/app/api/time-entries/route.ts`
**Owner:** @backend
**Status:** 🔲 Pending

#### 1.3 Testes unitários

- [ ] Criar `src/lib/validations.test.ts`
- [ ] Testar `canRegisterEntry` - cenários válidos
- [ ] Testar `canRegisterEntry` - ENTRY_ALREADY_EXISTS
- [ ] Testar `canRegisterExit` - cenários válidos
- [ ] Testar `canRegisterExit` - NO_ENTRY_TODAY
- [ ] Testar `hasOpenEntry`
- [ ] Testar `validateTimestamp` - futuro

**Arquivo:** `src/lib/validations.test.ts`
**Owner:** @backend
**Status:** 🔲 Pending

---

### 2. Frontend — UI Feedback

#### 2.1 Estados dos botões

- [ ] Modificar `src/app/dashboard/page.tsx`
- [ ] `canRegisterEntry` based on `todayStart` e `todayEnd`
- [ ] `canRegisterExit` based on `todayStart`
- [ ] Desabilitar botões quando não permitido

**Arquivo:** `src/app/dashboard/page.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.2 Alert Banner Component

- [ ] Criar `src/components/AlertBanner.tsx`
- [ ] Props: `message`, `type`, `onAction`, `actionLabel`
- [ ] Suporte a `warning`, `error`, `info`
- [ ] Botão de ação opcional
- [ ] Dark mode support

**Arquivo:** `src/components/AlertBanner.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.3 Alerta de Ponto Aberto

- [ ] Verificar ponto aberto de dia anterior
- [ ] Exibir AlertBanner quando aplicável
- [ ] Oferecer ação de registrar saída retroativa

**Arquivo:** `src/app/dashboard/page.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

#### 2.4 Toast para erros

- [ ] Adicionar toast/feedback para erros de validação
- [ ] Usar existing error handling ou componente simples

**Status:** 🔲 Pending (opcional)

---

### 3. Frontend — Employee Dashboard

#### 3.1 Mesmas validações para employee dashboard

- [ ] Modificar `src/app/dashboard/employee/page.tsx`
- [ ] Aplicar same button state logic
- [ ] AlertBanner para ponto aberto

**Arquivo:** `src/app/dashboard/employee/page.tsx`
**Owner:** @frontend
**Status:** 🔲 Pending

---

### 4. Testes

#### 4.1 Testes de Integração

- [ ] API retorna erros corretos para cada validação
- [ ] Frontend exibe estados corretos

---

### 5. Verificação

- [ ] `npm run build` passa
- [ ] `npm run lint` passa
- [ ] `npm run test` passa
- [ ] `npm run test:e2e` passa

---

## Task Metadata

```yaml
sdd: validacao-business-rules
spec_file: specs/validacao-business-rules/spec.md
design_file: specs/validacao-business-rules/design.md
priority: high
status: in_progress
```

---

## Dependencies

- PON-002 (relatorios-ui) ✅ - Dependência opcional

---

## Progress

```
[ 3/24 ] tarefas completas (specs)

🔲 Backend:
  - 1.1 Funções de validação    [PENDING]
  - 1.2 Integrar na API        [PENDING]
  - 1.3 Testes unitários       [PENDING]

🔲 Frontend:
  - 2.1 Estados dos botões     [PENDING]
  - 2.2 AlertBanner           [PENDING]
  - 2.3 Alerta ponto aberto    [PENDING]

🔲 Employee Dashboard:
  - 3.1 Validações            [PENDING]

🔲 Testes:
  - 4.1 Integração            [PENDING]

🔲 Verificação:
  - Build, Lint, Tests        [PENDING]
```

---

## Owners

| Component | Owner |
|-----------|-------|
| Backend (validations.ts, API) | @backend |
| Frontend (dashboard, AlertBanner) | @frontend |
| Tests | @backend, @qa |