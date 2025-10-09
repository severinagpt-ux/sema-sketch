import { useState } from 'react';
import { Layers, Info, Wand, Palette, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Panel } from '@/lib/types';
import { LayersPanel } from './panels/LayersPanel';
import { InspectorPanel } from './panels/InspectorPanel';
import { ColorSpherePanel } from './panels/ColorSpherePanel';

interface RightPanelsProps {
  onLayerVisibilityToggle: (layerId: string) => void;
}

const panelConfigs: { icon: typeof Layers; panel: Panel; label: string }[] = [
  { icon: Layers, panel: 'layers', label: 'Layers' },
  { icon: Info, panel: 'inspector', label: 'Inspector' },
  { icon: Wand, panel: 'effects', label: 'Effects' },
  { icon: Palette, panel: 'color', label: 'Color' },
];

export const RightPanels = ({ onLayerVisibilityToggle }: RightPanelsProps) => {
  const [activePanel, setActivePanel] = useState<Panel | null>('layers');
  const [panelSize, setPanelSize] = useState<'full' | 'top' | 'bottom'>('full');

  const handlePanelClick = (panel: Panel, size: 'full' | 'top' | 'bottom' = 'full') => {
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
        return (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3">Effects Panel</h3>
            <div className="text-xs text-muted-foreground">
              Filters, edge AI, shadows, and color adjustments will appear here.
            </div>
          </div>
        );
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
            <Button
              variant={activePanel === panel ? "default" : "ghost"}
              size="icon"
              className="panel-icon-button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const height = rect.height;
                
                if (clickY < height * 0.33) {
                  handlePanelClick(panel, 'top');
                } else if (clickY > height * 0.67) {
                  handlePanelClick(panel, 'bottom');
                } else {
                  handlePanelClick(panel, 'full');
                }
              }}
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Button>
            
            {/* Hover Split Indicator */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-0 left-0 right-0 h-1/3 border-b border-primary/30" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 border-t border-primary/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
