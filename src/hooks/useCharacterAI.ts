import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DNAProfile {
  faceShape: string;
  eyeSize: string;
  noseSize: string;
  mouthSize: string;
  hairStyle: string;
  bodyType: string;
  skinTone: string;
}

interface CharacterData {
  name: string;
  description: string;
  dna: DNAProfile;
  angle?: string;
  expression?: string;
  outfit?: {
    description: string;
    season: string;
    category: string;
  };
}

interface DNALock {
  enabled: boolean;
  referenceFeatures: string;
}

export function useCharacterAI() {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateCharacterImage = async (
    characterData: CharacterData,
    viewType: 'multi-angle' | 'expression' | 'outfit',
    dnaLock?: DNALock
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-image', {
        body: { characterData, viewType, dnaLock }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.imageUrl);
      toast.success('Character image generated successfully!');
      return data;
    } catch (error: any) {
      console.error('Error generating character image:', error);
      toast.error(error.message || 'Failed to generate character image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateConsistency = async (images: string[], dnaProfile: DNAProfile) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-character-consistency', {
        body: { images, dnaProfile }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const score = data.overallScore;
      if (score >= 99) {
        toast.success(`Excellent consistency: ${score}%`);
      } else if (score >= 95) {
        toast.success(`Great consistency: ${score}%`);
      } else if (score >= 90) {
        toast.info(`Good consistency: ${score}%`);
      } else {
        toast.warning(`Consistency needs improvement: ${score}%`);
      }

      return data;
    } catch (error: any) {
      console.error('Error validating consistency:', error);
      toast.error(error.message || 'Failed to validate consistency');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generatedImage,
    generateCharacterImage,
    validateConsistency,
  };
}
