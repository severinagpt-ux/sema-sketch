-- Enable realtime for shots and character_batches tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.shots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.character_batches;

-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for character images
CREATE POLICY "Users can upload their own character images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'character-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

CREATE POLICY "Users can update their own character images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'character-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own character images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'character-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);