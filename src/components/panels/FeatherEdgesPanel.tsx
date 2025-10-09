import { useState } from 'react';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

export const FeatherEdgesPanel = () => {
  const [antiAliasing, setAntiAliasing] = useState(true);
  const [smartFeather, setSmartFeather] = useState(false);
  const [alphaMatting, setAlphaMatting] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold">Feather & Edges</h3>
      
      {/* Anti-aliasing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm">Anti-aliasing</label>
          <Switch checked={antiAliasing} onCheckedChange={setAntiAliasing} />
        </div>
        {antiAliasing && (
          <div className="space-y-2 pl-2 border-l-2 border-primary/30">
            <Select defaultValue="gaussian">
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smooth">Smooth</SelectItem>
                <SelectItem value="gaussian">Gaussian</SelectItem>
                <SelectItem value="bilinear">Bilinear</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="balanced">
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="high">High Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Smart Feather */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm">Smart Feather</label>
          <Switch checked={smartFeather} onCheckedChange={setSmartFeather} />
        </div>
        {smartFeather && (
          <div className="pl-2 border-l-2 border-primary/30">
            <Button size="sm" variant="secondary" className="w-full">
              Apply Edge Border
            </Button>
          </div>
        )}
      </div>

      {/* Alpha Matting */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm">Alpha Matting</label>
          <Switch checked={alphaMatting} onCheckedChange={setAlphaMatting} />
        </div>
        {alphaMatting && (
          <div className="space-y-2 pl-2 border-l-2 border-primary/30">
            <Select defaultValue="knn">
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closed-form">Closed Form</SelectItem>
                <SelectItem value="knn">KNN</SelectItem>
                <SelectItem value="learning">Learning-based</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quality</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="75"
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-panel-border">
        <div className="text-xs text-muted-foreground">
          GPU-assisted edge processing with real-time preview. Background adaptation automatically handles color bleed.
        </div>
      </div>
    </div>
  );
};
