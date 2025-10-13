import { useState } from 'react';
import { Layers, Info, Wand, Palette, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Panel } from '@/lib/types';
import { LayersPanel } from './panels/LayersPanel';
import { InspectorPanel } from './panels/InspectorPanel';
import { ColorSpherePanel } from './panels/ColorSpherePanel';
import { FeatherEdgesPanel } from './panels/FeatherEdgesPanel';

interface RightPanelsProps {
  onLayerVisibilityToggle: (layerId: string) => void;
}

import { AssetBrowserPanel } from './panels/AssetBrowserPanel';
import { CursorZoomPanel } from './panels/CursorZoomPanel';
import { MicroscopePanel } from './panels/MicroscopePanel';
import { AIToolsPanel } from './panels/AIToolsPanel';
import { Package, ZoomIn, Microscope, Sparkles } from 'lucide-react';
import { PanelSize } from '@/lib/types';

const panelConfigs: { icon: typeof Layers; panel: Panel; label: string }[] = [
  { icon: Layers, panel: 'layers', label: 'Layers' },
  { icon: Info, panel: 'inspector', label: 'Inspector' },
  { icon: Wand, panel: 'effects', label: 'Effects' },
  { icon: Palette, panel: 'color', label: 'Color' },
  { icon: Package, panel: 'assets', label: 'Assets' },
  { icon: Sparkles, panel: 'ai-tools', label: 'AI Tools' },
  { icon: ZoomIn, panel: 'cursor-zoom', label: 'Cursor Zoom' },
  { icon: Microscope, panel: 'microscope', label: 'Microscope' },
];

export const RightPanels = ({ onLayerVisibilityToggle }: RightPanelsProps) => {
  const [activePanel, setActivePanel] = useState<Panel | null>('layers');
  const [panelSize, setPanelSize] = useState<PanelSize>('full');

  const handlePanelClick = (panel: Panel, size: PanelSize = 'full') => {
    if (activePanel === panel && panelSize === size) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
      setPanelSize(size);
    }
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'layers':
        return <LayersPanel onLayerVisibilityToggle={onLayerVisibilityToggle} />;
      case 'inspector':
        return <InspectorPanel />;
      case 'color':
        return <ColorSpherePanel />;
      case 'effects':
        return <FeatherEdgesPanel />;
      case 'assets':
        return <AssetBrowserPanel />;
      case 'ai-tools':
        return <AIToolsPanel />;
      case 'cursor-zoom':
        return <CursorZoomPanel size={panelSize === 'full' ? 'full' : 'half'} />;
      case 'microscope':
        return <MicroscopePanel size={panelSize === 'full' ? 'full' : 'half'} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Panel Content */}
      {activePanel && (
        <div 
          className={`bg-panel-bg border-l border-panel-border panel-slide ${
            panelSize === 'full' ? 'h-full' : panelSize === 'top' ? 'h-1/2' : 'h-1/2 self-end'
          }`}
          style={{ width: '320px' }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border">
              <h2 className="text-sm font-semibold capitalize">{activePanel}</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="icon-button h-6 w-6"
                onClick={() => setActivePanel(null)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderPanelContent()}
            </div>
          </div>
        </div>
      )}
      
      {/* Panel Button Bar */}
      <div className="w-12 bg-toolbar border-l border-panel-border flex flex-col items-center py-2 gap-1">
        {panelConfigs.map(({ icon: Icon, panel, label }) => (
          <div key={panel} className="relative group">
            <div className="relative">
              {/* Main Button with Split Hover Zones */}
              <Button
                variant={activePanel === panel ? "default" : "ghost"}
                size="icon"
                className="panel-icon-button relative overflow-hidden"
                title={label}
              >
                <Icon className="w-5 h-5" />
                
                {/* Invisible click zones */}
                <div
                  className="absolute inset-0 flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left half - Full size */}
                  <div
                    className="w-1/2 h-full cursor-pointer hover:bg-primary/10"
                    onClick={() => handlePanelClick(panel, 'full')}
                  />
                  {/* Right half split into top/bottom */}
                  <div className="w-1/2 h-full flex flex-col">
                    <div
                      className="h-1/2 cursor-pointer hover:bg-primary/10"
                      onClick={() => handlePanelClick(panel, 'top')}
                    />
                    <div
                      className="h-1/2 cursor-pointer hover:bg-primary/10"
                      onClick={() => handlePanelClick(panel, 'bottom')}
                    />
                  </div>
                </div>
              </Button>
              
              {/* Hover Split Visual Indicator with Borders */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Full Panel Zone (Left half) */}
                <div className="absolute top-0 bottom-0 left-0 w-1/2 border-2 border-primary/40 rounded-l" />
                
                {/* Top Panel Zone (Right top) */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 border-2 border-primary/40 rounded-tr" />
                
                {/* Bottom Panel Zone (Right bottom) */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-2 border-primary/40 rounded-br" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
