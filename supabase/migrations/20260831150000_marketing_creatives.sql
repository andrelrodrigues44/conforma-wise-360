-- CONFORMA360 Marketing Creative Approval
-- Adds a persisted creative image URL so the admin can review the visual together with copy before approval.

ALTER TABLE public.marketing_contents
  ADD COLUMN IF NOT EXISTS criativo_url TEXT,
  ADD COLUMN IF NOT EXISTS criativo_alt TEXT;

CREATE INDEX IF NOT EXISTS idx_marketing_contents_status
  ON public.marketing_contents(status);
