# Design: Sistema de Controle de Jornada de Trabalho

## Technical Approach

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **State Management**: React Context for auth state
- **Styling**: Mobile-first with Tailwind, dark mode via CSS variables

## Architecture Decisions

### Decision: Supabase SSR for Auth
**Choice**: Utilizar @supabase/ssr para gerenciar sessões no Next.js App Router
**Alternatives considered**: Supabase Client direto, Firebase Auth
**Rationale**: @supabase/ssr fornece integração nativa com App Router, cookies seguros, e refresh automático de sessão

### Decision: RLS (Row Level Security)
**Choice**: Habilitar RLS no Supabase para que usuários só vejam seus próprios dados
**Rationale**: Segurança de dados - cada usuário acessa apenas seus registros

### Decision: Database Schema
**Choice**: Tabela time_entries com campos: id, user_id, type, timestamp, notes
**Alternatives considered**: Tabela separada para shifts
**Rationale**: Schema simples permite calcular duration via SQL ou client-side

## Data Flow

```
User Action → React Component → Supabase Client → Supabase DB
                     ↓
              Auth Context (update state)
                     ↓
              Page revalidation
```

## File Changes

### New Files
- `src/lib/supabase/client.ts` - Cliente Supabase para browser
- `src/lib/supabase/server.ts` - Cliente Supabase para server
- `src/lib/supabase/middleware.ts` - Supabase client para middleware
- `src/contexts/AuthContext.tsx` - Auth state provider
- `src/components/ThemeToggle.tsx` - Toggle dark/light mode
- `src/app/login/page.tsx` - Página de login
- `src/app/dashboard/page.tsx` - Dashboard principal
- `src/middleware.ts` - Middleware para proteção de rotas

### Modified Files
- `src/app/page.tsx` - Landing page atualizada
- `src/app/layout.tsx` - Adicionar AuthProvider
- `src/app/globals.css` - Variáveis de tema

## Interfaces / Contracts

### TimeEntry
```typescript
interface TimeEntry {
  id: string;
  user_id: string;
  type: 'start' | 'end';
  timestamp: string; // ISO 8601
  notes?: string;
  created_at: string;
}
```

### UserSession
```typescript
interface UserSession {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}
```

## Testing Strategy

- Manual testing com browser automation
- Verificar login/logout flow
- Verificar registro de ponto
- Verificar tema claro/escuro

## Migration / Rollback

1. Deploy inicial com RLS em modo "permissive"
2. Após validação, habilitar RLS restritivo
3. Rollback: desabilitar RLS via Supabase Dashboard

## Open Questions

- Precisamos de validação de horário (não permitir batida futura)?
- Limitação de uma entrada por vez (evitar duplicates)?