# Issues — MVP Multica

## Workflow

```
1. Orchestrator cria issue em issues/open/
       ↓
2. Agent move para issues/in_progress/ ao iniciar
       ↓
3. Agent completa e move para issues/done/
       ↓
4. Orchestrator verifica (sdd-verify)
```

## Labels

| Label | Uso |
|-------|-----|
| `frontend` | UI, components |
| `backend` | APIs, domain |
| `qa` | Tests, verify |
| `high` | Prioridade alta |
| `medium` | Prioridade média |
| `blocking` | Bloqueia outras tasks |

## Formato de Issue

```markdown
# Issue: [NOME]

## Assignee
@agente

## Task Reference
PON-XXX

## Descrição
Descrição da task

## Criteria
- [ ] Critério 1
- [ ] Critério 2

## Dependencies
- Nenhuma ou referência a outros issues
```

## Como Criar

```bash
# Via Multica CLI (quando configurado)
multica issue create --title "PON-001: E2E Coverage" --assign @qa
```

## Estados

- `open/` — Abertas, prontas para executar
- `in_progress/` — Em execução
- `review/` — Aguardando review
- `done/` — Completadas
- `blocked/` — Bloqueadas por dependência