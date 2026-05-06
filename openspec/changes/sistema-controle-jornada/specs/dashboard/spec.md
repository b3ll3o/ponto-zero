# Delta for Dashboard

## ADDED Requirements

### Requirement: Dashboard Overview
O sistema DEVE exibir um dashboard com resumo de horas do usuário.

#### Scenario: Exibir saldo do dia
- GIVEN o usuário está autenticado
- WHEN o usuário acessa o dashboard
- THEN o sistema DEVE exibir horas trabalhadas hoje
- AND status (em turno / fora do turno)

#### Scenario: Exibir resumo mensal
- GIVEN o usuário está autenticado
- WHEN o usuário acessa o dashboard
- THEN o sistema DEVE exibir total de horas no mês
- AND saldo de horas extras

#### Scenario: Listar entradas recentes
- GIVEN o usuário está autenticado
- WHEN o usuário acessa o dashboard
- THEN o sistema DEVE listar últimas 5 batidas de ponto

### Requirement: Dark Mode Toggle
O sistema DEVE permitir alternar entre tema claro e escuro.

#### Scenario: Alternar tema
- GIVEN o usuário está na página
- WHEN o usuário clica no toggle de tema
- THEN o sistema DEVE alternar entre claro e escuro
- AND persistir preferência no localStorage

## MODIFIED Requirements

## REMOVED Requirements