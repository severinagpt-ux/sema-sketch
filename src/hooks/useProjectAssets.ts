import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectAsset {
  id: string;
  user_id: string;
  name: string;
  file_url: string;
  thumbnail_url: string | null;
  file_type: string;
  category: string;
  tags: string[];
  file_size: number;
  width: number | null;
  height: number | null;
  is_favorite: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type AssetCategory = 'all' | 'characters' | 'props' | 'scenes' | 'images' | 'video' | 'audio' | 'textures' | 'references' | 'uncategorized';

export function useProjectAssets() {
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchAssets = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('project_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets((data as unknown as ProjectAsset[]) || []);
    } catch (err: any) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const uploadAsset = useCallback(async (file: File, category: AssetCategory = 'uncategorized') => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath);

      // Determine file type
      const mimeType = file.type;
      let fileType = 'other';
      if (mimeType.startsWith('image/')) fileType = 'image';
      else if (mimeType.startsWith('video/')) fileType = 'video';
      else if (mimeType.startsWith('audio/')) fileType = 'audio';

      const { data, error } = await supabase
        .from('project_assets')
        .insert({
          user_id: user.id,
          name: file.name.replace(/\.[^.]+$/, ''),
          file_url: publicUrl,
          file_type: fileType,
          category,
          file_size: file.size,
          tags: [],
          metadata: { original_name: file.name, mime_type: mimeType },
        })
        .select()
        .single();

      if (error) throw error;
      setAssets(prev => [(data as unknown as ProjectAsset), ...prev]);
      toast({ title: 'Asset uploaded', description: file.name });
      return data as unknown as ProjectAsset;
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const toggleFavorite = useCallback(async (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;
    const newVal = !asset.is_favorite;
    setAssets(prev => prev.map(a => a.id === id ? { ...a, is_favorite: newVal } : a));
    await supabase.from('project_assets').update({ is_favorite: newVal }).eq('id', id);
  }, [assets]);

  const updateCategory = useCallback(async (id: string, category: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, category } : a));
    await supabase.from('project_assets').update({ category }).eq('id', id);
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;
    setAssets(prev => prev.filter(a => a.id !== id));
    await supabase.from('project_assets').delete().eq('id', id);
    toast({ title: 'Asset deleted' });
  }, [assets, toast]);

  const renameAsset = useCallback(async (id: string, name: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, name } : a));
    await supabase.from('project_assets').update({ name }).eq('id', id);
  }, []);

  return { assets, loading, uploading, uploadAsset, toggleFavorite, updateCategory, deleteAsset, renameAsset, refetch: fetchAssets };
}
