-- Create character DNA profiles table
CREATE TABLE public.character_dna_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  dna_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  personality_type TEXT,
  dna_profile_id UUID REFERENCES public.character_dna_profiles(id),
  consistency_score NUMERIC(5,2) DEFAULT 0,
  total_generations INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character images table
CREATE TABLE public.character_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL, -- 'angle', 'expression', 'outfit'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.character_dna_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_images ENABLE ROW LEVEL SECURITY;

-- DNA Profiles policies
CREATE POLICY "Users can view their own DNA profiles"
ON public.character_dna_profiles FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own DNA profiles"
ON public.character_dna_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DNA profiles"
ON public.character_dna_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own DNA profiles"
ON public.character_dna_profiles FOR DELETE
USING (auth.uid() = user_id);

-- Characters policies
CREATE POLICY "Users can view their own characters"
ON public.characters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters"
ON public.characters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
ON public.characters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
ON public.characters FOR DELETE
USING (auth.uid() = user_id);

-- Character images policies
CREATE POLICY "Users can view images of their characters"
ON public.character_images FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.characters
  WHERE characters.id = character_images.character_id
  AND characters.user_id = auth.uid()
));

CREATE POLICY "Users can create images for their characters"
ON public.character_images FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.characters
  WHERE characters.id = character_images.character_id
  AND characters.user_id = auth.uid()
));

CREATE POLICY "Users can delete images of their characters"
ON public.character_images FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.characters
  WHERE characters.id = character_images.character_id
  AND characters.user_id = auth.uid()
));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_character_dna_profiles_updated_at
BEFORE UPDATE ON public.character_dna_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
BEFORE UPDATE ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();