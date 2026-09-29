-- Nova linha comercial "treinamento" (EAD via iSESMT), pro site distinguir
-- lead de contratação de treinamento (turma/equipe) dos leads de
-- consultoria/plataforma já existentes -- mesmo padrão dos 3 valores atuais.

ALTER TABLE public.leads_site DROP CONSTRAINT IF EXISTS leads_site_linha_comercial_check;
ALTER TABLE public.leads_site ADD CONSTRAINT leads_site_linha_comercial_check
  CHECK (linha_comercial IN ('consultoria','plataforma','treinamento','ambos'));

ALTER TABLE public.marketing_campaigns DROP CONSTRAINT IF EXISTS marketing_campaigns_linha_comercial_check;
ALTER TABLE public.marketing_campaigns ADD CONSTRAINT marketing_campaigns_linha_comercial_check
  CHECK (linha_comercial IN ('consultoria','plataforma','treinamento','ambos'));

ALTER TABLE public.marketing_contents DROP CONSTRAINT IF EXISTS marketing_contents_linha_comercial_check;
ALTER TABLE public.marketing_contents ADD CONSTRAINT marketing_contents_linha_comercial_check
  CHECK (linha_comercial IN ('consultoria','plataforma','treinamento','ambos'));

-- Verificacao
SELECT
  (SELECT count(*) FROM pg_constraint WHERE conname = 'leads_site_linha_comercial_check') AS leads_ok,
  (SELECT count(*) FROM pg_constraint WHERE conname = 'marketing_campaigns_linha_comercial_check') AS campaigns_ok,
  (SELECT count(*) FROM pg_constraint WHERE conname = 'marketing_contents_linha_comercial_check') AS contents_ok;
