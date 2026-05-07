# Ponto Zero - Sistema de Controle de Jornada de Trabalho

Aplicação mobile-first para registro e controle de jornada de trabalho dos colaboradores.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, React 19
- **Backend**: Supabase (Auth + PostgreSQL)
- **Styling**: Tailwind CSS 4, CSS Variables (dark mode)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Auth**: @supabase/ssr para integração com Next.js

## Getting Started

### 1. Configurar variáveis de ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.local.example .env.local
```

Configure as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 2. Executar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 3. Configurar o Supabase

Execute as migrations em `supabase/migrations/` no seu projeto Supabase para criar as tabelas necessárias.

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |
| `npm run test` | Executa testes unitários (Vitest) |
| `npm run test:ui` | Executa testes com interface visual |
| `npm run test:run` | Executa testes unitários sem watch |
| `npm run test:e2e` | Executa testes e2e (Playwright) |
| `npm run test:e2e:ui` | Executa testes e2e com interface visual |

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # Página de login
│   ├── dashboard/         # Dashboard principal
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Landing page
├── components/            # Componentes reutilizáveis
├── contexts/              # React Contexts (AuthContext)
├── lib/
│   └── supabase/          # Clientes Supabase
│       ├── client.ts      # Cliente para browser
│       ├── server.ts      # Cliente para server components
│       └── middleware.ts  # Cliente para middleware
└── middleware.ts          # Proteção de rotas
```

## Funcionalidades

### Autenticação

- Login com e-mail e senha via Supabase Auth
- Sessão gerenciada com @supabase/ssr
- Proteção automática de rotas via middleware
- Logout com invalidação de sessão

### Registro de Ponto

- Registro de entrada e saída
- Cálculo automático de duração
- Identificação de horas extras (>8h)

### Dashboard

- Saldo de horas do dia
- Total de horas no mês
- Saldo de horas extras
- Lista das últimas 5 batidas

### Interface

- Mobile-first (320px+)
- Dark mode com toggle
- Tema claro/escuro persistido

## Database Schema

### time_entries

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key para auth.users |
| type | text | 'start' ou 'end' |
| timestamp | timestamptz | Data/hora da batida |
| notes | text | Observações (opcional) |
| created_at | timestamptz | Timestamp de criação |

## Documentação OpenSpec

O projeto utiliza OpenSpec para especificação e rastreamento de mudanças:

- `openspec/changes/sistema-controle-jornada/proposal.md` - Proposta do sistema
- `openspec/changes/sistema-controle-jornada/design.md` - Decisões de arquitetura
- `openspec/changes/sistema-controle-jornada/specs/` - Especificações detallhadas

## Deploy

O projeto pode ser deployado na Vercel ou qualquer plataforma que suporte Next.js.

```bash
npm run build
```，健康检查
