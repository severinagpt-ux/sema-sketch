import { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Layer } from '@/lib/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface MiniLayersBarProps {
  layers: Layer[];
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerLockToggle: (layerId: string) => void;
}

export const MiniLayersBar = ({ layers, onLayerVisibilityToggle, onLayerLockToggle }: MiniLayersBarProps) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  return (
    <div className="w-16 bg-panel-bg border-l border-panel-border flex flex-col items-center py-2 gap-2 overflow-y-auto">
      {layers.map((layer) => (
        <Popover key={layer.id}>
          <PopoverTrigger asChild>
            <div
              className={`relative w-12 h-12 rounded cursor-pointer border-2 transition-all hover:border-primary/50 ${
                selectedLayer === layer.id ? 'border-primary' : 'border-panel-border'
              }`}
              onClick={() => setSelectedLayer(layer.id)}
            >
              {/* Thumbnail */}
              <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground rounded">
                {layer.name[0]}
              </div>
              
              {/* Modifier Count Badge */}
              {layer.modifiers && layer.modifiers.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold">
                  {layer.modifiers.length}
                </div>
              )}
            </div>
          </PopoverTrigger>
          
          <PopoverContent side="left" className="w-64 p-3">
            <div className="space-y-3">
              <div className="font-medium">{layer.name}</div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start gap-2"
                  onClick={() => onLayerVisibilityToggle(layer.id)}
                >
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {layer.visible ? 'Visible' : 'Hidden'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start gap-2"
                  onClick={() => onLayerLockToggle(layer.id)}
                >
                  {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {layer.locked ? 'Locked' : 'Unlocked'}
                </Button>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Opacity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={layer.opacity}
                  className="w-full accent-primary"
                />
                <div className="text-xs text-right text-muted-foreground mt-1">{layer.opacity}%</div>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                Layer Settings
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};
