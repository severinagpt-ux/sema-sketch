import { useState } from 'react';
import { Droplet, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export const ColorSpherePanel = () => {
  const [hue, setHue] = useState(263);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(60);
  const [illuminant, setIlluminant] = useState<'D65' | 'Tungsten' | 'Fluorescent'>('D65');

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      {/* Header */}
      <div className="px-3 py-2 border-b border-panel-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">ColorSphere</h3>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-64">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Illuminant</h4>
                <div className="flex gap-2">
                  {(['D65', 'Tungsten', 'Fluorescent'] as const).map((ill) => (
                    <Button
                      key={ill}
                      variant={illuminant === ill ? 'default' : 'secondary'}
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setIlluminant(ill)}
                    >
                      {ill}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* 3D Color Sphere Visualization - HSL Accurate */}
          <div className="aspect-square w-full max-w-[280px] mx-auto relative rounded-lg overflow-hidden">
            {/* Base sphere with accurate HSL gradient */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, 
                    hsl(${hue}, ${saturation}%, ${Math.min(lightness + 20, 100)}%) 0%,
                    hsl(${hue}, ${saturation}%, ${lightness}%) 40%,
                    hsl(${hue}, ${Math.max(saturation - 20, 0)}%, ${Math.max(lightness - 30, 0)}%) 100%
                  )
                `,
              }}
            />
            
            {/* Saturation gradient (desaturates towards edges) */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 50% 50%, 
                    transparent 0%,
                    hsl(${hue}, 0%, ${lightness}%) 100%
                  )
                `,
                opacity: (100 - saturation) / 200,
              }}
            />
            
            {/* Specular highlight */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 30%)',
              }}
            />
            
            {/* Shadow gradient for 3D effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 70% 70%, transparent 40%, rgba(0, 0, 0, 0.4) 100%)',
              }}
            />
            
            {/* Center color display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-20 h-20 rounded-full border-4 border-white/80 shadow-xl"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          </div>
      
          {/* Color Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium">Hue</label>
                <span className="text-xs font-mono">{hue}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div 
                className="h-2 rounded mt-1"
                style={{
                  background: 'linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))'
                }}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium">Saturation</label>
                <span className="text-xs font-mono">{saturation}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div 
                className="h-2 rounded mt-1"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`
                }}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium">Lightness</label>
                <span className="text-xs font-mono">{lightness}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={lightness}
                onChange={(e) => setLightness(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div 
                className="h-2 rounded mt-1"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`
                }}
              />
            </div>
          </div>
          
          {/* Current Color Display */}
          <div className="pt-4 border-t border-panel-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Color</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 rounded border-2 border-panel-border shadow-sm"
                  style={{ backgroundColor: currentColor }}
                />
                <div className="text-xs font-mono">
                  <div>{currentColor}</div>
                  <div className="text-muted-foreground text-[10px]">{illuminant}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
