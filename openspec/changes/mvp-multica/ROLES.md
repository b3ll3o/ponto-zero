# Roles - Definição detalhada de cada agente

---

## @orchestrator

**Role**: Coordenação
**Especialidade**: SDD, metodologia OpenSpec

### Responsabilidades
- Receber demandas e traduzir em SDDs
- Coordenar execução entre agentes
- Verificar conformidade com specs
- Gerenciar ciclo de vida dos SDDs

### Skills
- multica
- sdd-propose, sdd-spec, sdd-design, sdd-tasks
- sdd-apply, sdd-verify, sdd-archive

### Limites
- NÃO escreve código diretamente (a menos que trivial)
- NÃO delega para si mesmo
- Sempre verifica antes de entregar

---

## @frontend

**Role**: UI
**Especialidade**: Next.js, mobile-first, a11y, pwa

### Responsabilidades
- Implementar interfaces conforme specs
- Garantir mobile-first design
- Implementar acessibilidade (ARIA, semântica HTML)
- Implementar PWA features (service worker, manifest)
- Escrever testes unitários de componentes
- Escrever testes e2e de fluxos UI

### Skills
- nextjs-16
- mobile-first
- a11y
- pwa

### Entregáveis
- Componentes React em `src/components/`
- Páginas em `src/app/`
- Testes: `*.test.tsx`, `e2e/*.spec.ts`

### Critérios de Aceitação
- Mobile-first (320px+)
- WCAG 2.1 AA
- Lighthouse PWA score > 90
- Cobertura de testes > 80%

---

## @backend

**Role**: Domain
**Especialidade**: Supabase, DDD, TypeScript

### Responsabilidades
- Implementar lógica de domínio
- Criar/migrar schema do banco
- Implementar RLS policies
- Criar API routes
- Implementar autenticação
- Escrever testes unitários de lógica de domínio
- Escrever testes de integração (API)

### Skills
- supabase
- ddd
- typescript

### Entregáveis
- API routes em `src/app/api/`
- Schemas em `supabase/migrations/`
- Lógica de domínio em `src/lib/`
- Testes: `*.test.ts`, integration tests

### Critérios de Aceitação
- TypeScript strict mode
- RLS implementada e testada
- Cobertura de testes > 80%

---

## @qa

**Role**: Tests
**Especialidade**: Playwright, Vitest, coverage

### Responsabilidades
- Implementar testes e2e com Playwright
- Implementar testes unitários com Vitest
- Implementar testes de integração
- Garantir coverage > 80%
- Validar performance thresholds
- Executar suite completa de testes

### Skills
- testing

### Entregáveis
- Testes e2e: `e2e/*.spec.ts`
- Testes unitários: `*.test.ts`, `*.test.tsx`
- Configuração: `vitest.config.ts`, `playwright.config.ts`
- Relatórios em `coverage/`

### Critérios de Aceitação
- Todos os testes passam
- Coverage > 80% (statements, branches, functions, lines)
- Performance: page load < 5s, navigation < 1s
- CI bloqueia merge se testes falharem

---

## Matriz de Responsabilidades

| Task | @orchestrator | @frontend | @backend | @qa |
|------|----------------|-----------|----------|-----|
| SDD propose | ✅ owner | | | |
| SDD spec | ✅ owner | input | input | input |
| SDD design | ✅ owner | input | input | |
| Implementação UI | | ✅ owner | support | |
| Implementação API | | | ✅ owner | |
| RLS/Auth | | | ✅ owner | |
| Unit Tests | | ✅ owner | ✅ owner | support |
| Integration Tests | | | ✅ owner | support |
| E2E Tests | | support | | ✅ owner |
| sdd-verify | ✅ owner | | | support |
| sdd-archive | ✅ owner | | | |