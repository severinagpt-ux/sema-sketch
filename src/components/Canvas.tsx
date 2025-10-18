import { useEffect, useRef } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useToolContext } from '@/contexts/ToolContext';
import { Button } from './ui/button';
import { Undo2, Redo2, Trash2 } from 'lucide-react';

interface CanvasProps {
  zoom: number;
}

export const Canvas = ({ zoom }: CanvasProps) => {
  const { activeTool, settings } = useToolContext();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    undo,
    redo
  } = useCanvas(activeTool, settings);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [undo, redo]);
  return (
    <div ref={containerRef} className="flex-1 bg-canvas relative overflow-hidden">
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
          className="bg-background rounded-lg shadow-panel relative border border-panel-border overflow-hidden"
          style={{
            width: `${600 * (zoom / 100)}px`,
            height: `${400 * (zoom / 100)}px`,
            transition: 'var(--transition-smooth)',
          }}
        >
          {/* Actual Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: ['brush', 'pen', 'eraser', 'paintbrush'].includes(activeTool) ? 'crosshair' : 'default'
            }}
          />
          
          {/* Glow Effect */}
          <div className="absolute -inset-[1px] bg-gradient-glow rounded-lg pointer-events-none" />
        </div>
      </div>
      
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={redo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Corner Info */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-panel-bg/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-panel-border">
        Active Tool: {activeTool} • Canvas Ready
      </div>
    </div>
  );
};
