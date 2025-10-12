import { Settings, User, Plus, Undo2, Redo2, History, Mic, Volume2, Ruler, Crosshair, Magnet, Maximize2, Columns2, ZoomIn, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AppView } from '@/lib/types';

interface TopBarProps {
  projectName: string;
  magnifier1: number;
  magnifier2: number;
  activeMagnifier: 1 | 2;
  onMagnifierChange: (preset: 1 | 2, value: number) => void;
  onMagnifierToggle: (preset: 1 | 2) => void;
  currentView?: AppView;
  onViewChange?: (view: AppView) => void;
}

export const TopBar = ({ 
  projectName, 
  magnifier1, 
  magnifier2, 
  activeMagnifier,
  onMagnifierChange,
  onMagnifierToggle,
  currentView = 'canvas',
  onViewChange
}: TopBarProps) => {
  const [showMagnifier1Slider, setShowMagnifier1Slider] = useState(false);
  const [showMagnifier2Slider, setShowMagnifier2Slider] = useState(false);

  return (
    <div className="h-12 bg-toolbar border-b border-panel-border flex items-center justify-between px-4 gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div className="text-primary font-bold text-lg">CDE</div>
        <Button variant="ghost" size="icon" className="icon-button">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <User className="w-4 h-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <div className="flex items-center gap-1">
          <Button 
            variant={currentView === 'canvas' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="tool-tab"
            onClick={() => onViewChange?.('canvas')}
          >
            {projectName}
          </Button>
          {currentView === 'timeline' && (
            <>
              <Button 
                variant="secondary" 
                size="sm" 
                className="tool-tab flex items-center gap-2"
              >
                Video Timeline
                <button
                  onClick={() => onViewChange?.('canvas')}
                  className="hover:bg-background/50 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="icon-button">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="icon-button">
          <Ruler className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <Crosshair className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <Magnet className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <Columns2 className="w-4 h-4" />
        </Button>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        {/* Magnifier Controls */}
        <div className="flex items-center gap-1 relative">
          <div 
            className="relative"
            onMouseEnter={() => setShowMagnifier1Slider(true)}
            onMouseLeave={() => setShowMagnifier1Slider(false)}
          >
            <Button 
              variant={activeMagnifier === 1 ? "default" : "ghost"} 
              size="icon" 
              className="icon-button relative"
              onClick={() => onMagnifierToggle(1)}
            >
              <ZoomIn className="w-4 h-4" />
              <span className="absolute bottom-0 right-0 text-[10px] font-bold">1</span>
            </Button>
            {showMagnifier1Slider && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-panel-bg border border-panel-border rounded-lg p-2 shadow-panel z-50">
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={magnifier1}
                  onChange={(e) => onMagnifierChange(1, parseInt(e.target.value))}
                  className="w-24 accent-primary"
                />
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
            {activeMagnifier === 1 ? magnifier1 : magnifier2}%
          </span>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowMagnifier2Slider(true)}
            onMouseLeave={() => setShowMagnifier2Slider(false)}
          >
            <Button 
              variant={activeMagnifier === 2 ? "default" : "ghost"} 
              size="icon" 
              className="icon-button relative"
              onClick={() => onMagnifierToggle(2)}
            >
              <ZoomIn className="w-4 h-4" />
              <span className="absolute bottom-0 right-0 text-[10px] font-bold">2</span>
            </Button>
            {showMagnifier2Slider && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-panel-bg border border-panel-border rounded-lg p-2 shadow-panel z-50">
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={magnifier2}
                  onChange={(e) => onMagnifierChange(2, parseInt(e.target.value))}
                  className="w-24 accent-primary"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <Button variant="ghost" size="icon" className="icon-button">
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <History className="w-4 h-4" />
        </Button>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <Button variant="ghost" size="icon" className="icon-button">
          <Volume2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button">
          <Mic className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
