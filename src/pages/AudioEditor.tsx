import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { LeftSidebar } from '@/components/LeftSidebar';
import { BottomToolbar } from '@/components/BottomToolbar';
import { RightPanels } from '@/components/RightPanels';
import { Tool } from '@/lib/types';
import { ToolProvider } from '@/contexts/ToolContext';
import { Button } from '@/components/ui/button';
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Volume2, Music, Mic, Wand2, Sliders, Waves,
  Download, Upload, ZoomIn, ZoomOut, Maximize2,
  Square, Circle, Sparkles, Copy, Trash2
} from 'lucide-react';

const AudioEditor = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);

  const audioTools = [
    { icon: Scissors, label: 'Cut', active: false },
    { icon: Copy, label: 'Copy', active: false },
    { icon: Square, label: 'Select', active: false },
    { icon: Waves, label: 'Waveform', active: false },
    { icon: Music, label: 'Effects', active: false },
    { icon: Sliders, label: 'Mix', active: false },
    { icon: Mic, label: 'Record', active: false },
    { icon: Sparkles, label: 'AI Tools', active: false },
    { icon: Volume2, label: 'Volume', active: false },
    { icon: Wand2, label: 'Enhance', active: false },
  ];

  return (
    <ToolProvider>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        <TopBar />
        
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar currentPage="audio" />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Waveform Display Area */}
            <div className="flex-1 bg-canvas flex flex-col border-b border-panel-border">
              {/* Control Bar */}
              <div className="h-12 bg-toolbar border-b border-panel-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <div className="h-6 w-px bg-border mx-2" />
                  <Button variant="ghost" size="icon">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="text-xs text-muted-foreground min-w-[3rem] text-center">
                    100%
                  </div>
                  <Button variant="ghost" size="icon">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Waveform Canvas */}
              <div className="flex-1 relative overflow-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Master Track */}
                  <div className="w-full h-32 bg-panel-bg/50 border-y border-panel-border relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Waves className="w-16 h-16 opacity-10" />
                    </div>
                    <div className="absolute inset-0">
                      {/* Simulated waveform */}
                      <svg className="w-full h-full" preserveAspectRatio="none">
                        <path
                          d="M0,64 Q25,20 50,64 T100,64 Q125,100 150,64 T200,64 Q225,30 250,64 T300,64"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-track Timeline */}
            <div className="h-72 bg-toolbar border-t border-panel-border flex flex-col">
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
                  <Button variant="ghost" size="sm">
                    <Music className="w-3 h-3 mr-1" />
                    Add Track
                  </Button>
                  <div className="h-6 w-px bg-border mx-2" />
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Audio Tracks */}
              <div className="flex-1 overflow-auto">
                <div className="flex">
                  {/* Track Labels */}
                  <div className="w-32 bg-panel-bg border-r border-panel-border flex-shrink-0">
                    {/* Master Track */}
                    <div className="h-16 border-b border-panel-border p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3 h-3 text-primary" />
                        <span className="text-xs font-semibold">Master</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Circle className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Audio Track 1 */}
                    <div className="h-16 border-b border-panel-border p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="w-3 h-3 text-accent" />
                        <span className="text-xs">Track 1</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Circle className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Audio Track 2 */}
                    <div className="h-16 border-b border-panel-border p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="w-3 h-3 text-secondary" />
                        <span className="text-xs">Track 2</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Circle className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Audio Track 3 */}
                    <div className="h-16 border-b border-panel-border p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs">Track 3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Circle className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Grid */}
                  <div className="flex-1 relative">
                    {/* Master Track Timeline */}
                    <div className="h-16 border-b border-panel-border relative bg-panel-bg/30">
                      <div 
                        className="absolute h-full bg-primary/20 border-l-2 border-r-2 border-primary"
                        style={{ left: '5%', width: '85%' }}
                      >
                        <div className="text-[10px] p-1 truncate">Master Audio</div>
                      </div>
                    </div>

                    {/* Track 1 Timeline */}
                    <div className="h-16 border-b border-panel-border relative">
                      <div 
                        className="absolute h-full bg-accent/30 border-l-2 border-r-2 border-accent"
                        style={{ left: '10%', width: '35%' }}
                      >
                        <div className="text-[10px] p-1 truncate">Music.mp3</div>
                      </div>
                      <div 
                        className="absolute h-full bg-accent/30 border-l-2 border-r-2 border-accent"
                        style={{ left: '50%', width: '30%' }}
                      >
                        <div className="text-[10px] p-1 truncate">Ambient.wav</div>
                      </div>
                    </div>

                    {/* Track 2 Timeline */}
                    <div className="h-16 border-b border-panel-border relative">
                      <div 
                        className="absolute h-full bg-secondary/30 border-l-2 border-r-2 border-secondary"
                        style={{ left: '15%', width: '60%' }}
                      >
                        <div className="text-[10px] p-1 truncate">Voice Recording.wav</div>
                      </div>
                    </div>

                    {/* Track 3 Timeline */}
                    <div className="h-16 border-b border-panel-border relative">
                      <div 
                        className="absolute h-full bg-muted/50 border-l-2 border-r-2 border-muted-foreground"
                        style={{ left: '25%', width: '20%' }}
                      >
                        <div className="text-[10px] p-1 truncate">SFX.mp3</div>
                      </div>
                    </div>

                    {/* Playhead */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                      style={{ left: '30%' }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panels */}
          <RightPanels 
            onLayerVisibilityToggle={() => {}}
            currentPage="audio"
          />
        </div>
        
        <BottomToolbar>
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
        </BottomToolbar>
      </div>
    </ToolProvider>
  );
};

export default AudioEditor;
