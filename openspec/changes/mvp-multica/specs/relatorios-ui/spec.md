# Spec: Relatórios UI

## Summary

O sistema deve fornecer páginas de relatórios para visualização de horas trabalhadas semanalmente e acumulado de horas extras.

## Specification

### 1. Relatório Semanal

#### 1.1 Page Load

**Scenario: Carregar relatório semanal com dados**
**Given** o usuário está autenticado e no dashboard
**And** o usuário clica em "Relatórios" no bottom nav
**When** o usuário navega para a página de relatório semanal
**Then** o sistema exibe um resumo das horas da semana atual
**And** o título mostra o período da semana (ex: "Semana 20/2026")

#### 1.2 Display de Dados

**Scenario: Exibir cards de resumo**
**Given** a página de relatório semanal carregou
**Then** o sistema exibe:
- Total de horas trabalhadas na semana
- Total de horas extras acumuladas
- Número de dias trabalhados
- Média de horas por dia

#### 1.3 Lista de Dias

**Scenario: Exibir lista de dias da semana**
**Given** a página de relatório semanal carregou
**Then** o sistema exibe uma lista com:
- Data do dia
- Horas entrada e saída
- Total de horas trabalhadas naquele dia
- Indicação de horas extras

### 2. Relatório de Horas Extras

#### 2.1 Page Load

**Scenario: Carregar relatório de overtime**
**Given** o usuário está na página de relatórios
**When** o usuário seleciona a tab "Horas Extras"
**Then** o sistema exibe o acumulado de horas extras
**And** o título mostra o mês/ano de referência

#### 2.2 Display de Dados

**Scenario: Exibir card de overtime**
**Given** a página de overtime carregou
**Then** o sistema exibe:
- Total de horas extras acumuladas no mês
- Meta de horas extras (se configurada)
- Evolução semana a semana
- Projeção para fim do mês

### 3. Navegação

#### 3.1 Bottom Navigation

**Scenario: Navegar para relatórios**
**Given** o usuário está no dashboard
**When** o usuário clica em "Relatórios" no bottom nav
**Then** o sistema navega para `/dashboard/reports`

**Scenario: Voltar para home**
**Given** o usuário está na página de relatórios
**When** o usuário clica em "Home" no bottom nav
**Then** o sistema navega para `/dashboard`

#### 3.2 Tabs

**Scenario: Trocar entre relatórios**
**Given** o usuário está na página de relatórios
**When** o usuário clica na tab "Semanal"
**Then** o sistema exibe o relatório semanal

**Given** o usuário está na página de relatórios
**When** o usuário clica na tab "Horas Extras"
**Then** o sistema exibe o relatório de overtime

### 4. Responsividade

#### 4.1 Mobile View

**Scenario: Layout mobile-first**
**Given** o viewport é 375px ou menor
**Then** os cards ocupam 100% da largura
**And** a lista de dias é exibida em formato de tabela compacta

#### 4.2 Desktop View

**Scenario: Layout desktop**
**Given** o viewport é maior que 768px
**Then** os cards são exibidos em grid de 2 colunas
**And** a lista de dias mantém formatação legível

### 5. Estados de Loading

#### 5.1 Loading State

**Scenario: Dados carregando**
**Given** os dados estão sendo buscados
**Then** o sistema exibe skeleton loading nos cards
**And** a página permanece interativa (navegação funciona)

#### 5.2 Empty State

**Scenario: Sem dados para exibir**
**Given** não há registros para o período
**Then** o sistema exibe mensagem "Sem dados para este período"
**And** não exibe valores zerados

### 6. Error Handling

#### 6.1 API Error

**Scenario: Erro ao carregar dados**
**Given** a API de relatórios retorna erro
**Then** o sistema exibe mensagem de erro amigável
**And** oferece botão "Tentar novamente"

## Acceptance Criteria

### Must Have
- [ ] `/dashboard/reports` page exists
- [ ] Weekly report tab displays correct data
- [ ] Overtime report tab displays correct data
- [ ] Bottom navigation works
- [ ] Mobile-first responsive
- [ ] Loading states shown during fetch
- [ ] Error states handled gracefully

### Should Have
- [ ] Week selector (navegar entre semanas)
- [ ] Month selector for overtime

### Won't Have (This Sprint)
- [ ] Export PDF/Excel
- [ ] Email reports
- [ ] Custom date ranges

## Component Inventory

### ReportCard
- Props: `title`, `value`, `subtitle`, `icon`, `trend`
- States: `loading`, `default`, `error`
- Variants: `default`, `highlight`, `compact`

### DayRow
- Props: `date`, `entries`, `total`
- States: `normal`, `weekend`, `holiday`

### TabNavigation
- Props: `tabs`, `activeTab`
- States: `default`, `active`

### StatCard
- Props: `label`, `value`, `unit`
- States: `positive`, `negative`, `neutral`

## Technical Notes

- Usar `/api/reports/weekly` e `/api/reports/overtime` existentes
- Não modificar APIs, apenas consumir
- Manter consistência com design system existente