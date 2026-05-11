# Script para criar agents no Multica
# Execute: chmod +x create-agents.sh && ./create-agents.sh

# Lista de agents a criar
declare -a AGENTS=(
  "frontend-developer:Desenvolvedor especializado em React/Next.js. Implementa features, refina UI, melhora responsividade e dark mode. Segue convenções do AGENTS.md.:opencode"
  "test-engineer:Especialista em testes (Vitest + Playwright). Mantém cobertura ≥80%, escreve testes unitários, integração e e2e. Garante que todos os testes passem antes de merge.:opencode"
  "backend-developer:Desenvolvedor backend focado em Supabase e APIs. Cria endpoints, otimiza queries, gerencia RLS e implementa lógica de negócio.:opencode"
  "security-auditor:Revisor de segurança. Audita políticas RLS do Supabase, verifica proteção de rotas, testa vulnerabilidades e garante conformidade com boas práticas.:opencode"
  "performance-specialist:Otimizador de performance. Reduz bundle size, implementa cache, otimiza queries e melhora Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1).:opencode"
  "devops-engineer:Engenheiro DevOps. Configura CI/CD com GitHub Actions, gerencia deploys na Vercel, configura ambiente e variáveis de produção.:opencode"
  "spec-writer:Especificador OpenSpec. Cria e mantém proposal.md, design.md e specs/*.md. Documenta decisões de arquitetura usando RFC 2119 e GWT scenarios.:opencode"
  "code-reviewer:Revisor de código. Analisa PRs, verifica convenções, sugere melhorias, valida cobertura de testes e approves ou requisita mudanças.:opencode"
  "documentation-writer:Escritor de documentação. Mantém README, CLAUDE.md, JSDoc comments e inline docs atualizados. Garante consistência documental.:opencode"
)

echo "Criando agents no Multica..."
echo ""

for agent in "${AGENTS[@]}"; do
  IFS=':' read -r name description runtime <<< "$agent"
  echo "Criando: $name"
  multica agent create \
    --name "$name" \
    --description "$description" \
    --runtime "$runtime" \
    --visibility workspace
  echo ""
done

echo "Todos os agents foram criados!"
multica agent list