import { Eye, EyeOff, Lock, Unlock, Settings, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Layer, Modifier } from '@/lib/types';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';

interface LayersPanelProps {
  onLayerVisibilityToggle: (layerId: string) => void;
}

export const LayersPanel = ({ onLayerVisibilityToggle }: LayersPanelProps) => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Background', visible: true, locked: true, opacity: 100, modifiers: [], maskVisible: false },
    { 
      id: '2', 
      name: 'Layer 1', 
      visible: true, 
      locked: false, 
      opacity: 100, 
      maskVisible: true,
      modifiers: [
        { id: 'm1', type: 'transparency', name: 'Alpha Mask', enabled: true, opacity: 80, maskColor: '#ff0000' },
        { id: 'm2', type: 'filter', name: 'Blur', enabled: true, opacity: 100 }
      ]
    },
    { 
      id: '3', 
      name: 'Layer 2', 
      visible: true, 
      locked: false, 
      opacity: 80, 
      maskVisible: false,
      modifiers: [
        { id: 'm3', type: 'warp', name: 'Distort', enabled: false, opacity: 100 }
      ]
    },
  ]);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(['2']));

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    onLayerVisibilityToggle(id);
  };

  const toggleLayerLock = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  };

  const toggleMaskVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, maskVisible: !l.maskVisible } : l));
  };

  const toggleLayerExpand = (id: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleModifier = (layerId: string, modifierId: string) => {
    setLayers(layers.map(l => 
      l.id === layerId 
        ? {
            ...l,
            modifiers: l.modifiers.map(m => 
              m.id === modifierId ? { ...m, enabled: !m.enabled } : m
            )
          }
        : l
    ));
  };

  const addModifier = (layerId: string) => {
    const newModifier: Modifier = {
      id: `m${Date.now()}`,
      type: 'transparency',
      name: 'New Modifier',
      enabled: true,
      opacity: 100,
    };
    setLayers(layers.map(l => 
      l.id === layerId ? { ...l, modifiers: [...l.modifiers, newModifier] } : l
    ));
  };

  return (
    <div className="p-2 space-y-1">
      {layers.map((layer) => (
        <div key={layer.id} className="space-y-1">
          <div
            className="bg-secondary/50 hover:bg-secondary rounded-md p-2 transition-colors cursor-pointer border border-transparent hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              {/* Expand/Collapse */}
              {layer.modifiers.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerExpand(layer.id);
                  }}
                >
                  {expandedLayers.has(layer.id) ? 
                    <ChevronDown className="w-3 h-3" /> : 
                    <ChevronRight className="w-3 h-3" />
                  }
                </Button>
              )}
              
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground relative">
                {layer.name[0]}
                {layer.modifiers.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {layer.modifiers.length}
                  </Badge>
                )}
              </div>
              
              {/* Layer Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{layer.name}</div>
                <div className="text-xs text-muted-foreground">Opacity: {layer.opacity}%</div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                {layer.maskVisible !== undefined && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 icon-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaskVisibility(layer.id);
                    }}
                    title="Toggle Mask Visibility"
                  >
                    <Eye className={`w-3 h-3 ${layer.maskVisible ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerLock(layer.id);
                  }}
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addModifier(layer.id);
                  }}
                  title="Add Modifier"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Modifiers List */}
          {expandedLayers.has(layer.id) && layer.modifiers.length > 0 && (
            <div className="ml-6 space-y-1">
              {layer.modifiers.map((modifier) => (
                <div
                  key={modifier.id}
                  className="bg-secondary/30 rounded p-2 text-xs flex items-center gap-2 border border-panel-border"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => toggleModifier(layer.id, modifier.id)}
                  >
                    <Eye className={`w-3 h-3 ${modifier.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                  {modifier.maskColor && (
                    <div 
                      className="w-3 h-3 rounded border border-panel-border"
                      style={{ backgroundColor: modifier.maskColor }}
                    />
                  )}
                  <span className="flex-1 truncate">{modifier.name}</span>
                  <span className="text-muted-foreground">{modifier.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
