# CONFORMA360 Sales Engine

## O que esta fase entrega

- Lead scoring automático na captura do site.
- Classificação HOT/WARM/COLD.
- Pipeline comercial: novo → qualificação → diagnóstico/demonstração → proposta → negociação.
- Tabelas para campanhas, conteúdos, follow-ups e atividades.
- Agente SDR IA que prepara rascunhos de follow-up para aprovação humana.
- Workflow diário do GitHub Actions para processar leads HOT/WARM.

## Secrets do GitHub Actions

Para ativar o workflow `.github/workflows/sales-engine.yml`, configure no repositório:

- `ANTHROPIC_API_KEY` — chave da Claude API já utilizada pelo Marketing AI.
- `SUPABASE_URL` — URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — service role key do Supabase. Nunca colocar no código, `.env` versionado ou frontend.

Opcionalmente, configure a variável `ANTHROPIC_MODEL`. Se ficar vazia, o script usa `claude-sonnet-5`.

## Regra de segurança comercial

O Sales Engine **não envia WhatsApp, e-mail ou LinkedIn automaticamente**. A IA apenas cria rascunhos na tabela `sales_followups` com status `pendente`. A publicação/envio será uma etapa posterior, após aprovação e configuração das APIs oficiais.

## Execução

- Manual: GitHub → Actions → CONFORMA360 Sales Engine → Run workflow.
- Automática: dias úteis, 12:00 UTC (09:00 BRT), com processamento dos leads HOT/WARM abertos.

## Próxima evolução

1. Painel autenticado com dados reais do Supabase.
2. Aprovação de follow-ups.
3. Integração oficial de e-mail/WhatsApp/LinkedIn.
4. Métricas de conversão e receita.
5. Otimização automática das campanhas com base no desempenho.
