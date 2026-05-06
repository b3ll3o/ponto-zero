# Delta for Authentication

## ADDED Requirements

### Requirement: User Authentication
O sistema DEVE permitir autenticação de usuários via Supabase Auth com e-mail e senha.

#### Scenario: Login bem-sucedido
- GIVEN o usuário está na página de login
- WHEN o usuário insere credenciais válidas (e-mail e senha)
- THEN o sistema DEVE redirecionar para o dashboard
- AND manter sessão ativa via cookie

#### Scenario: Login com credenciais inválidas
- GIVEN o usuário está na página de login
- WHEN o usuário insere credenciais inválidas
- THEN o sistema DEVE exibir mensagem de erro "E-mail ou senha incorretos"
- AND manter o usuário na página de login

#### Scenario: Logout
- GIVEN o usuário está autenticado
- WHEN o usuário clica em "Sair" ou "Logout"
- THEN o sistema DEVE invalidar a sessão
- AND redirecionar para a página de login

#### Scenario: Acesso não autenticado
- GIVEN o usuário não está autenticado
- WHEN o usuário tenta acessar qualquer página protegida
- THEN o sistema DEVE redirecionar para a página de login

### Requirement: Session Management
O sistema DEVE gerenciar sessões de usuário utilizando @supabase/ssr para Next.js App Router.

#### Scenario: Sessão válida
- GIVEN o usuário possui uma sessão válida
- WHEN o usuário acessa qualquer página
- THEN o sistema DEVE exibir seus dados de usuário autenticado

#### Scenario: Sessão expirada
- GIVEN a sessão do usuário expirou
- WHEN o usuário tenta acessar página protegida
- THEN o sistema DEVE redirecionar para login

## MODIFIED Requirements

## REMOVED Requirements