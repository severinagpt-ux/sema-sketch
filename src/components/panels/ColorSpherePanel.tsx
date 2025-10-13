import { useState } from 'react';

export const ColorSpherePanel = () => {
  const [hue, setHue] = useState(263);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(60);

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
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
            <label className="text-xs text-muted-foreground">Hue</label>
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
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-muted-foreground">Saturation</label>
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
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-muted-foreground">Lightness</label>
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
        </div>
      </div>
      
      {/* RGB Values */}
      <div className="pt-4 border-t border-panel-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current Color</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border border-panel-border shadow-sm"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-xs font-mono">{currentColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
