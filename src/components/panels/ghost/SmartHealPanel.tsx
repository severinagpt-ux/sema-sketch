import { useState } from 'react';
import { Zap, Loader2, Upload, ChevronDown, ArrowRight, ShieldCheck, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useGhostEngine } from '@/hooks/useGhostEngine';
import type { SmartHealAction } from '@/lib/ghostEngine/types';

const HEAL_ACTIONS: { value: SmartHealAction; label: string; icon: string }[] = [
  { value: 'fix_eyelash', label: 'Fix Eyelashes', icon: '👁️' },
  { value: 'remove_blemish', label: 'Remove Blemish', icon: '✨' },
  { value: 'clean_lip_edge', label: 'Clean Lip Edge', icon: '💋' },
  { value: 'restore_iris_detail', label: 'Restore Iris', icon: '🔵' },
  { value: 'remove_stray_hair', label: 'Remove Stray Hair', icon: '💇' },
  { value: 'heal_skin_patch', label: 'Heal Skin', icon: '🩹' },
  { value: 'repair_seam', label: 'Repair Seam', icon: '🧵' },
  { value: 'remove_dust', label: 'Remove Dust', icon: '🌫️' },
  { value: 'repair_texture', label: 'Repair Texture', icon: '🧱' },
  { value: 'remove_object', label: 'Remove Object', icon: '🗑️' },
  { value: 'clean_reflection', label: 'Clean Reflection', icon: '🪞' },
];

export const SmartHealPanel = () => {
  const { intent, isHealing, inferIntent, smartHeal, healedImage, currentGraph, setHealedImage } = useGhostEngine();
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAction, setSelectedAction] = useState<SmartHealAction>('remove_blemish');
  const [roi, setRoi] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [modelOverride, setModelOverride] = useState<string>('AUTO');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleInferIntent = () => {
    if (!imageUrl) return;
    inferIntent(imageUrl, roi || undefined, customPrompt || undefined);
  };

  const handleHeal = () => {
    if (!imageUrl) return;
    const action = intent?.predictedAction || selectedAction;
    smartHeal(imageUrl, action, {
      roi: roi || undefined,
      prompt: customPrompt || undefined,
      modelTier: modelOverride !== 'AUTO' ? modelOverride : undefined,
    });
  };

  const graphNodes = currentGraph?.nodes || [];
  const isRunning = currentGraph?.status === 'RUNNING';

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="px-3 py-2 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-xs">Smart Heal</h3>
          <Badge variant="outline" className="text-[9px] ml-auto">S2DB</Badge>
        </div>
        <p className="text-[9px] text-muted-foreground mt-0.5">Intent-aware local corrective editing</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* Image Upload */}
          <label className="relative cursor-pointer block">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img src={imageUrl} alt="Source" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px]">Replace</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-panel-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Upload image to heal</span>
              </div>
            )}
          </label>

          {/* Action Selector */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium">Quick Action</label>
            <div className="grid grid-cols-3 gap-0.5">
              {HEAL_ACTIONS.slice(0, 9).map(a => (
                <button
                  key={a.value}
                  className={`p-1.5 rounded border text-center transition-colors ${
                    selectedAction === a.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-panel-border hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedAction(a.value)}
                >
                  <span className="text-sm block">{a.icon}</span>
                  <span className="text-[8px] block leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ROI Description */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium">Region of Interest</label>
            <Textarea
              value={roi}
              onChange={e => setRoi(e.target.value)}
              placeholder="e.g. upper left eyelash area..."
              className="min-h-[30px] text-[10px] resize-none"
            />
          </div>

          {/* Intent Scout */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-6 text-[10px]"
              onClick={handleInferIntent}
              disabled={isHealing || !imageUrl}
            >
              {isHealing ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ShieldCheck className="w-3 h-3 mr-0.5" />Scout Intent</>}
            </Button>
            <Button
              size="sm"
              className="flex-1 h-6 text-[10px]"
              onClick={handleHeal}
              disabled={isHealing || !imageUrl}
            >
              {isHealing ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Zap className="w-3 h-3 mr-0.5" />Heal</>}
            </Button>
          </div>

          {/* Intent Result */}
          {intent && (
            <div className="border rounded-lg p-2 space-y-1 bg-secondary/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold">Intent Scout Result</span>
                <Badge variant={intent.confidence > 0.85 ? 'default' : 'destructive'} className="text-[8px]">
                  {Math.round(intent.confidence * 100)}%
                </Badge>
              </div>
              <div className="text-[10px]">
                <span className="text-muted-foreground">Action: </span>
                <span className="font-medium">{intent.predictedAction}</span>
              </div>
              <p className="text-[9px] text-muted-foreground">{intent.targetDescription}</p>
              {intent.protectedRegions?.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  {intent.protectedRegions.map((r, i) => (
                    <Badge key={i} variant="outline" className="text-[8px]">{r}</Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1 text-[9px]">
                <span className="text-muted-foreground">Model:</span>
                <Badge variant="outline" className="text-[8px]">
                  {intent.recommendedModel === 'NANO_BANANA_PRO' ? '🍌 Pro' : '🍌 Fast'}
                </Badge>
                {intent.shouldAutoRun && (
                  <Badge className="text-[8px] bg-emerald-500/20 text-emerald-400">Auto-run OK</Badge>
                )}
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <button
            className="w-full flex items-center justify-between p-1.5 border rounded hover:bg-muted/50 transition-colors"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span className="text-[10px] font-medium">Advanced</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
          {showAdvanced && (
            <div className="border rounded p-2 space-y-1.5">
              <div className="space-y-0.5">
                <label className="text-[10px] font-medium">Model Override</label>
                <Select value={modelOverride} onValueChange={setModelOverride}>
                  <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTO">Auto Route</SelectItem>
                    <SelectItem value="NANO_BANANA_2">🍌 Fast (Nano Banana 2)</SelectItem>
                    <SelectItem value="NANO_BANANA_PRO">🍌 Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-medium">Custom Prompt</label>
                <Textarea
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="Additional editing instruction..."
                  className="min-h-[30px] text-[10px] resize-none"
                />
              </div>
            </div>
          )}

          {/* Execution Graph */}
          {graphNodes.length > 0 && currentGraph?.graphType === 'SMART_HEAL' && (
            <div className="border rounded-lg p-2 space-y-0.5">
              <span className="text-[10px] font-semibold">Execution Graph</span>
              {graphNodes.map((n, i) => (
                <div key={n.id} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    n.status === 'COMPLETED' ? 'bg-emerald-400' :
                    n.status === 'RUNNING' ? 'bg-primary animate-pulse' :
                    n.status === 'FAILED' ? 'bg-red-400' : 'bg-muted'
                  }`} />
                  <span className="text-[9px] flex-1">{n.label}</span>
                  {i < graphNodes.length - 1 && <ArrowRight className="w-2 h-2 text-muted-foreground" />}
                </div>
              ))}
            </div>
          )}

          {/* Healed Result */}
          {healedImage && (
            <div className="border rounded-lg p-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold">Result</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setHealedImage(null)}>
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
              <img src={healedImage} alt="Healed" className="w-full rounded" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
