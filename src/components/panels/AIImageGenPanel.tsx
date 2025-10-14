import { useState } from 'react';
import { Sparkles, Plus, Image as ImageIcon, Brush, Settings as SettingsIcon, Trash2, Edit, GripVertical, Upload, Download, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface Reference {
  id: string;
  type: 'image' | 'sketch';
  name: string;
  imageUrl?: string;
  color?: string; // For sketch layers
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
    toast.info('Analyzing composition...');
    // Simulate AI analysis
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
        toast.success('Image generated successfully!');
        // TODO: Display the generated image
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
      {/* Header */}
      <div className="px-4 py-3 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Instructional Composition (ICE)</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Nano Banana - Advanced Image Generation</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Base Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">User Idea (Base Prompt)</label>
            <Textarea
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="A futuristic cityscape at dusk, cinematic lighting..."
              className="min-h-[80px]"
            />
          </div>

          {/* Add Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => addReference('image')}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => addReference('sketch')}
            >
              <Brush className="w-4 h-4 mr-2" />
              Add Sketch Layer
            </Button>
          </div>

          {/* Composition Stack */}
          {references.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Composition Stack</label>
              {references.map((ref, index) => (
                <div
                  key={ref.id}
                  className={`border rounded-lg p-3 bg-background ${
                    selectedRef === ref.id ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setSelectedRef(ref.id)}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-1 cursor-move" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {ref.type === 'sketch' ? (
                          <div 
                            className="w-4 h-4 rounded border-2"
                            style={{ 
                              backgroundColor: ref.color?.toLowerCase(),
                              borderColor: ref.color?.toLowerCase() 
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                        <Input
                          value={ref.name}
                          onChange={(e) => {
                            setReferences(references.map(r => 
                              r.id === ref.id ? { ...r, name: e.target.value } : r
                            ));
                          }}
                          className="h-7 text-sm font-medium"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeReference(ref.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Reference Image Upload */}
                      {ref.type === 'image' && !ref.imageUrl && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-3 h-3 mr-2" />
                          Upload Reference Image
                        </Button>
                      )}

                      {/* Sketch Canvas */}
                      {ref.type === 'sketch' && (
                        <div className="bg-muted rounded p-2 text-xs text-center">
                          <Brush className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <p className="text-muted-foreground">Click Edit to open sketch canvas</p>
                        </div>
                      )}

                      {/* Layer Prompt */}
                      <Textarea
                        value={ref.prompt}
                        onChange={(e) => updateRefPrompt(ref.id, e.target.value)}
                        placeholder={ref.type === 'sketch' 
                          ? `The ${ref.color} sketch defines the pose and position for...`
                          : 'Describe how to use this reference...'
                        }
                        className="min-h-[60px] text-xs"
                      />

                      {/* Negative Prompt (optional) */}
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground">Negative Prompt</summary>
                        <Textarea
                          value={ref.negativePrompt || ''}
                          onChange={(e) => {
                            setReferences(references.map(r => 
                              r.id === ref.id ? { ...r, negativePrompt: e.target.value } : r
                            ));
                          }}
                          placeholder="Avoid pastel colors..."
                          className="min-h-[40px] text-xs mt-1"
                        />
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Advanced Settings */}
          <div className="border rounded-lg">
            <button
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Settings</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {showAdvanced ? '▼' : '▶'}
              </span>
            </button>
            
            {showAdvanced && (
              <div className="p-3 border-t space-y-4">
                {/* Camera Settings */}
                <div className="space-y-2">
                  <label className="text-xs font-medium">Camera Settings</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={cameraLens} onValueChange={setCameraLens}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24mm">24mm</SelectItem>
                        <SelectItem value="35mm">35mm</SelectItem>
                        <SelectItem value="50mm">50mm</SelectItem>
                        <SelectItem value="85mm">85mm</SelectItem>
                        <SelectItem value="135mm">135mm</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={aperture} onValueChange={setAperture}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="f/1.4">f/1.4</SelectItem>
                        <SelectItem value="f/1.8">f/1.8</SelectItem>
                        <SelectItem value="f/2.8">f/2.8</SelectItem>
                        <SelectItem value="f/4">f/4</SelectItem>
                        <SelectItem value="f/5.6">f/5.6</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={shutter} onValueChange={setShutter}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1/30s">1/30s</SelectItem>
                        <SelectItem value="1/60s">1/60s</SelectItem>
                        <SelectItem value="1/125s">1/125s</SelectItem>
                        <SelectItem value="1/250s">1/250s</SelectItem>
                        <SelectItem value="1/500s">1/500s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Smart Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-xs font-medium">Smart Aspect Ratio System</label>
                  <div className="flex items-center gap-2">
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1 Square</SelectItem>
                        <SelectItem value="4:3">4:3 Standard</SelectItem>
                        <SelectItem value="16:9">16:9 Widescreen</SelectItem>
                        <SelectItem value="21:9">21:9 Ultrawide</SelectItem>
                        <SelectItem value="9:16">9:16 Portrait</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={enforceAspect} 
                        onCheckedChange={setEnforceAspect}
                      />
                      <span className="text-xs">Enforce on refs</span>
                    </div>
                  </div>
                </div>

                {/* Style & Quality */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Style</label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="photorealistic">Photorealistic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Quality</label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="ultra">Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis & Final Prompt */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={analyzePrompt}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Prompt (AI Co-pilot)
            </Button>

            {showEnhanced && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Complexity Meter</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${complexity}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{complexity}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Assembled Prompt (Read-only)</label>
                  <Textarea
                    value={enhancedPrompt}
                    readOnly
                    className="min-h-[120px] text-xs font-mono bg-muted"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="p-4 border-t border-panel-border shrink-0">
        <Button
          className="w-full"
          size="lg"
          onClick={generateImage}
          disabled={isGenerating || !basePrompt.trim()}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              GENERATE
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
