import { useState } from 'react';
import { Ghost, Eye, EyeOff, Layers, Activity, ArrowRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { useGhostEngine } from '@/hooks/useGhostEngine';
import type { GodModeLevel, BufferViewMode } from '@/lib/ghostEngine/types';

const GOD_MODE_LEVELS: { level: GodModeLevel; label: string; desc: string }[] = [
  { level: 0, label: 'Off', desc: 'Normal polished UX' },
  { level: 1, label: 'Reveal', desc: 'Inspect hidden maps & routing' },
  { level: 2, label: 'Edit', desc: 'Paint on Ghost buffers' },
  { level: 3, label: 'Engineer', desc: 'Full internal inspection' },
];

const VIEW_MODES: { value: BufferViewMode; label: string }[] = [
  { value: 'overlay', label: 'Overlay' },
  { value: 'split', label: 'Split' },
  { value: 'side-by-side', label: 'Side-by-Side' },
  { value: 'heatmap', label: 'Heatmap' },
  { value: 'contour', label: 'Contour' },
  { value: 'alpha-only', label: 'Alpha Only' },
];

export const GodModePanel = () => {
  const { godMode, setGodMode, currentGraph, buffers, analysis } = useGhostEngine();
  const [viewMode, setViewMode] = useState<BufferViewMode>('overlay');
  const [showBuffers, setShowBuffers] = useState(true);
  const [showRouting, setShowRouting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const graphNodes = currentGraph?.nodes || [];

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="px-3 py-2 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-2">
          <Ghost className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-xs">God Mode</h3>
          <Badge variant={godMode > 0 ? 'default' : 'outline'} className="text-[9px] ml-auto">
            Level {godMode}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* God Mode Level Selector */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium">Inspection Level</label>
            <div className="grid grid-cols-4 gap-0.5">
              {GOD_MODE_LEVELS.map(g => (
                <button
                  key={g.level}
                  className={`p-1.5 rounded border text-center transition-colors ${
                    godMode === g.level
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-panel-border hover:border-primary/30'
                  }`}
                  onClick={() => setGodMode(g.level)}
                >
                  <span className="text-[10px] font-bold block">{g.level}</span>
                  <span className="text-[8px] block">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {godMode > 0 && (
            <>
              {/* View Mode */}
              <div className="space-y-0.5">
                <label className="text-[10px] font-medium">View Mode</label>
                <div className="flex flex-wrap gap-0.5">
                  {VIEW_MODES.map(v => (
                    <button
                      key={v.value}
                      className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                        viewMode === v.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-panel-border hover:border-primary/30'
                      }`}
                      onClick={() => setViewMode(v.value)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Execution Graph Timeline */}
              {graphNodes.length > 0 && (
                <div className="border rounded-lg p-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-semibold">Graph: {currentGraph?.graphType}</span>
                    <Badge variant="outline" className="text-[8px] ml-auto">{currentGraph?.status}</Badge>
                  </div>
                  <div className="space-y-0.5">
                    {graphNodes.map((n, i) => (
                      <div key={n.id} className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 border ${
                          n.status === 'COMPLETED' ? 'bg-emerald-400 border-emerald-500' :
                          n.status === 'RUNNING' ? 'bg-primary border-primary animate-pulse' :
                          n.status === 'FAILED' ? 'bg-red-400 border-red-500' :
                          'bg-muted border-muted-foreground/30'
                        }`} />
                        <span className={`text-[9px] flex-1 ${n.status === 'COMPLETED' ? 'text-emerald-400' : n.status === 'RUNNING' ? 'text-primary font-semibold' : ''}`}>
                          {n.label}
                        </span>
                        <Badge variant="outline" className="text-[7px]">{n.kind}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buffer Stack */}
              <button
                className="w-full flex items-center justify-between p-1.5 border rounded hover:bg-muted/50 transition-colors"
                onClick={() => setShowBuffers(!showBuffers)}
              >
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">Buffers ({buffers.length})</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${showBuffers ? 'rotate-180' : ''}`} />
              </button>
              {showBuffers && buffers.length > 0 && (
                <div className="border rounded p-1.5 space-y-0.5">
                  {buffers.map(b => (
                    <div key={b.id} className="flex items-center gap-1.5 bg-secondary/20 rounded p-1">
                      <div className={`w-2 h-2 rounded shrink-0 ${
                        b.visibility === 'USER_VISIBLE' ? 'bg-emerald-400' :
                        b.visibility === 'GOD_MODE_VISIBLE' ? 'bg-primary' :
                        'bg-muted'
                      }`} />
                      <span className="text-[9px] flex-1 font-mono">{b.kind}</span>
                      {b.visibility === 'GOD_MODE_VISIBLE' && godMode >= 1 && (
                        <Eye className="w-3 h-3 text-primary" />
                      )}
                      {b.visibility === 'GHOST_HIDDEN' && (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                      {b.userEditable && godMode >= 2 && (
                        <Badge variant="outline" className="text-[7px]">Editable</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showBuffers && buffers.length === 0 && (
                <div className="border rounded p-2 text-center">
                  <span className="text-[9px] text-muted-foreground">No buffers yet. Run a tool to populate.</span>
                </div>
              )}

              {/* Routing Decision */}
              {currentGraph?.routingDecision && (
                <>
                  <button
                    className="w-full flex items-center justify-between p-1.5 border rounded hover:bg-muted/50 transition-colors"
                    onClick={() => setShowRouting(!showRouting)}
                  >
                    <span className="text-[10px] font-semibold">Routing Decision</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showRouting ? 'rotate-180' : ''}`} />
                  </button>
                  {showRouting && (
                    <div className="border rounded p-2 space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span>Model</span>
                        <Badge variant="outline" className="text-[8px]">
                          {currentGraph.routingDecision.selectedModel === 'NANO_BANANA_PRO' ? '🍌 Pro' : '🍌 Fast'}
                        </Badge>
                      </div>
                      <div className="flex justify-between"><span>Reason</span><span className="text-right text-[9px] text-muted-foreground max-w-[60%]">{currentGraph.routingDecision.reason}</span></div>
                      <div className="flex justify-between"><span>Cost</span><Badge variant="outline" className="text-[8px]">{currentGraph.routingDecision.costHint}</Badge></div>
                      <div className="flex justify-between"><span>Escalation</span><span>{currentGraph.routingDecision.escalationAvailable ? '✅' : '❌'}</span></div>
                    </div>
                  )}
                </>
              )}

              {/* Validation */}
              {currentGraph?.validationReport && (
                <>
                  <button
                    className="w-full flex items-center justify-between p-1.5 border rounded hover:bg-muted/50 transition-colors"
                    onClick={() => setShowValidation(!showValidation)}
                  >
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="text-[10px] font-semibold">Validation</span>
                    </div>
                    <Badge variant={currentGraph.validationReport.passed ? 'default' : 'destructive'} className="text-[8px]">
                      {currentGraph.validationReport.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </button>
                  {showValidation && (
                    <div className="border rounded p-2 space-y-1">
                      {currentGraph.validationReport.tests.map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9px]">
                          <div className={`w-2 h-2 rounded-full ${t.passed ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span className="flex-1">{t.name}</span>
                          {t.score !== undefined && <span className="font-mono">{t.score}%</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Edit Class Indicators */}
              {godMode >= 3 && currentGraph && (
                <div className="border rounded-lg p-2 space-y-1">
                  <span className="text-[10px] font-semibold">System Info</span>
                  <div className="text-[9px] space-y-0.5 font-mono">
                    <div>Graph ID: {currentGraph.id}</div>
                    <div>Created: {new Date(currentGraph.createdAt).toLocaleTimeString()}</div>
                    {currentGraph.completedAt && <div>Completed: {new Date(currentGraph.completedAt).toLocaleTimeString()}</div>}
                    <div>Nodes: {currentGraph.nodes.length}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {godMode === 0 && (
            <div className="border rounded-lg p-4 text-center">
              <Ghost className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">
                Enable God Mode to inspect hidden Ghost Engine state — maps, routing, validation, and buffers.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
