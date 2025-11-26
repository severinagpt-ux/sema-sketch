import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VisualStyle {
  name: string;
  colorPalette?: string;
  mood?: string;
}

interface StoryboardPanelData {
  scriptDescription: string;
  visualStyle: VisualStyle;
  cameraAngle: string;
  lighting: string;
  characters: string[];
  props: string[];
}

export function useStoryboardAI() {
  const [loading, setLoading] = useState(false);
  const [generatedPanel, setGeneratedPanel] = useState<any | null>(null);

  const generateStoryboardPanel = async (panelData: StoryboardPanelData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-storyboard-panel', {
        body: panelData
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedPanel(data);
      toast.success('Storyboard panel generated successfully!');
      return data;
    } catch (error: any) {
      console.error('Error generating storyboard panel:', error);
      toast.error(error.message || 'Failed to generate storyboard panel');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateFromScript = async (
    scriptText: string,
    visualStyle: VisualStyle = { name: 'Cinematic' }
  ) => {
    // Parse script and generate multiple panels
    setLoading(true);
    try {
      // Split script into scenes/shots (simple line-based splitting for now)
      const lines = scriptText.split('\n').filter(line => line.trim());
      const panels: any[] = [];

      for (const line of lines) {
        if (line.trim().length > 10) {
          const panelData: StoryboardPanelData = {
            scriptDescription: line,
            visualStyle,
            cameraAngle: 'Medium Shot',
            lighting: 'Natural',
            characters: [],
            props: []
          };

          const result = await generateStoryboardPanel(panelData);
          if (result) {
            panels.push(result);
          }
        }
      }

      toast.success(`Generated ${panels.length} storyboard panels!`);
      return panels;
    } catch (error: any) {
      console.error('Error generating from script:', error);
      toast.error(error.message || 'Failed to generate panels from script');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generatedPanel,
    generateStoryboardPanel,
    generateFromScript,
  };
}
