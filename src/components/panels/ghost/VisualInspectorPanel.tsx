import { useState } from 'react';
import { Eye, Scan, Sparkles, Activity, Zap, Loader2, ChevronDown, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { useGhostEngine } from '@/hooks/useGhostEngine';
import type { VisualAnalysis, SuggestedTool } from '@/lib/ghostEngine/types';

export const VisualInspectorPanel = () => {
  const { analysis, isAnalyzing, analyzeImage } = useGhostEngine();
  const [imageUrl, setImageUrl] = useState('');
  const [showComposition, setShowComposition] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const handleAnalyze = () => {
    if (!imageUrl.trim()) return;
    analyzeImage(imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const priorityColor = (p: string) => {
    if (p === 'HIGH') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (p === 'MEDIUM') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="px-3 py-2 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-xs">Visual Inspector</h3>
          <Badge variant="outline" className="text-[9px] ml-auto">Ghost Engine</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* Upload / URL Input */}
          <div className="space-y-1">
            <label className="relative cursor-pointer block">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <div className="border-2 border-dashed border-panel-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Drop image or click to upload</span>
              </div>
            </label>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !imageUrl}
              className="w-full h-7"
              size="sm"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-3 h-3 mr-1 animate-spin" /><span className="text-[10px]">Analyzing...</span></>
              ) : (
                <><Scan className="w-3 h-3 mr-1" /><span className="text-[10px]">Analyze Image</span></>
              )}
            </Button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Overview */}
              <div className="border rounded-lg p-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold">Image Type</span>
                  <Badge variant="secondary" className="text-[9px]">{analysis.imageType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold">Complexity</span>
                  <div className="flex items-center gap-1.5 flex-1 ml-3">
                    <Progress value={analysis.complexityScore} className="h-1.5 flex-1" />
                    <span className="text-[9px] font-mono w-7 text-right">{analysis.complexityScore}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold">Recommended</span>
                  <Badge variant={analysis.routingRecommendation === 'NANO_BANANA_PRO' ? 'default' : 'outline'} className="text-[9px]">
                    {analysis.routingRecommendation === 'NANO_BANANA_PRO' ? '🍌 Pro' : '🍌 Fast'}
                  </Badge>
                </div>
              </div>

              {/* Subjects */}
              {analysis.subjects?.length > 0 && (
                <div className="border rounded-lg p-2 space-y-1">
                  <span className="text-[10px] font-semibold">Detected Subjects</span>
                  {analysis.subjects.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary/30 rounded p-1.5">
                      <div className="flex-1">
                        <span className="text-[10px] font-medium">{s.label}</span>
                        <span className="text-[9px] text-muted-foreground ml-1">({s.type})</span>
                      </div>
                      <span className="text-[9px] font-mono">{Math.round(s.confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Tools */}
              {analysis.suggestedTools?.length > 0 && (
                <div className="border rounded-lg p-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-semibold">Suggested Tools</span>
                  </div>
                  {analysis.suggestedTools.map((t: SuggestedTool, i: number) => (
                    <div key={i} className={`rounded p-1.5 border ${priorityColor(t.priority)}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium">{t.tool}</span>
                        <Badge variant="outline" className="text-[8px]">{t.editClass}</Badge>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{t.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Composition */}
              <button
                className="w-full flex items-center justify-between p-1.5 border rounded hover:bg-muted/50 transition-colors"
                onClick={() => setShowComposition(!showComposition)}
              >
                <span className="text-[10px] font-semibold">Composition</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showComposition ? 'rotate-180' : ''}`} />
              </button>
              {showComposition && analysis.composition && (
                <div className="border rounded p-2 space-y-1 text-[10px]">
                  <div className="flex justify-between"><span>Rule of Thirds</span><span className="font-mono">{Math.round((analysis.composition.ruleOfThirds || 0) * 100)}%</span></div>
                  <div className="flex justify-between"><span>Symmetry</span><span className="font-mono">{Math.round((analysis.composition.symmetry || 0) * 100)}%</span></div>
                  <div className="flex justify-between"><span>Depth Layers</span><span className="font-mono">{analysis.composition.depthLayers || 0}</span></div>
                  <div className="flex justify-between"><span>Lighting</span><span>{analysis.composition.lightingDirection}</span></div>
                  {analysis.composition.dominantColors?.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {analysis.composition.dominantColors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded border" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Technical Quality */}
              <button
                className="w-full flex items-center justify-between p-1.5 border rounded hover:bg-muted/50 transition-colors"
                onClick={() => setShowTechnical(!showTechnical)}
              >
                <span className="text-[10px] font-semibold">Technical Quality</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
              </button>
              {showTechnical && analysis.technicalQuality && (
                <div className="border rounded p-2 space-y-1.5">
                  {[
                    { label: 'Sharpness', value: analysis.technicalQuality.sharpness },
                    { label: 'Noise', value: analysis.technicalQuality.noise, invert: true },
                    { label: 'Contrast', value: analysis.technicalQuality.contrast },
                    { label: 'Color Balance', value: analysis.technicalQuality.colorBalance },
                    { label: 'Dynamic Range', value: analysis.technicalQuality.dynamicRange },
                  ].map((m, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span>{m.label}</span>
                        <span className="font-mono">{m.value}</span>
                      </div>
                      <Progress value={m.value} className="h-1" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
