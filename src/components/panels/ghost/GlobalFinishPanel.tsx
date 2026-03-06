import { useState } from 'react';
import { Crown, Loader2, Upload, ChevronDown, Wand2, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { useGhostEngine } from '@/hooks/useGhostEngine';

const FINISH_TYPES = [
  { value: 'harmonize', label: 'Harmonize', desc: 'Unify style, lighting & color', icon: '🎨' },
  { value: 'relight', label: 'Relight', desc: 'Re-interpret scene lighting', icon: '💡' },
  { value: 'color_grade', label: 'Color Grade', desc: 'Professional color grading', icon: '🎬' },
  { value: 'style_unify', label: 'Style Unify', desc: 'Fix style inconsistencies', icon: '✨' },
  { value: 'enhance', label: 'Enhance', desc: 'Overall polish and detail', icon: '🔍' },
  { value: 'depth_of_field', label: 'Depth of Field', desc: 'Natural bokeh effect', icon: '📷' },
];

const STYLE_PRESETS = [
  'cinematic warm', 'cinematic cool', 'editorial', 'moody dark', 'bright and airy',
  'vintage film', 'high contrast', 'pastel soft', 'golden hour', 'noir',
];

export const GlobalFinishPanel = () => {
  const { isFinishing, globalFinish, finishedImage, setFinishedImage, currentGraph } = useGhostEngine();
  const [imageUrl, setImageUrl] = useState('');
  const [finishType, setFinishType] = useState('harmonize');
  const [style, setStyle] = useState('cinematic warm');
  const [intensity, setIntensity] = useState(50);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showBefore, setShowBefore] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFinish = () => {
    if (!imageUrl) return;
    const intensityLabel = intensity < 30 ? 'subtle' : intensity < 70 ? 'medium' : 'strong';
    globalFinish(imageUrl, finishType, { style, intensity: intensityLabel, prompt: customPrompt || undefined });
  };

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="px-3 py-2 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-xs">Global Finish</h3>
          <Badge className="text-[9px] ml-auto bg-primary/20 text-primary border-primary/30">🍌 Pro</Badge>
        </div>
        <p className="text-[9px] text-muted-foreground mt-0.5">Whole-image finishing with Nano Banana Pro</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* Image Upload */}
          <label className="relative cursor-pointer block">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img src={showBefore ? imageUrl : (finishedImage || imageUrl)} alt="Image" className="w-full h-36 object-cover" />
                {finishedImage && (
                  <div className="absolute bottom-1 left-1">
                    <Badge variant="secondary" className="text-[8px]">{showBefore ? 'Before' : 'After'}</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-panel-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Upload image for finishing</span>
              </div>
            )}
          </label>

          {finishedImage && (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="flex-1 h-6 text-[10px]"
                onMouseDown={() => setShowBefore(true)} onMouseUp={() => setShowBefore(false)} onMouseLeave={() => setShowBefore(false)}>
                Hold for Before
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFinishedImage(null)}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Finish Type */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium">Finish Type</label>
            <div className="grid grid-cols-2 gap-1">
              {FINISH_TYPES.map(ft => (
                <button
                  key={ft.value}
                  className={`p-1.5 rounded border text-left transition-colors ${
                    finishType === ft.value
                      ? 'border-primary bg-primary/10'
                      : 'border-panel-border hover:border-primary/30'
                  }`}
                  onClick={() => setFinishType(ft.value)}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{ft.icon}</span>
                    <span className="text-[10px] font-medium">{ft.label}</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground mt-0.5">{ft.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Style Preset */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium">Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STYLE_PRESETS.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Intensity */}
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <label className="text-[10px] font-medium">Intensity</label>
              <span className="text-[9px] font-mono text-muted-foreground">{intensity}%</span>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={([v]) => setIntensity(v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Custom Prompt */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium">Custom Instructions</label>
            <Textarea
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="e.g. warm golden tones, dramatic shadows..."
              className="min-h-[30px] text-[10px] resize-none"
            />
          </div>

          {/* Generate */}
          <Button onClick={handleFinish} disabled={isFinishing || !imageUrl} className="w-full h-8">
            {isFinishing ? (
              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /><span className="text-[10px]">Finishing...</span></>
            ) : (
              <><Wand2 className="w-3 h-3 mr-1" /><span className="text-[10px] font-semibold">APPLY FINISH</span></>
            )}
          </Button>

          {/* Execution Graph */}
          {currentGraph?.graphType === 'GLOBAL_FINISH' && currentGraph.nodes.length > 0 && (
            <div className="border rounded-lg p-2 space-y-0.5">
              <span className="text-[10px] font-semibold">Pipeline</span>
              {currentGraph.nodes.map(n => (
                <div key={n.id} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    n.status === 'COMPLETED' ? 'bg-emerald-400' :
                    n.status === 'RUNNING' ? 'bg-primary animate-pulse' :
                    n.status === 'FAILED' ? 'bg-red-400' : 'bg-muted'
                  }`} />
                  <span className="text-[9px]">{n.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
