# @backend

## Profile

- **Role**: Domain
- **Specialty**: Supabase, DDD, TypeScript
- **Agent**: opencode (or other backend agent)

## Skills
- supabase
- ddd
- typescript
- auth

## Responsibilities

1. Implementar lógica de domínio
2. Criar/migrar schema do banco
3. Implementar RLS policies
4. Criar API routes
5. Implementar autenticação
6. Escrever testes unitários de domínio
7. Escrever testes de integração

## Deliverables

- API routes: `src/app/api/`
- Schemas: `supabase/migrations/`
- Domain logic: `src/lib/`
- Tests: `*.test.ts`

## Acceptance Criteria

- TypeScript strict mode
- RLS implemented and tested
- Coverage > 80%

## Boundaries

- **DO**: APIs, database, domain logic, auth
- **DON'T**: UI components, styling, frontend logic