import { useState } from 'react';
import { Settings, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Switch } from '../ui/switch';

interface MicroscopePanelProps {
  size?: 'full' | 'half';
}

export const MicroscopePanel = ({ size = 'full' }: MicroscopePanelProps) => {
  const [pixelSize, setPixelSize] = useState(40);
  const [followMode, setFollowMode] = useState<'buffer' | 'center'>('buffer');
  const [showPixelGrid, setShowPixelGrid] = useState(true);

  return (
    <div className="bg-panel-bg border-2 border-panel-border rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-toolbar border-b border-panel-border shrink-0">
        <div className="flex items-center gap-1 text-xs">
          <Eye className="w-3 h-3" />
          <span>Microscope: {pixelSize}x{pixelSize}px</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Settings className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-64">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Microscope Settings</h4>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Pixel View Size</label>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="10"
                  value={pixelSize}
                  onChange={(e) => setPixelSize(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="text-xs text-right text-muted-foreground">{pixelSize}x{pixelSize}px</div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm">Show Pixel Grid</label>
                <Switch checked={showPixelGrid} onCheckedChange={setShowPixelGrid} />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Follow Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={followMode === 'buffer' ? 'default' : 'secondary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setFollowMode('buffer')}
                  >
                    Buffer
                  </Button>
                  <Button
                    variant={followMode === 'center' ? 'default' : 'secondary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setFollowMode('center')}
                  >
                    Center
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Pixel View - Maintains square aspect ratio, centered in panel */}
      <div className="relative flex-1 flex items-center justify-center p-2">
        <div 
          className="relative bg-background aspect-square h-full"
        >
          <div className="absolute inset-0">
            {/* Pixel grid */}
            <div 
              className="absolute inset-0 grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${pixelSize}, 1fr)`,
                gridTemplateRows: `repeat(${pixelSize}, 1fr)`,
              }}
            >
              {Array.from({ length: pixelSize * pixelSize }).map((_, i) => (
                <div
                  key={i}
                  className="border border-panel-border/20"
                  style={{
                    backgroundColor: `hsl(${(i * 7) % 360}, 30%, ${20 + (i % 20)}%)`,
                  }}
                />
              ))}
            </div>

            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-px h-full bg-primary" />
              <div className="absolute w-full h-px bg-primary" />
            </div>

            {/* Pixel info overlay */}
            <div className="absolute top-1 left-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono">
              <div className="text-muted-foreground">Center Pixel</div>
              <div className="text-primary">RGB(128, 64, 192)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
