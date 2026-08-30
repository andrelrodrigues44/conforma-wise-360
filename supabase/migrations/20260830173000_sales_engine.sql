-- CONFORMA360 Sales Engine
-- Adds commercial lifecycle fields to site leads and creates campaign/content/follow-up tables.

ALTER TABLE public.leads_site
  ADD COLUMN IF NOT EXISTS linha_comercial TEXT NOT NULL DEFAULT 'ambos'
    CHECK (linha_comercial IN ('consultoria','plataforma','ambos')),
  ADD COLUMN IF NOT EXISTS interesse TEXT,
  ADD COLUMN IF NOT EXISTS segmento TEXT,
  ADD COLUMN IF NOT EXISTS porte TEXT,
  ADD COLUMN IF NOT EXISTS unidades INTEGER,
  ADD COLUMN IF NOT EXISTS score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS temperatura TEXT NOT NULL DEFAULT 'cold'
    CHECK (temperatura IN ('cold','warm','hot')),
  ADD COLUMN IF NOT EXISTS etapa TEXT NOT NULL DEFAULT 'novo'
    CHECK (etapa IN ('novo','qualificacao','diagnostico','demonstracao','proposta','negociacao','ganho','perdido','nutricao')),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto','em_contato','aguardando','convertido','perdido')),
  ADD COLUMN IF NOT EXISTS proxima_acao TEXT,
  ADD COLUMN IF NOT EXISTS proxima_acao_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ultimo_contato_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consentimento_marketing BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_leads_site_score ON public.leads_site(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_site_temperatura ON public.leads_site(temperatura);
CREATE INDEX IF NOT EXISTS idx_leads_site_etapa ON public.leads_site(etapa);
CREATE INDEX IF NOT EXISTS idx_leads_site_linha_comercial ON public.leads_site(linha_comercial);

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  linha_comercial TEXT NOT NULL DEFAULT 'ambos' CHECK (linha_comercial IN ('consultoria','plataforma','ambos')),
  segmento TEXT,
  periodo_inicio DATE,
  periodo_fim DATE,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho','em_revisao','aprovada','agendada','ativa','encerrada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  canal TEXT NOT NULL CHECK (canal IN ('linkedin','instagram','email','blog','whatsapp')),
  formato TEXT NOT NULL,
  linha_comercial TEXT NOT NULL DEFAULT 'ambos' CHECK (linha_comercial IN ('consultoria','plataforma','ambos')),
  titulo TEXT NOT NULL,
  legenda TEXT,
  cta TEXT,
  criativo_brief TEXT,
  data_publicacao TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho','revisar','aprovado','agendado','publicado','arquivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sales_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads_site(id) ON DELETE CASCADE,
  etapa INTEGER NOT NULL CHECK (etapa BETWEEN 0 AND 30),
  canal TEXT NOT NULL DEFAULT 'email' CHECK (canal IN ('email','whatsapp','linkedin')),
  assunto TEXT,
  mensagem TEXT NOT NULL,
  agendado_para TIMESTAMPTZ,
  enviado_em TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aprovado','agendado','enviado','cancelado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads_site(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_activities ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.marketing_campaigns TO service_role;
GRANT ALL ON public.marketing_contents TO service_role;
GRANT ALL ON public.sales_followups TO service_role;
GRANT ALL ON public.sales_activities TO service_role;
