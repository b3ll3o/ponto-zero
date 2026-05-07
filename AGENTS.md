<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ponto Zero - Agentes

## Stack

- Next.js 16.2.4 (App Router)
- Supabase (@supabase/ssr + @supabase/supabase-js)
- Tailwind CSS 4
- Vitest + Playwright

## Convenções

### Testes

**Regras obrigatórias (PON-13):**

- Cobertura mínima: **80%** para statements, branches, functions e lines
- Deve haver: testes unitários, testes de integração e testes e2e
- **Todos os testes devem sempre passar** (CI bloqueia merge se falhar)
- Testes devem ser escritos pensando em **performance**

**Estrutura:**
- Unit tests: Vitest em `*.test.ts` / `*.test.tsx`
- Integration tests: Vitest (mesma estrutura, testam fluxo completo)
- E2E tests: Playwright em `e2e/*.spec.ts`

**Execução:**
```bash
npm run test        # Unit + Integration (com coverage)
npm run test:run    # Unit + Integration (sem coverage, CI)
npm run test:e2e    # E2E com Playwright
npm run test:ui     # UI interativa Vitest
```

**Performance:**
- Páginas devem carregar em < 5s
- Navegações em < 1s
- Limite de 20 requisições externas por página
- Medir e documentar thresholds nos testes e2e

**Coverage:**
- Configurado em `vitest.config.ts` com thresholds em 80%
- Relatórios em `coverage/` (text, html, lcov)
- Arquivos de node_modules, config e e2e excluídos

### Supabase

- Clientes em `src/lib/supabase/`
- Server: `src/lib/supabase/server.ts`
- Browser: `src/lib/supabase/client.ts`
- Middleware: `src/lib/supabase/middleware.ts`
- Auth state: `src/contexts/AuthContext.tsx`

### RLS (Row Level Security)

O banco Supabase utiliza RLS para segurança. Usuários só acessam seus próprios dados.

## OpenSpec

O projeto segue a metodologia OpenSpec para especificação:

- Propostas em `openspec/changes/<nome>/proposal.md`
- Design em `openspec/changes/<nome>/design.md`
- Specs em `openspec/changes/<nome>/specs/<area>/spec.md`

## Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```