
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
