import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { RightPanels } from '@/components/RightPanels';
import { Tool, Layer } from '@/lib/types';
import { ToolProvider } from '@/contexts/ToolContext';
import { Button } from '@/components/ui/button';
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Layers, Settings, Sliders, Wand2, Film, Volume2,
  Image, Type, Sparkles, Crop, Copy, ZoomIn, ZoomOut
} from 'lucide-react';

const VideoEditor = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [magnifier1, setMagnifier1] = useState(100);
  const [magnifier2, setMagnifier2] = useState(200);
  const [activeMagnifier, setActiveMagnifier] = useState<1 | 2>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);

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

  const videoTools = [
    { icon: Scissors, label: 'Cut', active: false },
    { icon: Copy, label: 'Split', active: false },
    { icon: Crop, label: 'Trim', active: false },
    { icon: Layers, label: 'Layers', active: false },
    { icon: Image, label: 'Media', active: false },
    { icon: Type, label: 'Text', active: false },
    { icon: Sparkles, label: 'Effects', active: false },
    { icon: Volume2, label: 'Audio', active: false },
    { icon: Sliders, label: 'Adjust', active: false },
    { icon: Wand2, label: 'AI Tools', active: false },
  ];

  return (
    <ToolProvider>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        <TopBar 
          projectName="Video Project"
          magnifier1={magnifier1}
          magnifier2={magnifier2}
          activeMagnifier={activeMagnifier}
          onMagnifierChange={handleMagnifierChange}
          onMagnifierToggle={handleMagnifierToggle}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <div className="w-14 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
            {videoTools.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className="tool-button"
                title={label}
              >
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Preview */}
            <div className="flex-1 bg-canvas flex items-center justify-center border-b border-panel-border">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ width: '960px', height: '540px' }}>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Film className="w-20 h-20 opacity-20" />
                </div>
                {/* Video preview will go here */}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="h-64 bg-toolbar border-t border-panel-border flex flex-col">
              {/* Playback Controls */}
              <div className="h-12 flex items-center justify-between px-4 border-b border-panel-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentTime(0)}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentTime(duration)}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <div className="text-xs font-mono text-muted-foreground ml-4">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="text-xs text-muted-foreground">100%</div>
                  <Button variant="ghost" size="icon">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Timeline Tracks */}
              <div className="flex-1 overflow-auto p-4">
                {/* Video Track */}
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <Film className="w-3 h-3" />
                    Video Track 1
                  </div>
                  <div className="h-12 bg-panel-bg border border-panel-border rounded relative">
                    <div 
                      className="absolute h-full bg-primary/20 border-l-2 border-r-2 border-primary rounded"
                      style={{ left: '10%', width: '40%' }}
                    >
                      <div className="text-[10px] p-1 truncate">Clip 1</div>
                    </div>
                    <div 
                      className="absolute h-full bg-primary/20 border-l-2 border-r-2 border-primary rounded"
                      style={{ left: '55%', width: '30%' }}
                    >
                      <div className="text-[10px] p-1 truncate">Clip 2</div>
                    </div>
                  </div>
                </div>

                {/* Audio Track */}
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <Volume2 className="w-3 h-3" />
                    Audio Track 1
                  </div>
                  <div className="h-12 bg-panel-bg border border-panel-border rounded relative">
                    <div 
                      className="absolute h-full bg-accent/30 border-l-2 border-r-2 border-accent rounded"
                      style={{ left: '10%', width: '70%' }}
                    >
                      <div className="text-[10px] p-1 truncate">Audio.mp3</div>
                    </div>
                  </div>
                </div>

                {/* Text/Effects Track */}
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <Type className="w-3 h-3" />
                    Text & Effects
                  </div>
                  <div className="h-12 bg-panel-bg border border-panel-border rounded relative">
                    <div 
                      className="absolute h-full bg-secondary/30 border-l-2 border-r-2 border-secondary rounded"
                      style={{ left: '25%', width: '20%' }}
                    >
                      <div className="text-[10px] p-1 truncate">Title</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panels */}
          <RightPanels 
            onLayerVisibilityToggle={() => {}}
          />
        </div>
        
        <BottomBar 
          activeTool={activeTool}
          zoom={currentZoom}
        />
      </div>
    </ToolProvider>
  );
};

export default VideoEditor;
