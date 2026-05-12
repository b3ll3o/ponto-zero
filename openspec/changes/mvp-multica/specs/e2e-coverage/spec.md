# Spec: E2E Coverage

## Summary

Deve haver cobertura de testes E2E completa para todas as funcionalidades principais do sistema de controle de jornada.

## Specification

### 1. Testes E2E para Login

#### Scenario: Login com credenciais válidas
**Given** o usuário está na página de login
**And** o usuário inseriu e-mail e senha válidos
**When** o usuário clica em "Entrar"
**Then** o sistema redireciona para o dashboard
**And** o token de sessão é armazenado

#### Scenario: Login com credenciais inválidas
**Given** o usuário está na página de login
**And** o usuário inseriu e-mail ou senha incorretos
**When** o usuário clica em "Entrar"
**Then** o sistema exibe mensagem de erro "E-mail ou senha incorretos"
**And** o usuário permanece na página de login

### 2. Testes E2E para Tema

#### Scenario: Toggle de tema na home page
**Given** o usuário está na página inicial
**When** o usuário clica no botão de toggle de tema
**Then** o tema da página muda de claro para escuro
**And** a preferência é persistida em localStorage

#### Scenario: Toggle de tema na página de login
**Given** o usuário está na página de login
**When** o usuário clica no botão de toggle de tema
**Then** o tema da página muda
**And** a preferência é mantida após reload

### 3. Testes E2E para Navegação

#### Scenario: Navegação de home para login
**Given** o usuário está na página inicial
**When** o usuário clica em "Entrar"
**Then** o sistema redireciona para /login

#### Scenario: Navegação de login para home via link
**Given** o usuário está na página de login
**When** o usuário clica em "Voltar para home"
**Then** o sistema redireciona para /

### 4. Testes E2E para Performance

#### Scenario: Home carrega em menos de 5 segundos
**Given** o usuário está na página inicial
**When** a página termina de carregar
**Then** o tempo de carregamento é menor que 5000ms

#### Scenario: Login carrega em menos de 5 segundos
**Given** o usuário está na página de login
**When** a página termina de carregar
**Then** o tempo de carregamento é menor que 5000ms

### 5. Testes E2E para Responsividade

#### Scenario: Home é responsiva em mobile
**Given** o viewport está configurado para 375x667
**When** o usuário carrega a página inicial
**Then** todos os elementos são visíveis e funcionais

#### Scenario: Login é responsivo em mobile
**Given** o viewport está configurado para 375x667
**When** o usuário carrega a página de login
**Then** todos os elementos são visíveis e funcionais

## Acceptance Criteria

- [ ] Todos os testes E2E passam
- [ ] Coverage de código >= 80%
- [ ] Performance: page load < 5s
- [ ] Performance: navigation < 1s
- [ ] CI bloqueia merge se testes falharem

## Out of Scope

- Testes de autenticação com Supabase real (requer credenciais)
- Testes de dashboard completo (requer autenticação)
- Testes de registro de ponto (requer autenticação)