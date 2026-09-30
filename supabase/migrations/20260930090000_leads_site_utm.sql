-- Rastreamento de origem de trafego pago (Google Ads, Meta Ads, etc.) por lead. Capturado da
-- URL no navegador (src/lib/utm.ts) e enviado junto com o formulario de contato do site -- sem
-- isso nao da pra saber qual campanha gerou qual lead.

ALTER TABLE public.leads_site
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS gclid TEXT,
  ADD COLUMN IF NOT EXISTS fbclid TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_site_utm_source ON public.leads_site(utm_source);

-- Verificacao
SELECT string_agg(column_name, ', ' ORDER BY column_name) AS colunas_utm
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads_site'
  AND column_name IN ('utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid');
