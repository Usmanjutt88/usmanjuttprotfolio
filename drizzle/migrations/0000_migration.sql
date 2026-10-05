CREATE TABLE public.site_data (
  id integer PRIMARY KEY DEFAULT 1,
  content jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_data TO anon, authenticated;
GRANT ALL ON public.site_data TO service_role;
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.site_data FOR SELECT USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_data;