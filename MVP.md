# MVP: Sistema de Ponto para Empresas (B2B)

## Objetivo

Extensão do Ponto Zero para permitir que empresas contratem o sistema de controle de ponto, gerenciem seus funcionários e colaboradores registrem suas jornadas de trabalho.

---

## Personas

### Gestor de Empresa (Admin)
- Responsável por contratar o sistema
- Cadastra a empresa e seleciona o plano
- Convida e gerencia funcionários
- Visualiza relatórios e métricas da empresa

### Funcionário (Employee)
- Recebe convite para entrar na empresa
- Registra entrada e saída da jornada
- Visualiza seu próprio histórico de batidas

---

## Funcionalidades MVP

### 1. Autenticação e Conta
- Login/Cadastro via e-mail e senha (Supabase Auth)
- Sessão gerenciada com redirect para dashboard correto

### 2. Cadastro de Empresa
- Campos: Razão Social, Nome Fantasia, CNPJ, Endereço
- Seleção de plano (Grátis, Pro, Empresarial)
- Cada empresa criada vínculo automático com o usuario admin

### 3. Gestão de Plano
| Plano | Preço | Limite Funcionários |
|-------|-------|---------------------|
| Grátis | R$ 0/mês | 1 |
| Pro | R$ 29/mês | 10 |
| Empresarial | R$ 99/mês | Ilimitado |

*Pagamento não implementado no MVP - apenas seleção de plano*

### 4. Gestão de Funcionários
- Convite via e-mail (futuro: link de convite)
- Vinculação company_members: user_id, company_id, role
- Listagem de funcionários no dashboard admin

### 5. Registro de Jornada (Funcionários)
- Mesma interface atual de ponto (entrada/saída)
- Botões grandes mobile-first
- Registros vinculados à empresa do funcionário via RLS

### 6. Dashboard
**Admin:**
- Lista de funcionários
- Total de horas empresa no mês
- Quantidade de funcionários ativos

**Employee:**
- Próprio resumo mensal
- Botões de entrada/saída
- Histórico de batidas

---

## Estrutura de Dados

### Tabela: companies
```sql
id uuid primary key
name text not null
cnpj text unique
plan_type text default 'free'
admin_user_id uuid references auth.users
created_at timestamptz default now()
```

### Tabela: company_members
```sql
id uuid primary key
company_id uuid references companies
user_id uuid references auth.users
role text check (role in ('admin', 'employee'))
created_at timestamptz default now()
```

### Tabela: time_entries (existente)
```sql
-- Adicionar via migration:
company_id uuid references companies
```
*GSync via company_members para manter RLS simples*

---

## Fluxo de Usuário

```
[Visitante] → Landing Page → Login/Cadastro
                              ↓
                    [Usuário Logado]
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
      [Tem empresa vinculada?]         [Não tem empresa]
              ↓                               ↓
         Redireciona para              Mostra tela "Criar
         dashboard baseado              Empresa" ou "Entrar
         no role                       em Empresa"
```

### Fluxo Admin
1. Login → Verifica company_members com role='admin'
2. Se não tem → Tela "Criar Empresa" (nome, CNPJ, plano)
3. Se tem → Dashboard Admin
4. Ações: Convidar funcionário, Ver métricas, Gerenciar equipe

### Fluxo Employee
1. Login → Verifica company_members com role='employee'
2. Redirecionado para Dashboard Employee
3. Ações: Registrar ponto (entrada/saída), Ver meu histórico

---

## Arquitetura de Rotas

```
/                   → Landing page (pública)
/login              → Login/Cadastro (público)
/dashboard          → Dashboard dinâmico baseado no role
/dashboard/admin    → Painel admin (protegido)
/dashboard/employee → Painel employee (protegido)
/empresa            → Páginas de gestão da empresa
```

---

## Segurança (RLS)

- **companies**: Admin da empresa vê apenas sua empresa
- **company_members**: Usuário vê apenas seus próprios memberships
- **time_entries**: Funcionário vê apenas seus registros da empresa

```sql
-- Policy exemplo para time_entries
CREATE POLICY "Empresa vê registros dos funcionários" ON time_entries
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM company_members WHERE user_id = auth.uid()
    )
  );
```

---

## Stack Técnica (Mantida)

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **State**: React Context (AuthContext existente)
- **Mobile-first**: UI responsiva com Tailwind

---

## Fora do Escopo MVP

- Integração com gateway de pagamento (Stripe/MercadoPago)
- GPS / Localização
- Notificações push
- Exportação PDF de relatórios
- Integração com folha de pagamento
- White-label

---

## Critérios de Sucesso MVP

- [ ] Admin consegue criar empresa e selecionar plano
- [ ] Admin consegue visualizar dashboard com métricas
- [ ] Admin consegue ver lista de funcionários
- [ ] Employee consegue registrar entrada
- [ ] Employee consegue registrar saída
- [ ] Employee vê seu próprio histórico
- [ ] RLS impede acesso a dados de outras empresas
- [ ] Tema claro/escuro funcionando
- [ ] Mobile responsive (320px+)
