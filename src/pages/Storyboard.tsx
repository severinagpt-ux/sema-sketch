import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { RightPanels } from '@/components/RightPanels';
import { Tool, AppView } from '@/lib/types';
import { 
  Film, Grid3x3, Layout, Image, Type, Wand2, 
  Camera, Play, Square, SkipBack, SkipForward,
  Maximize2, Clock, User, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Storyboard = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(100);
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [magnifier1, setMagnifier1] = useState(100);
  const [magnifier2, setMagnifier2] = useState(100);
  const [activeMagnifier, setActiveMagnifier] = useState<1 | 2>(1);
  const [currentView, setCurrentView] = useState<AppView>('canvas');
  const [selectedPanel, setSelectedPanel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
    { icon: Type, tool: 'text', label: 'Add Notes' },
    { icon: Wand2, tool: 'ai-tools', label: 'AI Generate' },
    { icon: Camera, tool: 'magnifier', label: 'Camera View' },
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <TopBar projectName="Storyboard Creator" />

      {/* Main Content Area */}
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
        <div className="flex-1 flex flex-col bg-canvas overflow-hidden">
          {/* Storyboard Grid Area */}
          <div className="flex-1 p-6 overflow-auto">
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
                          <Type className="w-3 h-3 mr-1" />
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

          {/* Script Timeline Section */}
          <div className="h-64 bg-toolbar border-t border-panel-border flex flex-col">
            {/* Timeline Controls */}
            <div className="h-10 bg-toolbar border-b border-panel-border flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-panel-border mx-2" />
                <span className="text-xs text-muted-foreground font-mono">00:00:00</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Zoom:</span>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={50}
                    max={200}
                    step={10}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground w-12">{zoom}%</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 overflow-auto">
              <div className="flex h-full">
                {/* Track Labels */}
                <div className="w-32 bg-toolbar border-r border-panel-border flex-shrink-0">
                  <div className="h-12 border-b border-panel-border flex items-center px-3">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Panels</span>
                    </div>
                  </div>
                  <div className="h-12 border-b border-panel-border flex items-center px-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Characters</span>
                    </div>
                  </div>
                  <div className="h-12 border-b border-panel-border flex items-center px-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Location</span>
                    </div>
                  </div>
                  <div className="h-12 border-b border-panel-border flex items-center px-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Dialogue</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 relative bg-canvas/50">
                  {/* Time ruler */}
                  <div className="h-6 border-b border-panel-border flex items-center bg-toolbar text-xs text-muted-foreground">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="flex-1 border-l border-panel-border px-2">
                        {i}s
                      </div>
                    ))}
                  </div>

                  {/* Panel track visualization */}
                  <div className="h-12 border-b border-panel-border flex items-center px-2 gap-1">
                    {storyboardPanels.map((panel, i) => (
                      <div
                        key={panel.id}
                        className="h-8 bg-primary/20 border border-primary/40 rounded px-2 flex items-center justify-center hover:bg-primary/30 cursor-pointer transition-colors"
                        style={{ width: `${parseInt(panel.duration) * 40}px` }}
                      >
                        <span className="text-xs font-medium text-primary">P{panel.id}</span>
                      </div>
                    ))}
                  </div>

                  {/* Additional tracks */}
                  <div className="h-12 border-b border-panel-border" />
                  <div className="h-12 border-b border-panel-border" />
                  <div className="h-12 border-b border-panel-border" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panels */}
        <RightPanels onLayerVisibilityToggle={handleLayerVisibilityToggle} />
      </div>

      {/* Bottom Bar */}
      <BottomBar
        activeTool={activeTool}
        zoom={zoom}
        cursorX={cursorX}
        cursorY={cursorY}
        currentView={currentView}
      />
    </div>
  );
};

export default Storyboard;
