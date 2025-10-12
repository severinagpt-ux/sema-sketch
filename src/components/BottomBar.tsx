import { MousePointer2, ZoomIn, Film } from 'lucide-react';
import { Tool, AppView } from '@/lib/types';
import { Button } from './ui/button';

interface BottomBarProps {
  activeTool: Tool;
  zoom: number;
  cursorX?: number;
  cursorY?: number;
  onOpenTimeline?: () => void;
  currentView?: AppView;
}

export const BottomBar = ({ activeTool, zoom, cursorX = 0, cursorY = 0, onOpenTimeline, currentView = 'canvas' }: BottomBarProps) => {
  const toolHints: Record<Tool, string> = {
    'select': 'Click to select • Drag to move • Shift: Add to selection',
    'magic-wand': 'Click to select similar • Scroll: Adjust tolerance',
    'lasso': 'Click to draw • Right-click: Polygon mode • Backspace: Remove point',
    'crop': 'Drag to define crop area • Enter to apply',
    'pen': 'Click to add point • Ctrl: Toggle curve/line • Alt: Delete point',
    'brush': 'Click and drag to paint • Scroll: Size • Alt-Scroll: Softness',
    'eraser': 'Click to erase • Scroll: Size • Ctrl-Click: Toggle transparency mode',
    'clone': 'Alt-click source • Scroll: Angle • Shift-Scroll: Size',
    'dodge-burn': 'Click to lighten/darken • Scroll: Size • Alt-Scroll: Strength',
    'blur-sharpen': 'Click to blur/sharpen • Scroll: Size • Alt-Scroll: Intensity',
    'gradient': 'Click and drag to create gradient • Shift: Constrain angle',
    'shapes': 'Click and drag to draw shape • Shift: Constrain proportions',
    'text': 'Click to place text • Drag to define text box',
    'ai-tools': 'AI-powered editing tools • Select area and apply effects',
    'measure': 'Click and drag to measure • Shift: Constrain angle',
    'magnifier': 'Scroll to zoom • Space-drag to pan',
  };

  return (
    <div className="h-8 bg-toolbar border-t border-panel-border flex items-center justify-between px-4 text-xs">
      {/* Left: Tool Hints */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="font-medium text-foreground">{activeTool.replace('-', ' ').toUpperCase()}</span>
        <span>•</span>
        <span>{toolHints[activeTool]}</span>
      </div>

      {/* Right: Coordinates, Zoom, and Timeline */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <MousePointer2 className="w-3 h-3" />
          <span className="font-mono">X: {cursorX.toFixed(0)} Y: {cursorY.toFixed(0)}</span>
        </div>
        <div className="w-px h-4 bg-panel-border" />
        <div className="flex items-center gap-2">
          <ZoomIn className="w-3 h-3" />
          <span className="font-mono">{zoom}%</span>
        </div>
        {currentView === 'canvas' && onOpenTimeline && (
          <>
            <div className="w-px h-4 bg-panel-border" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onOpenTimeline}
              className="text-xs"
            >
              <Film className="w-3 h-3 mr-1" />
              Open Timeline
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
