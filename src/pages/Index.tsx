import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { LeftToolbar } from '@/components/LeftToolbar';
import { Canvas } from '@/components/Canvas';
import { RightPanels } from '@/components/RightPanels';
import { BottomToolbar } from '@/components/BottomToolbar';
import { MiniLayersBar } from '@/components/MiniLayersBar';
import { Tool, Layer } from '@/lib/types';
import { ToolProvider } from '@/contexts/ToolContext';
import { ZoomIn, ZoomOut, Undo, Redo, Grid3x3, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Background', visible: true, locked: true, opacity: 100, modifiers: [], maskVisible: false },
    { 
      id: '2', 
      name: 'Layer 1', 
      visible: true, 
      locked: false, 
      opacity: 100, 
      maskVisible: true,
      modifiers: [
        { id: 'm1', type: 'transparency', name: 'Alpha Mask', enabled: true, opacity: 80, maskColor: '#ff0000' },
        { id: 'm2', type: 'filter', name: 'Blur', enabled: true, opacity: 100 }
      ]
    },
    { 
      id: '3', 
      name: 'Layer 2', 
      visible: true, 
      locked: false, 
      opacity: 80, 
      maskVisible: false,
      modifiers: [
        { id: 'm3', type: 'warp', name: 'Distort', enabled: false, opacity: 100 }
      ]
    },
  ]);

  const handleLayerVisibilityToggle = (layerId: string) => {
    setLayers(layers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l));
  };

  const handleLayerLockToggle = (layerId: string) => {
    setLayers(layers.map(l => l.id === layerId ? { ...l, locked: !l.locked } : l));
  };

  return (
    <ToolProvider>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        <TopBar />
        
        <div className="flex-1 flex overflow-hidden">
          <LeftToolbar 
            onToolChange={setActiveTool}
          />
          
          <div className="flex-1 flex overflow-hidden">
            <Canvas zoom={100} />
            
            <MiniLayersBar 
              layers={layers}
              onLayerVisibilityToggle={handleLayerVisibilityToggle}
              onLayerLockToggle={handleLayerLockToggle}
            />
            
            <RightPanels 
              onLayerVisibilityToggle={handleLayerVisibilityToggle}
            />
          </div>
        </div>
        
        <BottomToolbar>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <ZoomOut className="w-4 h-4 mr-1" />
              Zoom Out
            </Button>
            <span className="text-xs text-muted-foreground">100%</span>
            <Button variant="ghost" size="sm" className="h-8">
              <ZoomIn className="w-4 h-4 mr-1" />
              Zoom In
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Grid3x3 className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Ruler className="w-4 h-4 mr-1" />
              Rulers
            </Button>
          </div>
        </BottomToolbar>
      </div>
    </ToolProvider>
  );
};

export default Index;
