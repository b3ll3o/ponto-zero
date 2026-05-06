# Proposal: Sistema de Controle de Jornada de Trabalho

## Intent

Criar uma aplicação mobile-first para registro e controle de jornada de trabalho dos colaboradores, utilizando Supabase como backend (autenticação e banco de dados).

## Scope

### In Scope
- Autenticação via Supabase Auth (e-mail/senha)
- Banco de dados para registros de ponto (time_entries)
- Registro de batidas de ponto (entrada/saída)
- Visualização de saldo de horas
- Dashboard básico com resumo mensal
- Interface mobile-first com dark mode

### Out of Scope
- Integração com folha de pagamento
- Relatórios avançados / exportação PDF
- Notificações push
- Multi-empresa / tenants
- GPS / localização

## Approach

1. **Autenticação**: Supabase Auth com e-mail/senha, session gerenciada via @supabase/ssr
2. **Database**: Tabelas no Supabase (time_entries, work_shifts)
3. **UI**: Next.js App Router, Tailwind CSS, mobile-first
4. **State**: React Context para auth state

## Affected Areas

- `/src/app/` - Páginas (page, login, dashboard)
- `/src/lib/` - Cliente Supabase, tipos
- `/src/components/` - Componentes reutilizáveis
- `/src/contexts/` - AuthContext

## Risks

- Configuração de RLS (Row Level Security) no Supabase pode causar acessos indevidos
- Tempo de resposta da API Supabase em conexões lentas

## Rollback Plan

- Desabilitar RLS temporariamente se necessário
- Reverter migrations via Supabase Dashboard
- Manter backup local do schema

## Success Criteria

- [ ] Usuário consegue fazer login/logout
- [ ] Usuário consegue registrar entrada e saída
- [ ] Dashboard exibe saldo de horas do dia/mês
- [ ] Aplicativo funciona em mobile (320px+) e desktop
- [ ] Tema claro/escuro funciona corretamente