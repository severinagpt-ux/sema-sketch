-- Create character_batches table for tracking batch generation runs
CREATE TABLE public.character_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error_message TEXT,
  total_shots INTEGER DEFAULT 0,
  completed_shots INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shots table for individual shot tracking
CREATE TABLE public.shots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.character_batches(id) ON DELETE CASCADE,
  shot_key TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('orthographic_body', 'head_angle', 'emotion', 'outfit_angle', 'feature_closeup')),
  angle_deg INTEGER,
  framing TEXT NOT NULL CHECK (framing IN ('full_body', 'mid', 'head')),
  expression TEXT,
  outfit_id TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT '3:4',
  resolution TEXT NOT NULL DEFAULT '2K',
  background TEXT NOT NULL DEFAULT 'white_room',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'done', 'failed')),
  image_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.character_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shots ENABLE ROW LEVEL SECURITY;

-- RLS policies for character_batches
CREATE POLICY "Users can view their own batches" ON public.character_batches
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_batches.character_id AND characters.user_id = auth.uid()
  ));

CREATE POLICY "Users can create batches for their characters" ON public.character_batches
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_batches.character_id AND characters.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own batches" ON public.character_batches
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_batches.character_id AND characters.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own batches" ON public.character_batches
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_batches.character_id AND characters.user_id = auth.uid()
  ));

-- RLS policies for shots
CREATE POLICY "Users can view their own shots" ON public.shots
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM character_batches cb
    JOIN characters c ON c.id = cb.character_id
    WHERE cb.id = shots.batch_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can create shots for their batches" ON public.shots
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM character_batches cb
    JOIN characters c ON c.id = cb.character_id
    WHERE cb.id = shots.batch_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own shots" ON public.shots
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM character_batches cb
    JOIN characters c ON c.id = cb.character_id
    WHERE cb.id = shots.batch_id AND c.user_id = auth.uid()
  ));

-- Add triggers for updated_at
CREATE TRIGGER update_character_batches_updated_at
  BEFORE UPDATE ON public.character_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shots_updated_at
  BEFORE UPDATE ON public.shots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add reference_url column to characters if not exists
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS reference_url TEXT;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS style_tags TEXT;