# CONFORMA360 Marketing AI — Automation Roadmap

## Princípio

O Marketing AI é uma operação comercial independente do SaaS de produção. O repositório `conforma-wise-360` e o projeto Supabase de Marketing são a área de automação e experimentação comercial.

## Fase 1 — Base operacional

- Claude para geração estruturada.
- Supabase Marketing separado.
- Lead Scoring.
- Sales Engine.
- Follow-ups como rascunho.
- Centro privado de Marketing & Sales Intelligence.
- GitHub Actions para rotinas automáticas.

## Fase 2 — Conteúdo

- Biblioteca de marca.
- Calendário editorial.
- Geração por canal.
- Campanhas por linha comercial.
- Fila de revisão/aprovação.
- Reaproveitamento de conteúdo.
- Registro de desempenho.

## Fase 3 — Distribuição

- Instagram via API oficial da Meta.
- LinkedIn via API oficial.
- Agendamento após aprovação.
- Registro de publicação e identificador externo.
- Coleta de métricas quando suportada pela API.

As integrações sociais devem usar OAuth/tokens e Secrets. Nunca armazenar senhas ou tokens em código versionado.

## Fase 4 — Receita

- Captura de leads.
- Classificação por linha comercial.
- Lead Scoring.
- Qualificação assistida por IA.
- Follow-up contextual.
- Pipeline.
- Demonstração/diagnóstico.
- Proposta.
- Negociação.
- Conversão.
- Reativação de oportunidades paradas.

## Fase 5 — Otimização

O agente deve comparar campanhas e conteúdos por:

- leads gerados;
- leads qualificados;
- reuniões/demonstrações;
- diagnósticos;
- propostas;
- conversões;
- custo quando disponível;
- taxa de conversão por canal;
- desempenho por linha comercial.

A IA deve usar os resultados para propor a próxima pauta/campanha, mas não deve alterar regras críticas de segurança ou conformidade sem aprovação.

## Gate de publicação

Nenhuma integração social deve publicar conteúdo automaticamente até que:

1. a conta esteja autenticada pela API oficial;
2. o canal esteja identificado;
3. o conteúdo esteja aprovado;
4. a publicação seja registrada;
5. haja mecanismo de falha e retry controlado.

## Segurança

- Nunca usar `SUPABASE_SERVICE_ROLE_KEY` no frontend.
- O banco de Marketing deve permanecer separado do banco de produção.
- Secrets somente em ambientes apropriados.
- Logs não devem expor tokens, senhas ou dados pessoais desnecessários.
- Dados de leads devem ser tratados de acordo com a finalidade informada e controles aplicáveis de privacidade.
