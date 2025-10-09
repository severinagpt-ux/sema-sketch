import { Sliders } from 'lucide-react';

export const InspectorPanel = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sliders className="w-4 h-4" />
        <h3 className="text-sm font-semibold">Tool Properties</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Brush Size</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            defaultValue="25"
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Opacity</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="100"
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Hardness</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="75"
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Flow</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="100"
            className="w-full accent-primary"
          />
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
