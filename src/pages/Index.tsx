import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { LeftToolbar } from '@/components/LeftToolbar';
import { Canvas } from '@/components/Canvas';
import { RightPanels } from '@/components/RightPanels';
import { BottomBar } from '@/components/BottomBar';
import { MiniLayersBar } from '@/components/MiniLayersBar';
import { SettingsPanel } from '@/components/panels/SettingsPanel';
import { Timeline } from '@/pages/Timeline';
import { Tool, Layer, AppView } from '@/lib/types';
import { ToolProvider } from '@/contexts/ToolContext';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [magnifier1, setMagnifier1] = useState(100);
  const [magnifier2, setMagnifier2] = useState(200);
  const [activeMagnifier, setActiveMagnifier] = useState<1 | 2>(1);
  const [settingsPanelMinimized, setSettingsPanelMinimized] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('canvas');
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

  const currentZoom = activeMagnifier === 1 ? magnifier1 : magnifier2;

  const handleMagnifierChange = (preset: 1 | 2, value: number) => {
    if (preset === 1) {
      setMagnifier1(value);
    } else {
      setMagnifier2(value);
    }
  };

  const handleMagnifierToggle = (preset: 1 | 2) => {
    setActiveMagnifier(preset);
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    setLayers(layers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l));
  };

  const handleLayerLockToggle = (layerId: string) => {
    setLayers(layers.map(l => l.id === layerId ? { ...l, locked: !l.locked } : l));
  };

  return (
    <ToolProvider>
      <div className="h-screen w-full flex flex-col overflow-hidden">
      <TopBar projectName="Untitled Project" />
      
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'canvas' ? (
          <>
            <SettingsPanel
              activeTool={activeTool}
              isMinimized={settingsPanelMinimized}
              onToggleMinimize={() => setSettingsPanelMinimized(!settingsPanelMinimized)}
            />
            
            <LeftToolbar 
              onToolChange={setActiveTool}
            />
            
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex overflow-hidden">
                <Canvas
                  zoom={currentZoom}
                />
                
                <MiniLayersBar 
                  layers={layers}
                  onLayerVisibilityToggle={handleLayerVisibilityToggle}
                  onLayerLockToggle={handleLayerLockToggle}
                />
                
                <RightPanels 
                  onLayerVisibilityToggle={handleLayerVisibilityToggle}
                />
              </div>
              
              <BottomBar 
                activeTool={activeTool}
                zoom={currentZoom}
                onOpenTimeline={() => setCurrentView('timeline')}
                currentView={currentView}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <Timeline />
            <BottomBar 
              activeTool={activeTool}
              zoom={currentZoom}
              currentView={currentView}
            />
          </div>
        )}
      </div>
    </div>
    </ToolProvider>
  );
};

export default Index;
