# Proposal: Relatórios UI

## Intent

Implementar páginas de relatórios com visualizações de horas trabalhadas, horas extras, e resumos weekly/overtime para o sistema de controle de jornada.

## Scope

### In Scope
- Página de relatório weekly (resumo semanal)
- Página de relatório overtime (banco de horas)
- Componentes reutilizáveis para display de relatórios
- Integração com APIs existentes `/api/reports/weekly` e `/api/reports/overtime`
- Visualização mobile-first

### Out of Scope
- Exportação PDF/Excel
- Relatórios customizados
- Comparação entre períodos
- Envio de relatórios por e-mail

## Approach

1. **UI**: Next.js App Router com Tailwind CSS
2. **Data**: Consumir APIs existentes `/api/reports/weekly` e `/api/reports/overtime`
3. **Components**: Criar `ReportCard` component reutilizável
4. **Navigation**: Adicionar item "Relatórios" no bottom nav

## Affected Areas

- `/src/app/dashboard/reports/` - Novas páginas
- `/src/components/` - Componentes de relatório
- `/src/app/api/reports/` - APIs existentes (não modificar)

## Risks

- APIs de relatório já existem mas UI não foi implementada
- Dados de overtime dependem de cálculo correto no banco

## Rollback Plan

- Remover páginas e componentes criados
- Manter APIs intactas

## Success Criteria

- [ ] Página de relatório semanal carrega com dados corretos
- [ ] Página de relatório de overtime carrega com dados corretos
- [ ] Navegação funcional entre dashboard e relatórios
- [ ] Mobile-first responsive
- [ ] Testes unitários dos componentes