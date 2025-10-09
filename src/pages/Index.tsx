import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { LeftToolbar } from '@/components/LeftToolbar';
import { Canvas } from '@/components/Canvas';
import { RightPanels } from '@/components/RightPanels';
import { Tool } from '@/lib/types';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [magnifier1, setMagnifier1] = useState(100);
  const [magnifier2, setMagnifier2] = useState(200);
  const [activeMagnifier, setActiveMagnifier] = useState<1 | 2>(1);

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
    console.log('Toggle layer visibility:', layerId);
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
        <LeftToolbar 
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        
        <Canvas 
          activeTool={activeTool}
          zoom={currentZoom}
        />
        
        <RightPanels 
          onLayerVisibilityToggle={handleLayerVisibilityToggle}
        />
      </div>
    </div>
  );
};

export default Index;
