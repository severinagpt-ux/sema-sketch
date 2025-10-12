import { useState } from 'react';
import { Sparkles, Image, Upload, Layers, Plus, X, Wand2, Download, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface Reference {
  id: string;
  type: 'layer' | 'asset' | 'upload' | 'canvas';
  name: string;
  thumbnail: string;
  prompt?: string;
  opacity: number;
  hasMask: boolean;
}

export const AIImageGenPanel = () => {
  const [mainPrompt, setMainPrompt] = useState('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [realism, setRealism] = useState(50);
  const [quality, setQuality] = useState('balanced');
  const [confidence, setConfidence] = useState(0);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [showRefSelector, setShowRefSelector] = useState(false);

  const addReference = (type: Reference['type']) => {
    const newRef: Reference = {
      id: Date.now().toString(),
      type,
      name: `${type} reference ${references.length + 1}`,
      thumbnail: '',
      opacity: 100,
      hasMask: false,
    };
    setReferences([...references, newRef]);
    setShowRefSelector(false);
  };

  const removeReference = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
    if (selectedRef === id) setSelectedRef(null);
  };

  const updateRefPrompt = (id: string, prompt: string) => {
    setReferences(references.map(r => r.id === id ? { ...r, prompt } : r));
  };

  const analyzePrompt = () => {
    // Simulate AI analysis
    setConfidence(Math.floor(Math.random() * 30) + 70);
    setEnhancedPrompt(`Enhanced: ${mainPrompt} with improved lighting, professional composition, and cinematic quality`);
    setShowEnhanced(true);
  };

  const realismLabels = ['Cartoon', 'Anime', 'Manga', 'Artistic', '3D Render', 'Realistic'];
  const cameraLabels = ['Normal', 'Cellphone', 'Polaroid', 'DSLR', 'IMAX'];

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="border-b border-panel-border px-4 py-2">
        <h2 className="text-sm font-semibold">AI Image Generation</h2>
        <p className="text-xs text-muted-foreground">Powered by Nano Banana</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main Prompt */}
        <div className="space-y-2">
          <Label className="text-xs">Main Prompt</Label>
          <Textarea
            value={mainPrompt}
            onChange={(e) => setMainPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="min-h-[80px] text-sm"
          />
        </div>

        {/* AI Enhancement */}
        {mainPrompt && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={analyzePrompt}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI Enhance Prompt
          </Button>
        )}

        {showEnhanced && (
          <div className="space-y-2 p-3 bg-muted/50 rounded border border-primary/20">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Enhanced Prompt</Label>
              <Badge variant={confidence > 80 ? 'default' : 'secondary'}>
                {confidence}% confidence
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{enhancedPrompt}</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setMainPrompt(enhancedPrompt)}
            >
              Use Enhanced Prompt
            </Button>
          </div>
        )}

        {/* References Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">References</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRefSelector(!showRefSelector)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {showRefSelector && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addReference('layer')}
              >
                <Layers className="w-4 h-4 mr-1" />
                Layer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addReference('asset')}
              >
                <Image className="w-4 h-4 mr-1" />
                Asset
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addReference('canvas')}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Canvas
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addReference('upload')}
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>
          )}

          {/* Reference List */}
          <div className="space-y-2">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="p-2 bg-secondary/30 rounded border border-panel-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      {ref.type === 'layer' && <Layers className="w-4 h-4" />}
                      {ref.type === 'asset' && <Image className="w-4 h-4" />}
                      {ref.type === 'upload' && <Upload className="w-4 h-4" />}
                      {ref.type === 'canvas' && <Sparkles className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{ref.name}</div>
                      <div className="text-[10px] text-muted-foreground">{ref.type}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeReference(ref.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {/* Reference Controls */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Opacity: {ref.opacity}%</Label>
                    <Slider
                      value={[ref.opacity]}
                      onValueChange={(v) => {
                        setReferences(references.map(r =>
                          r.id === ref.id ? { ...r, opacity: v[0] } : r
                        ));
                      }}
                      min={0}
                      max={100}
                      className="h-1"
                    />
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant={ref.hasMask ? 'default' : 'secondary'}
                      size="sm"
                      className="flex-1 h-6 text-[10px]"
                      onClick={() => {
                        setReferences(references.map(r =>
                          r.id === ref.id ? { ...r, hasMask: !r.hasMask } : r
                        ));
                      }}
                    >
                      Mask
                    </Button>
                  </div>

                  <Textarea
                    value={ref.prompt || ''}
                    onChange={(e) => updateRefPrompt(ref.id, e.target.value)}
                    placeholder="Reference-specific prompt..."
                    className="min-h-[40px] text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3 pt-2 border-t border-panel-border">
          <Label className="text-xs font-medium">Advanced Settings</Label>

          {/* Realism Slider */}
          <div className="space-y-2">
            <Label className="text-xs">Style: {realismLabels[Math.floor(realism / 20)]}</Label>
            <Slider
              value={[realism]}
              onValueChange={(v) => setRealism(v[0])}
              min={0}
              max={100}
              step={20}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {realismLabels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>

          {/* Camera Quality */}
          <div className="space-y-2">
            <Label className="text-xs">Camera Quality</Label>
            <Select defaultValue="dslr">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cameraLabels.map(cam => (
                  <SelectItem key={cam} value={cam.toLowerCase()}>{cam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <Label className="text-xs">Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="high">High Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label className="text-xs">Aspect Ratio</Label>
            <div className="grid grid-cols-3 gap-1">
              <Button variant="secondary" size="sm" className="h-7 text-xs">1:1</Button>
              <Button variant="secondary" size="sm" className="h-7 text-xs">16:9</Button>
              <Button variant="secondary" size="sm" className="h-7 text-xs">4:3</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-panel-border space-y-2">
        <Button className="w-full" disabled={!mainPrompt}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Image
        </Button>
        
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" size="sm">
            <Layers className="w-3 h-3 mr-1" />
            <span className="text-xs">To Layer</span>
          </Button>
          <Button variant="secondary" size="sm">
            <Image className="w-3 h-3 mr-1" />
            <span className="text-xs">To Asset</span>
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-3 h-3 mr-1" />
            <span className="text-xs">Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
