import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomToolbar } from '@/components/BottomToolbar';
import { RightPanels } from '@/components/RightPanels';
import { Tool } from '@/lib/types';
import { ToolProvider } from '@/contexts/ToolContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, FileText, Image, Camera, Film, Layout, 
  Wand2, Sparkles, Clock, MessageSquare, ZoomIn, ZoomOut, Grid3x3
} from 'lucide-react';

const Storyboard = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedPanel, setSelectedPanel] = useState(0);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    console.log('Toggle layer visibility:', layerId);
  };

  // Storyboard-specific tools
  const storyboardTools = [
    { icon: Grid3x3, tool: 'select', label: 'Select Panel' },
    { icon: Layout, tool: 'crop', label: 'Frame Tool' },
    { icon: Image, tool: 'brush', label: 'Sketch Tool' },
    { icon: FileText, tool: 'text', label: 'Add Notes' },
    { icon: Wand2, tool: 'ai-tools', label: 'AI Generate' },
    { icon: Camera, tool: 'magnifier', label: 'Camera View' },
    { icon: Film, tool: 'shapes', label: 'Sequence' },
    { icon: Sparkles, tool: 'magic-wand', label: 'AI Enhance' },
  ];

  // Sample storyboard panels
  const storyboardPanels = [
    { id: 1, scene: 'Scene 1', shot: 'Shot 1A', duration: '3s', notes: 'Wide establishing shot' },
    { id: 2, scene: 'Scene 1', shot: 'Shot 1B', duration: '2s', notes: 'Medium close-up' },
    { id: 3, scene: 'Scene 1', shot: 'Shot 1C', duration: '4s', notes: 'Over shoulder dialogue' },
    { id: 4, scene: 'Scene 2', shot: 'Shot 2A', duration: '5s', notes: 'Action sequence begins' },
    { id: 5, scene: 'Scene 2', shot: 'Shot 2B', duration: '2s', notes: 'Reaction shot' },
    { id: 6, scene: 'Scene 2', shot: 'Shot 2C', duration: '3s', notes: 'Cutaway detail' },
  ];

  const scenes = storyboardPanels;

  return (
    <ToolProvider>
      <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
        <TopBar />

        <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-14 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
          {storyboardTools.map(({ icon: Icon, tool, label }) => (
            <Button
              key={tool}
              variant={activeTool === tool ? "default" : "ghost"}
              size="icon"
              className="tool-button"
              onClick={() => handleToolChange(tool as Tool)}
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
          </div>

          {/* Center: Storyboard Canvas */}
          <div className="flex-1 bg-canvas overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Grid Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Storyboard Panels</h1>
                  <p className="text-sm text-muted-foreground">Visual pre-production planning</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Film className="w-4 h-4 mr-2" />
                    Export Storyboard
                  </Button>
                  <Button size="sm">
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                </div>
              </div>

              {/* Storyboard Panel Grid */}
              <div className="grid grid-cols-3 gap-6">
                {storyboardPanels.map((panel) => (
                  <Card 
                    key={panel.id}
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedPanel === panel.id ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedPanel(panel.id)}
                  >
                    {/* Panel Preview */}
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
                      <Camera className="w-12 h-12 text-muted-foreground/30 relative z-10" />
                      <Badge className="absolute top-2 left-2 text-xs">Panel {panel.id}</Badge>
                    </div>

                    {/* Panel Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{panel.scene}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{panel.shot}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{panel.duration}</span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {panel.notes}
                      </p>

                      {/* Panel Actions */}
                      <div className="flex gap-1 pt-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1">
                          <FileText className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1">
                          <Wand2 className="w-3 h-3 mr-1" />
                          AI
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panels */}
          <RightPanels onLayerVisibilityToggle={handleLayerVisibilityToggle} currentPage="storyboard" />
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
              <Grid3x3 className="w-4 h-4 mr-1" />
              Grid View
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Add Panel
            </Button>
            <span className="text-xs text-muted-foreground">{scenes.length} Scenes</span>
          </div>
        </BottomToolbar>
      </div>
    </ToolProvider>
  );
};

export default Storyboard;
