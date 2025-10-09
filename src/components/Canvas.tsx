import { Tool } from '@/lib/types';

interface CanvasProps {
  activeTool: Tool;
  zoom: number;
}

export const Canvas = ({ activeTool, zoom }: CanvasProps) => {
  return (
    <div className="flex-1 bg-canvas relative overflow-hidden">
      {/* Canvas Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Main Canvas Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="bg-background rounded-lg shadow-panel relative border border-panel-border"
          style={{
            width: `${600 * (zoom / 100)}px`,
            height: `${400 * (zoom / 100)}px`,
            transition: 'var(--transition-smooth)',
          }}
        >
          {/* Canvas Content */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-sm mb-1">Active Tool: {activeTool}</div>
              <div className="text-xs">Zoom: {zoom}%</div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute -inset-[1px] bg-gradient-glow rounded-lg pointer-events-none" />
        </div>
      </div>
      
      {/* Corner Info */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-panel-bg/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-panel-border">
        Canvas Ready • GPU Accelerated
      </div>
    </div>
  );
};
