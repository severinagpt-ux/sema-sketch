import { Sliders } from 'lucide-react';
import { useToolContext } from '@/contexts/ToolContext';
import { Switch } from '../ui/switch';

export const InspectorPanel = () => {
  const { settings, updateSettings } = useToolContext();
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sliders className="w-4 h-4" />
        <h3 className="text-sm font-semibold">Tool Properties</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Brush Size</label>
            <span className="text-xs font-medium">{settings.brushSize}px</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={settings.brushSize}
            onChange={(e) => updateSettings({ brushSize: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Opacity</label>
            <span className="text-xs font-medium">{settings.opacity}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={settings.opacity}
            onChange={(e) => updateSettings({ opacity: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Hardness</label>
            <span className="text-xs font-medium">{settings.hardness}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={settings.hardness}
            onChange={(e) => updateSettings({ hardness: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Flow</label>
            <span className="text-xs font-medium">{settings.flow}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={settings.flow}
            onChange={(e) => updateSettings({ flow: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div className="pt-2 border-t border-panel-border space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Smoothing</label>
            <Switch 
              checked={settings.smoothing} 
              onCheckedChange={(checked) => updateSettings({ smoothing: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Pressure Sensitivity</label>
            <Switch 
              checked={settings.pressureSensitivity} 
              onCheckedChange={(checked) => updateSettings({ pressureSensitivity: checked })}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-panel-border">
        <div className="text-xs text-muted-foreground">
          Dynamic properties will update based on the active tool and selection.
        </div>
      </div>
    </div>
  );
};
