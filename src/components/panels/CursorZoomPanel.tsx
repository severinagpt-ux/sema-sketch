import { useState } from 'react';
import { Settings, ZoomIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Switch } from '../ui/switch';

export const CursorZoomPanel = () => {
  const [zoom, setZoom] = useState(100);
  const [showBorder, setShowBorder] = useState(true);
  const [bufferSize, setBufferSize] = useState(20);

  return (
    <div className="fixed bottom-20 right-20 w-48 h-48 bg-panel-bg border-2 border-panel-border rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-toolbar border-b border-panel-border">
        <div className="flex items-center gap-1 text-xs">
          <ZoomIn className="w-3 h-3" />
          <span>{zoom}%</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Settings className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-64">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Cursor Zoom Settings</h4>
              
              <div className="flex items-center justify-between">
                <label className="text-sm">Show Border</label>
                <Switch checked={showBorder} onCheckedChange={setShowBorder} />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Buffer Zone Size</label>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  value={bufferSize}
                  onChange={(e) => setBufferSize(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="text-xs text-right text-muted-foreground">{bufferSize}px</div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Zoom View */}
      <div className="relative w-full h-[calc(100%-28px)]">
        {/* Canvas preview */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary))_0%,_transparent_70%)] opacity-10" />
        
        {/* Buffer zone indicator */}
        {showBorder && (
          <div 
            className="absolute border-2 border-primary/30 pointer-events-none"
            style={{
              top: `${bufferSize}px`,
              left: `${bufferSize}px`,
              right: `${bufferSize}px`,
              bottom: `${bufferSize}px`,
            }}
          />
        )}

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-full bg-primary/30" />
          <div className="absolute w-full h-px bg-primary/30" />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-2 left-2 right-2 flex gap-1">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 h-6 text-xs"
          onClick={() => setZoom(Math.max(50, zoom - 25))}
        >
          -
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 h-6 text-xs"
          onClick={() => setZoom(Math.min(400, zoom + 25))}
        >
          +
        </Button>
      </div>
    </div>
  );
};
