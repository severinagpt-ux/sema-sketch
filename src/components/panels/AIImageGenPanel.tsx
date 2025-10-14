import { useState } from 'react';
import { Sparkles, Plus, Image as ImageIcon, Brush, Settings as SettingsIcon, Trash2, GripVertical, Upload, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface Reference {
  id: string;
  type: 'image' | 'sketch';
  name: string;
  imageUrl?: string;
  color?: string;
  prompt: string;
  negativePrompt?: string;
  opacity: number;
}

export const AIImageGenPanel = () => {
  const [basePrompt, setBasePrompt] = useState('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);
  
  // Advanced settings
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [enforceAspect, setEnforceAspect] = useState(true);
  const [cameraLens, setCameraLens] = useState('50mm');
  const [aperture, setAperture] = useState('f/1.8');
  const [shutter, setShutter] = useState('1/125s');
  const [style, setStyle] = useState('cinematic');
  const [quality, setQuality] = useState('high');
  
  // AI Analysis
  const [complexity, setComplexity] = useState(0);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const sketchColors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'CYAN', 'MAGENTA'];

  const addReference = (type: 'image' | 'sketch') => {
    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      type,
      name: type === 'image' ? 'New Reference' : `Sketch Layer (${sketchColors[references.filter(r => r.type === 'sketch').length % sketchColors.length]})`,
      color: type === 'sketch' ? sketchColors[references.filter(r => r.type === 'sketch').length % sketchColors.length] : undefined,
      prompt: '',
      opacity: 1.0,
    };
    setReferences([...references, newRef]);
    toast.success(`${type === 'image' ? 'Reference' : 'Sketch layer'} added`);
  };

  const removeReference = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
    if (selectedRef === id) setSelectedRef(null);
  };

  const updateRefPrompt = (id: string, prompt: string) => {
    setReferences(references.map(r => r.id === id ? { ...r, prompt } : r));
  };

  const analyzePrompt = async () => {
    setIsAnalyzing(true);
    toast.info('Analyzing composition...');
    
    setTimeout(() => {
      const complexityScore = Math.min(100, (basePrompt.length + references.length * 20));
      setComplexity(complexityScore);
      
      const assembled = `BASE PROMPT: ${basePrompt}\n\n${references.map((ref, i) => {
        if (ref.type === 'sketch') {
          return `IMAGE ${i + 1} is a ${ref.color} sketch overlay defining spatial structure.\nPrompt: ${ref.prompt}`;
        }
        return `IMAGE ${i + 1} is a reference image.\nPrompt: ${ref.prompt}`;
      }).join('\n\n')}`;
      
      setEnhancedPrompt(assembled);
      setShowEnhanced(true);
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }, 1500);
  };

  const generateImage = async () => {
    if (!basePrompt.trim()) {
      toast.error('Please enter a base prompt');
      return;
    }

    setIsGenerating(true);
    toast.info('Generating image with nano banana...');

    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY || 'demo-key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: enhancedPrompt || basePrompt
            }
          ],
          modalities: ['image', 'text']
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
          return;
        }
        if (response.status === 402) {
          toast.error('Payment required. Please add credits to your workspace.');
          return;
        }
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="px-3 py-2 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">ICE - Nano Banana</h3>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* Base Prompt */}
          <div className="space-y-1">
            <label className="text-xs font-medium">Base Prompt</label>
            <Textarea
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="A futuristic cityscape at dusk..."
              className="min-h-[60px] text-xs resize-none"
            />
          </div>

          {/* Add Buttons */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => addReference('image')}
            >
              <ImageIcon className="w-3 h-3 mr-1" />
              Reference
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => addReference('sketch')}
            >
              <Brush className="w-3 h-3 mr-1" />
              Sketch
            </Button>
          </div>

          {/* Composition Stack */}
          {references.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium">Layers</label>
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="border rounded p-2 bg-background space-y-1"
                >
                  <div className="flex items-center gap-1">
                    <GripVertical className="w-3 h-3 text-muted-foreground cursor-move shrink-0" />
                    {ref.type === 'sketch' ? (
                      <div 
                        className="w-3 h-3 rounded border shrink-0"
                        style={{ 
                          backgroundColor: ref.color?.toLowerCase(),
                          borderColor: ref.color?.toLowerCase() 
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-3 h-3 shrink-0" />
                    )}
                    <Input
                      value={ref.name}
                      onChange={(e) => {
                        setReferences(references.map(r => 
                          r.id === ref.id ? { ...r, name: e.target.value } : r
                        ));
                      }}
                      className="h-6 text-xs flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeReference(ref.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <Textarea
                    value={ref.prompt}
                    onChange={(e) => updateRefPrompt(ref.id, e.target.value)}
                    placeholder={ref.type === 'sketch' 
                      ? `The ${ref.color} sketch defines...`
                      : 'Use this reference for...'
                    }
                    className="min-h-[40px] text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Advanced Settings */}
          <div className="border rounded">
            <button
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div className="flex items-center gap-1">
                <SettingsIcon className="w-3 h-3" />
                <span className="text-xs font-medium">Advanced</span>
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            
            {showAdvanced && (
              <div className="p-2 border-t space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <Select value={cameraLens} onValueChange={setCameraLens}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24mm">24mm</SelectItem>
                      <SelectItem value="50mm">50mm</SelectItem>
                      <SelectItem value="85mm">85mm</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={aperture} onValueChange={setAperture}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="f/1.4">f/1.4</SelectItem>
                      <SelectItem value="f/1.8">f/1.8</SelectItem>
                      <SelectItem value="f/2.8">f/2.8</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={shutter} onValueChange={setShutter}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1/60s">1/60s</SelectItem>
                      <SelectItem value="1/125s">1/125s</SelectItem>
                      <SelectItem value="1/250s">1/250s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch checked={enforceAspect} onCheckedChange={setEnforceAspect} />
                  <span className="text-xs shrink-0">Enforce</span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="photorealistic">Photo</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Analysis */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7"
              onClick={analyzePrompt}
              disabled={isAnalyzing || !basePrompt}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Analyze
                </>
              )}
            </Button>

            {showEnhanced && (
              <div className="space-y-1 border rounded p-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-secondary rounded overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${complexity}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium shrink-0">{complexity}%</span>
                </div>
                
                <Textarea
                  value={enhancedPrompt}
                  readOnly
                  className="min-h-[60px] text-xs font-mono bg-secondary resize-none"
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateImage}
            disabled={isGenerating || !basePrompt}
            className="w-full h-8"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              'GENERATE'
            )}
          </Button>

          {/* Generated Image */}
          {generatedImage && (
            <div className="space-y-1 border rounded p-2">
              <label className="text-xs font-medium">Result</label>
              <img src={generatedImage} alt="Generated" className="w-full rounded" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};