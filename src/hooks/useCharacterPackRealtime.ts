import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Shot {
  id: string;
  batch_id: string;
  shot_key: string;
  type: string;
  angle_deg: number | null;
  framing: string;
  expression: string | null;
  outfit_id: string | null;
  aspect_ratio: string;
  resolution: string;
  background: string;
  status: string;
  image_url: string | null;
  error_message: string | null;
}

interface Batch {
  id: string;
  character_id: string;
  status: string;
  total_shots: number;
  completed_shots: number;
  error_message: string | null;
  created_at: string;
}

export function useCharacterPackRealtime() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);

  // Subscribe to realtime updates for current batch
  useEffect(() => {
    if (!currentBatch?.id) return;

    // Subscribe to batch updates
    const batchChannel = supabase
      .channel(`batch-${currentBatch.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'character_batches',
          filter: `id=eq.${currentBatch.id}`
        },
        (payload) => {
          const updated = payload.new as Batch;
          setCurrentBatch(updated);
          
          if (updated.status === 'completed') {
            setIsGenerating(false);
            toast.success('Character pack generation completed!');
          } else if (updated.status === 'failed') {
            setIsGenerating(false);
            toast.error(updated.error_message || 'Generation failed');
          }
        }
      )
      .subscribe();

    // Subscribe to shot updates
    const shotsChannel = supabase
      .channel(`shots-${currentBatch.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shots',
          filter: `batch_id=eq.${currentBatch.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setShots(prev => [...prev, payload.new as Shot]);
          } else if (payload.eventType === 'UPDATE') {
            setShots(prev => 
              prev.map(s => s.id === (payload.new as Shot).id ? payload.new as Shot : s)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(batchChannel);
      supabase.removeChannel(shotsChannel);
    };
  }, [currentBatch?.id]);

  const generatePack = useCallback(async (characterId: string) => {
    setIsGenerating(true);
    setShots([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-pack', {
        body: { characterId }
      });

      if (error) {
        throw new Error(error.message);
      }

      setCurrentBatch(data.batch);
      toast.success(`Started generating ${data.totalShots} shots`);
      
      // Load initial shots
      const { data: initialShots } = await supabase
        .from('shots')
        .select('*')
        .eq('batch_id', data.batch.id)
        .order('shot_key');
      
      if (initialShots) {
        setShots(initialShots);
      }
      
      return data.batch;
    } catch (error) {
      console.error('Failed to start generation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start generation');
      setIsGenerating(false);
      return null;
    }
  }, []);

  const loadBatchStatus = useCallback(async (batchId: string) => {
    try {
      const { data: batch, error: batchError } = await supabase
        .from('character_batches')
        .select('*')
        .eq('id', batchId)
        .single();

      if (batchError) throw batchError;
      setCurrentBatch(batch);

      const { data: shotData, error: shotsError } = await supabase
        .from('shots')
        .select('*')
        .eq('batch_id', batchId)
        .order('shot_key');

      if (shotsError) throw shotsError;
      setShots(shotData || []);

      if (batch.status === 'running' || batch.status === 'pending') {
        setIsGenerating(true);
      } else {
        setIsGenerating(false);
      }

      return { batch, shots: shotData };
    } catch (error) {
      console.error('Failed to load batch status:', error);
      return null;
    }
  }, []);

  const loadCharacterBatches = useCallback(async (characterId: string) => {
    try {
      const { data, error } = await supabase
        .from('character_batches')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to load batches:', error);
      return [];
    }
  }, []);

  const loadBatchShots = useCallback(async (batchId: string) => {
    try {
      const { data, error } = await supabase
        .from('shots')
        .select('*')
        .eq('batch_id', batchId)
        .order('shot_key');

      if (error) throw error;
      setShots(data || []);
      return data || [];
    } catch (error) {
      console.error('Failed to load shots:', error);
      return [];
    }
  }, []);

  // Group shots by category
  const groupedShots = {
    turnaround: shots.filter(s => s.type === 'orthographic_body'),
    headAngles: shots.filter(s => s.type === 'head_angle'),
    emotions: shots.filter(s => s.type === 'emotion'),
    outfits: {
      default: shots.filter(s => s.type === 'outfit_angle' && s.outfit_id === 'default'),
      casual: shots.filter(s => s.type === 'outfit_angle' && s.outfit_id === 'casual'),
      battle: shots.filter(s => s.type === 'outfit_angle' && s.outfit_id === 'battle'),
    }
  };

  return {
    isGenerating,
    currentBatch,
    shots,
    groupedShots,
    generatePack,
    loadBatchStatus,
    loadCharacterBatches,
    loadBatchShots,
  };
}
