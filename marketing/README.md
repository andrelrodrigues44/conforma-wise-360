# CONFORMA360 Marketing AI

Este diretório é a operação automatizada de marketing do projeto independente Conforma-Wise-360.

## Objetivo

Transformar objetivos comerciais em campanhas, conteúdos e próximos passos mensuráveis para vender:

1. **Consultoria Conforma360** — Meio Ambiente, SST, Compliance, ISO, auditorias, licenciamento e serviços técnicos.
2. **Plataforma Conforma360** — gestão digital de SSMA, Meio Ambiente, Compliance, evidências, indicadores e IA.

## Fluxo

`Objetivo → Estratégia → Conteúdo → Revisão → Aprovação → Publicação → Analytics → Otimização`

A geração pode ser automática. Publicações em canais externos ficam deliberadamente separadas até que as APIs oficiais e credenciais sejam configuradas.

## Automação do repositório

O workflow `.github/workflows/marketing-ai.yml` pode ser executado manualmente ou em agenda semanal. Quando `ANTHROPIC_API_KEY` estiver configurada nos Secrets do GitHub, ele gera uma campanha semanal e grava o resultado em `marketing/generated/`.

### Secrets necessários

- `ANTHROPIC_API_KEY` — obrigatório para geração com Claude.
- `ANTHROPIC_MODEL` — opcional; permite definir o modelo usado pelo workflow.

Nunca coloque chaves no código, `.env` ou arquivos versionados.

## Regra editorial

A IA deve priorizar geração de demanda e vendas, evitando conteúdo genérico. A distribuição recomendada é:

- Dor / risco: 25%
- Educação: 25%
- Autoridade / prova: 20%
- Produto / demonstração: 20%
- Conversão direta: 10%

Todo conteúdo deve ter público, objetivo, CTA e canal definidos.
