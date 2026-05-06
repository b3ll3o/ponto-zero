# Delta for Time Tracking

## ADDED Requirements

### Requirement: Time Entry Registration
O sistema DEVE permitir que usuários registrem batidas de ponto (entrada e saída).

#### Scenario: Registrar entrada
- GIVEN o usuário está autenticado e na página de registro
- WHEN o usuário clica em "Registrar Entrada"
- THEN o sistema DEVE criar um time_entry com type="start"
- AND timestamp do momento atual
- AND retorna mensagem de sucesso

#### Scenario: Registrar saída
- GIVEN o usuário está autenticado e tem uma entrada aberta
- WHEN o usuário clica em "Registrar Saída"
- THEN o sistema DEVE criar um time_entry com type="end"
- AND timestamp do momento atual
- AND calcula duração desde a entrada

#### Scenario: Tentativa de registrar sem entrada anterior
- GIVEN o usuário está autenticado mas não tem entrada aberta
- WHEN o usuário clica em "Registrar Saída"
- THEN o sistema DEVE exibir erro "Não há entrada registrada"

### Requirement: Work Shift
O sistema DEVE calcular automaticamente horas trabalhadas por dia.

#### Scenario: Cálculo de horas trabalhadas
- GIVEN o usuário tem entrada e saída registradas no mesmo dia
- WHEN o sistema calcula o saldo
- THEN o sistema DEVE retornar a diferença entre saída e entrada

#### Scenario: Horas extras
- GIVEN o usuário trabalhou mais que 8 horas
- WHEN o sistema calcula o saldo
- THEN o sistema DEVE identificar horas extras (diferença > 8h)

## MODIFIED Requirements

## REMOVED Requirements