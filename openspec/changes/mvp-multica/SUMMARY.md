# MVP Multica — Ponto Zero

## O que é

MVP de sistema de controle de jornada de trabalho: registro de ponto eletrônico, dashboard, e relatórios.

---

## Estrutura de Pastas

```
openspec/changes/mvp-multica/
├── AGENTS.md              # Sistema completo de agentes
├── ORCHESTRATOR.md        # Definição do orchestrator
├── ROLES.md              # Papéis dos agents
├── README.md             # Este resumo
├── proposal.md           # Proposta do MVP
├── tasks.md             # Tasks globais
├── PROGRESSO.md         # Progresso em tempo real
├── specs/               # SDDs do MVP
│   ├── e2e-coverage/     # ✅ done
│   ├── relatorios-ui/    # 🔲 pending
│   ├── validacao-business-rules/  # 🔲 pending
│   ├── historico-filtros/  # 🔲 pending
│   └── notificacoes-lembretes/  # 🔲 pending
└── issues/              # Issues entre agents
    ├── README.md
    ├── open/
    ├── in_progress/
    ├── review/
    ├── done/              # ✅ PON-001-e2e-coverage.md
    └── blocked/
```

---

## Como Começar

1. **Leia AGENTS.md** — Entenda o sistema de agentes
2. **Veja tasks.md** — Quais SDDs precisamos implementar
3. **Acompanhe PROGRESSO.md** — Status atual
4. **Crie issues** — Orchestrator distribui trabalho

---

## SDDs do MVP

| SDD | Status | Prioridade |
|-----|--------|-----------|
| e2e-coverage | ✅ Done | High |
| relatorios-ui | 🔲 Pending | High |
| validacao-business-rules | 🔲 Pending | High |
| historico-filtros | 🔲 Pending | Medium |
| notificacoes-lembretes | 🔲 Pending | Medium |

---

## Progresso Atual

```
SDDs: 5 total
- 1 com spec+design+tasks ✅
- 4 pendentes 🔲

Tests:
- Unit: 67 passing ✅
- E2E: 23 passing, 1 skipped ✅
- Coverage: 95%+ ✅
```

---

## Workflow

```
1. Orchestrator cria SDD (specs/ + design.md + tasks.md)
       ↓
2. Distribui tasks via issues/open/
       ↓
3. Agent executa → issues/in_progress/ → issues/done/
       ↓
4. Orchestrator verifica (build, test, lint)
```

---

## Agentes

| Agent | Especialidade |
|-------|---------------|
| @orchestrator | Coordenação, SDD |
| @frontend | UI, components |
| @backend | Domain, APIs |
| @qa | Tests |

---

## Comandos Úteis

```bash
# Ver SDDs
ls specs/

# Ver tasks pendentes
grep "\- \[ \]" specs/*/tasks.md

# Ver issues em aberto
ls issues/open/

# Ver issues completos
ls issues/done/

# Ver progresso
cat PROGRESSO.md

# Rodar todos os testes
npm run test && npm run test:e2e
```

---

## Dúvidas?

1. Sistema de agentes → `AGENTS.md`
2. Como orchestrator trabalha → `ORCHESTRATOR.md`
3. Papéis → `ROLES.md`
4. Issues → `issues/README.md`
5. Progresso → `PROGRESSO.md`