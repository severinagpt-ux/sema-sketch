import { useState } from 'react';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tool } from '@/lib/types';

interface SettingsPanelProps {
  activeTool: Tool;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const SettingsPanel = ({ activeTool, isMinimized, onToggleMinimize }: SettingsPanelProps) => {
  const [brushSize, setBrushSize] = useState(50);
  const [opacity, setOpacity] = useState(100);
  const [hardness, setHardness] = useState(75);
  const [flow, setFlow] = useState(100);

  if (isMinimized) {
    return (
      <div className="w-12 bg-panel-bg border-r border-panel-border flex flex-col items-center py-2 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="icon-button"
          onClick={onToggleMinimize}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        {/* Mini Settings */}
        <div className="flex flex-col gap-1 items-center w-full px-1">
          <div className="text-[10px] text-muted-foreground">Size</div>
          <div className="text-xs font-medium">{brushSize}</div>
          
          <div className="w-full h-16 relative mt-1">
            <input
              type="range"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full accent-primary [writing-mode:vertical-lr] rotate-180"
            />
          </div>
          
          <div className="text-[10px] text-muted-foreground mt-2">Opacity</div>
          <div className="text-xs font-medium">{opacity}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-panel-bg border-r border-panel-border flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border">
        <h2 className="text-sm font-semibold">Tool Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          className="icon-button h-6 w-6"
          onClick={onToggleMinimize}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Brush Size</Label>
          <Slider
            value={[brushSize]}
            onValueChange={(v) => setBrushSize(v[0])}
            min={1}
            max={200}
            step={1}
          />
          <div className="text-xs text-right text-muted-foreground">{brushSize}px</div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Opacity</Label>
          <Slider
            value={[opacity]}
            onValueChange={(v) => setOpacity(v[0])}
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-right text-muted-foreground">{opacity}%</div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Hardness</Label>
          <Slider
            value={[hardness]}
            onValueChange={(v) => setHardness(v[0])}
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-right text-muted-foreground">{hardness}%</div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Flow</Label>
          <Slider
            value={[flow]}
            onValueChange={(v) => setFlow(v[0])}
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-right text-muted-foreground">{flow}%</div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-panel-border">
          <Label className="text-xs">Pressure Sensitivity</Label>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Smoothing</Label>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Auto-Erase</Label>
          <Switch />
        </div>
      </div>
    </div>
  );
};
