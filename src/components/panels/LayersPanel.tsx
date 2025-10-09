import { Eye, EyeOff, Lock, Unlock, Settings, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Layer } from '@/lib/types';

interface LayersPanelProps {
  onLayerVisibilityToggle: (layerId: string) => void;
}

export const LayersPanel = ({ onLayerVisibilityToggle }: LayersPanelProps) => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Background', visible: true, locked: true, opacity: 100 },
    { id: '2', name: 'Layer 1', visible: true, locked: false, opacity: 100 },
    { id: '3', name: 'Layer 2', visible: true, locked: false, opacity: 80 },
  ]);

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    onLayerVisibilityToggle(id);
  };

  const toggleLayerLock = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  };

  return (
    <div className="p-2 space-y-1">
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="bg-secondary/50 hover:bg-secondary rounded-md p-2 transition-colors cursor-pointer border border-transparent hover:border-primary/30"
        >
          <div className="flex items-center gap-2">
            {/* Thumbnail */}
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
              {layer.name[0]}
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
