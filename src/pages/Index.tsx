import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { LeftToolbar } from '@/components/LeftToolbar';
import { Canvas } from '@/components/Canvas';
import { RightPanels } from '@/components/RightPanels';
import { BottomBar } from '@/components/BottomBar';
import { MiniLayersBar } from '@/components/MiniLayersBar';
import { SettingsPanel } from '@/components/panels/SettingsPanel';
import { Tool, Layer } from '@/lib/types';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [magnifier1, setMagnifier1] = useState(100);
  const [magnifier2, setMagnifier2] = useState(200);
  const [activeMagnifier, setActiveMagnifier] = useState<1 | 2>(1);
  const [settingsPanelMinimized, setSettingsPanelMinimized] = useState(false);
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
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <TopBar 
        projectName="Untitled Project"
        magnifier1={magnifier1}
        magnifier2={magnifier2}
        activeMagnifier={activeMagnifier}
        onMagnifierChange={handleMagnifierChange}
        onMagnifierToggle={handleMagnifierToggle}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <SettingsPanel
          activeTool={activeTool}
          isMinimized={settingsPanelMinimized}
          onToggleMinimize={() => setSettingsPanelMinimized(!settingsPanelMinimized)}
        />
        
        <LeftToolbar 
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            <Canvas
              activeTool={activeTool}
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
          />
        </div>
      </div>

    </div>
  );
};

export default Index;
