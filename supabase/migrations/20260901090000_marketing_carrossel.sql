-- CONFORMA360 Marketing Carousel
-- Permite que um conteúdo de marketing carregue múltiplos slides
-- (carrossel), não só uma imagem única. criativo_url continua sendo a
-- capa/thumbnail (compatibilidade com todo código que só lê esse
-- campo); criativo_urls guarda o array completo, na ordem de exibição,
-- populado por scripts/sync-marketing-creatives.mjs.

ALTER TABLE public.marketing_contents
  ADD COLUMN IF NOT EXISTS criativo_urls JSONB;

COMMENT ON COLUMN public.marketing_contents.criativo_urls IS
  'Array JSON de URLs das imagens do carrossel, em ordem de exibição. NULL ou 1 item = post de imagem única (usar criativo_url).';
