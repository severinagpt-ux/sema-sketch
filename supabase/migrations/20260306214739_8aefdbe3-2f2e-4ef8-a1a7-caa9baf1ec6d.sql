
-- Project assets table for organizing all uploaded files
CREATE TABLE public.project_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  file_type text NOT NULL DEFAULT 'image',
  category text NOT NULL DEFAULT 'uncategorized',
  tags text[] DEFAULT '{}',
  file_size bigint DEFAULT 0,
  width integer,
  height integer,
  is_favorite boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assets" ON public.project_assets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets" ON public.project_assets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets" ON public.project_assets
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets" ON public.project_assets
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_project_assets_updated_at
  BEFORE UPDATE ON public.project_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create project-assets storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('project-assets', 'project-assets', true);

-- Storage policies for project-assets bucket
CREATE POLICY "Users can upload project assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view project assets" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'project-assets');

CREATE POLICY "Users can delete project assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public can view project assets" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'project-assets');
