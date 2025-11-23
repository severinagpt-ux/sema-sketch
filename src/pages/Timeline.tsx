import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomToolbar } from '@/components/BottomToolbar';
import { RightPanels } from '@/components/RightPanels';
import { Play, Pause, SkipBack, SkipForward, Download, Image, Layers, Film, Sparkles, ZoomIn, ZoomOut, Scissors, Copy, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoShot, TimelineProject, Tool, Layer } from '@/lib/types';
import { VideoGenerationPanel } from '@/components/panels/VideoGenerationPanel';
import { FrameExtractionPanel } from '@/components/panels/FrameExtractionPanel';
import { MotionAnalysisPanel } from '@/components/panels/MotionAnalysisPanel';
import { ToolProvider } from '@/contexts/ToolContext';

const Timeline = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [project] = useState<TimelineProject>({
    id: '1',
    name: 'Video Project 1',
    shots: [],
  });

  const [selectedShot, setSelectedShot] = useState<VideoShot | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activePanel, setActivePanel] = useState<'generate' | 'extract' | 'motion' | null>('generate');

  const timelineTools = [
    { icon: Scissors, label: 'Cut' },
    { icon: Copy, label: 'Split' },
    { icon: Layers, label: 'Layers' },
    { icon: Film, label: 'Clips' },
    { icon: Wand2, label: 'Effects' },
    { icon: Sparkles, label: 'AI Tools' },
  ];

  return (
    <ToolProvider>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        <TopBar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <div className="w-14 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
            {timelineTools.map(({ icon: Icon, label }) => (
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-canvas overflow-hidden">
      {/* Video Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-background/50 relative">
        {selectedShot ? (
          <div className="relative max-w-4xl w-full aspect-video bg-black rounded-lg overflow-hidden border border-panel-border shadow-panel">
            {selectedShot.videoUrl ? (
              <video 
                className="w-full h-full"
                src={selectedShot.videoUrl}
                controls={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {selectedShot.status === 'generating' ? 'Generating video...' : 'No video preview'}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Create Your First Video Shot</h2>
            <p className="text-muted-foreground mb-4">Generate AI videos from your canvas, layers, or assets</p>
          </div>
        )}
      </div>

      {/* Timeline Controls */}
      <div className="h-48 bg-panel-bg border-t border-panel-border flex flex-col">
        {/* Playback Controls */}
        <div className="h-12 border-b border-panel-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="icon-button">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="icon-button"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="icon-button">
              <SkipForward className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground ml-4 font-mono">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant={activePanel === 'generate' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePanel(activePanel === 'generate' ? null : 'generate')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </Button>
            <Button 
              variant={activePanel === 'extract' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePanel(activePanel === 'extract' ? null : 'extract')}
              disabled={!selectedShot}
            >
              <Image className="w-4 h-4 mr-2" />
              Extract Frame
            </Button>
            <Button 
              variant={activePanel === 'motion' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePanel(activePanel === 'motion' ? null : 'motion')}
              disabled={!selectedShot}
            >
              <Film className="w-4 h-4 mr-2" />
              Motion Analysis
            </Button>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="flex-1 relative overflow-x-auto">
          <div className="absolute inset-0 p-4">
            {project.shots.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No shots yet. Click "Generate" to create your first video shot.
              </div>
            ) : (
              <div className="flex gap-2 h-full">
                {project.shots.map((shot) => (
                  <div
                    key={shot.id}
                    className={`relative h-full min-w-[200px] bg-background rounded border cursor-pointer transition-all ${
                      selectedShot?.id === shot.id 
                        ? 'border-primary shadow-glow' 
                        : 'border-panel-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedShot(shot)}
                  >
                    <div className="absolute inset-0 p-2 flex flex-col">
                      <div className="flex-1 bg-black/50 rounded overflow-hidden mb-2">
                        <img 
                          src={shot.firstFrame} 
                          alt={shot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs font-medium truncate">{shot.name}</div>
                      <div className="text-xs text-muted-foreground">{shot.duration}s</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

          </div>

          {/* Right Panels */}
          <RightPanels 
            onLayerVisibilityToggle={() => {}}
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
            <Button variant="ghost" size="icon">
              <SkipForward className="w-4 h-4" />
            </Button>
            <div className="text-xs font-mono text-muted-foreground ml-4">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
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

export default Timeline;
