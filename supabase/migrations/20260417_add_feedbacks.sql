-- Table pour collecter les retours et suggestions des voyageurs
CREATE TABLE public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sécurité RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs enregistrés peuvent ajouter un feedback
CREATE POLICY "Les utilisateurs peuvent soumettre des feedbacks" 
ON public.feedbacks FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Politique : Seuls les admins peuvent voir les feedbacks
CREATE POLICY "Seuls les admins voient les feedbacks" 
ON public.feedbacks FOR SELECT 
USING (public.is_admin());
