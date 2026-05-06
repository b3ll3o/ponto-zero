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

- Unit tests: Vitest em `*.test.ts` / `*.test.tsx`
- E2E tests: Playwright em `e2e/*.spec.ts`
- Execute testes: `npm run test` / `npm run test:e2e`

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