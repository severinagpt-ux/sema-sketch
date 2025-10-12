import { useState } from 'react';
import { Download, Layers, FolderOpen, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VideoShot } from '@/lib/types';
import { Slider } from '@/components/ui/slider';

interface FrameExtractionPanelProps {
  shot: VideoShot;
}

export const FrameExtractionPanel = ({ shot }: FrameExtractionPanelProps) => {
  const [selectedFrame, setSelectedFrame] = useState(0);
  const totalFrames = shot.frames.length || Math.floor(shot.duration * 24);

  const handleExportToAssets = () => {
    console.log('Exporting frame to assets:', selectedFrame);
  };

  const handleExportToLayers = () => {
    console.log('Exporting frame to layers:', selectedFrame);
  };

  const handleDownload = () => {
    console.log('Downloading frame:', selectedFrame);
  };

  const handleConvertToNextShot = () => {
    console.log('Converting frame to next shot:', selectedFrame);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Extract Frame</h3>
        <p className="text-sm text-muted-foreground">
          Select and export frames from your video
        </p>
      </div>

      {/* Frame Preview */}
      <div className="space-y-2">
        <Label>Frame Preview</Label>
        <div className="aspect-video bg-black rounded border border-panel-border overflow-hidden">
          {shot.frames[selectedFrame] ? (
            <img 
              src={shot.frames[selectedFrame].thumbnail}
              alt={`Frame ${selectedFrame}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Frame preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Frame Selector */}
      <div className="space-y-2">
        <Label>
          Frame: {selectedFrame} / {totalFrames}
          <span className="text-muted-foreground ml-2">
            ({(selectedFrame / 24).toFixed(2)}s)
          </span>
        </Label>
        <Slider
          value={[selectedFrame]}
          onValueChange={([value]) => setSelectedFrame(value)}
          min={0}
          max={totalFrames - 1}
          step={1}
          className="w-full"
        />
      </div>

      {/* Frame Grid */}
      <div className="space-y-2">
        <Label>Quick Select</Label>
        <div className="grid grid-cols-4 gap-2">
          {[0, Math.floor(totalFrames * 0.25), Math.floor(totalFrames * 0.5), Math.floor(totalFrames * 0.75), totalFrames - 1].map((frameNum) => (
            <div
              key={frameNum}
              className={`aspect-video bg-black/50 rounded border cursor-pointer transition-all ${
                selectedFrame === frameNum 
                  ? 'border-primary shadow-glow' 
                  : 'border-panel-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedFrame(frameNum)}
            >
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                {frameNum === 0 ? 'Start' : frameNum === totalFrames - 1 ? 'End' : `${Math.round((frameNum / totalFrames) * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="space-y-2">
        <Label>Export Frame To</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleExportToAssets}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Assets
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleExportToLayers}
          >
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Convert to Next Shot */}
      <div className="space-y-2">
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleConvertToNextShot}
        >
          <Film className="w-4 h-4 mr-2" />
          Use as Next Shot's First Frame
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Creates a new video shot starting with this frame
        </p>
      </div>
    </div>
  );
};
