CREATE TABLE public.leads_site (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  empresa TEXT NOT NULL,
  cargo TEXT,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  mensagem TEXT,
  origem TEXT NOT NULL DEFAULT 'site-institucional',
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads_site ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.leads_site TO service_role;
CREATE INDEX idx_leads_site_created_at ON public.leads_site(created_at DESC);