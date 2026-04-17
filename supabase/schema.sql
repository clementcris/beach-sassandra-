-- Active: PostgreSQL
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (synced with auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for syncing auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, nom, email, telephone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'telephone',
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  lieu TEXT NOT NULL,
  prix_total NUMERIC NOT NULL CHECK (prix_total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_validation', 'partiel', 'payé')),
  montant_total NUMERIC NOT NULL CHECK (montant_total >= 0),
  montant_paye NUMERIC NOT NULL DEFAULT 0 CHECK (montant_paye >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  montant NUMERIC NOT NULL CHECK (montant > 0),
  methode TEXT NOT NULL,
  numero_transaction TEXT NOT NULL,
  preuve_image_url TEXT,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'validé', 'refusé')),
  date_paiement TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valide_par UUID REFERENCES public.users(id),
  date_validation TIMESTAMP WITH TIME ZONE
);

-- 5. Scans table
CREATE TABLE public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  date_scan TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valide BOOLEAN NOT NULL
);

-- ----------------------------------------------------
-- SECURITE : ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;


-- Users
CREATE POLICY "Les utilisateurs voient leur profil, les admins voient tout" 
ON public.users FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Les utilisateurs modifient leur propre profil" 
ON public.users FOR UPDATE 
USING (auth.uid() = id OR public.is_admin());

-- Events
CREATE POLICY "Tout le monde peut voir les événements" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Seuls les admins peuvent gérer les événements" 
ON public.events FOR ALL USING (public.is_admin());

-- Tickets
CREATE POLICY "Les utilisateurs voient leurs tickets, les admins voient tout" 
ON public.tickets FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Les utilisateurs peuvent créer leurs billets" 
ON public.tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Seuls les admins peuvent modifier les billets" 
ON public.tickets FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Seuls les admins peuvent supprimer les billets" 
ON public.tickets FOR DELETE 
USING (public.is_admin());

-- Payments
CREATE POLICY "Les utilisateurs voient leurs paiements, les admins voient tout" 
ON public.payments FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND user_id = auth.uid()) 
  OR public.is_admin()
);

CREATE POLICY "Les utilisateurs créent des paiements pour leurs tickets" 
ON public.payments FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND user_id = auth.uid())
);

CREATE POLICY "Les admins gérent les paiements" 
ON public.payments FOR UPDATE 
USING (public.is_admin());

-- Scans
CREATE POLICY "Les admins voient les scans" 
ON public.scans FOR SELECT USING (public.is_admin());

CREATE POLICY "Les admins créent les scans" 
ON public.scans FOR INSERT WITH CHECK (public.is_admin());

-- Storage : Pseudo logic (if required to setup from SQL)
-- You may need to create the bucket 'payment-proofs' via the Supabase Dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false) ON CONFLICT DO NOTHING;
