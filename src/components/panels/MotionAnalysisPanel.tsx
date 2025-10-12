import { useState } from 'react';
import { TrendingUp, Zap, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VideoShot } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface MotionAnalysisPanelProps {
  shot: VideoShot;
}

export const MotionAnalysisPanel = ({ shot }: MotionAnalysisPanelProps) => {
  const [frameInterval, setFrameInterval] = useState([10]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // TODO: Implement actual motion analysis using computer vision
    console.log('Analyzing motion with frame interval:', frameInterval[0]);
  };

  const handleApplyToNextShot = () => {
    console.log('Applying motion analysis to next shot');
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Motion Analysis</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered motion analysis for consistent shot transitions
        </p>
      </div>

      {/* Analysis Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            Frame Sampling Interval: Every {frameInterval[0]} frames
          </Label>
          <Slider
            value={frameInterval}
            onValueChange={setFrameInterval}
            min={5}
            max={30}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Analyzes the last few seconds by sampling frames at this interval
          </p>
        </div>

        <div className="p-3 bg-background/50 rounded border border-panel-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frames to analyze:</span>
            <span className="font-medium">
              {Math.floor((shot.duration * 24) / frameInterval[0])} frames
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time coverage:</span>
            <span className="font-medium">{shot.duration}s</span>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <Button 
        className="w-full" 
        size="lg"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
      >
        <Zap className="w-4 h-4 mr-2" />
        {isAnalyzing ? 'Analyzing...' : 'Analyze Motion'}
      </Button>

      {isAnalyzing && (
        <div className="space-y-2">
          <Progress value={analysisProgress} />
          <p className="text-xs text-center text-muted-foreground">
            Processing frames and detecting motion patterns...
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {shot.motionAnalysis && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Motion Profile
            </Label>
            <div className="p-3 bg-background/50 rounded border border-panel-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Direction:</span>
                <div className="flex items-center gap-2">
                  <ArrowRight 
                    className="w-4 h-4 text-primary" 
                    style={{
                      transform: `rotate(${Math.atan2(shot.motionAnalysis.direction.y, shot.motionAnalysis.direction.x) * (180 / Math.PI)}deg)`
                    }}
                  />
                  <span className="text-sm font-medium">
                    {shot.motionAnalysis.direction.x > 0 ? 'Right' : 'Left'}, {shot.motionAnalysis.direction.y > 0 ? 'Down' : 'Up'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <span className="text-sm font-medium">
                  {shot.motionAnalysis.speed.toFixed(1)} px/frame
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Acceleration:</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {shot.motionAnalysis.acceleration > 0 ? 'Increasing' : 'Decreasing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Description */}
          <div className="space-y-2">
            <Label>AI Motion Description</Label>
            <Textarea
              value={shot.motionAnalysis.description}
              readOnly
              className="min-h-[100px] bg-background/50"
            />
          </div>

          {/* Key Frames */}
          <div className="space-y-2">
            <Label>Analyzed Key Frames</Label>
            <div className="grid grid-cols-4 gap-2">
              {shot.motionAnalysis.keyFrames.slice(0, 4).map((frame, idx) => (
                <div
                  key={idx}
                  className="aspect-video bg-black/50 rounded border border-panel-border overflow-hidden"
                >
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    Frame {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apply to Next Shot */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleApplyToNextShot}
          >
            Apply Analysis to Next Shot
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Next video generation will use this motion profile for consistency
          </p>
        </div>
      )}

      {!shot.motionAnalysis && !isAnalyzing && (
        <div className="p-4 bg-background/30 rounded border border-dashed border-panel-border text-center">
          <p className="text-sm text-muted-foreground">
            No analysis yet. Click "Analyze Motion" to generate motion profile.
          </p>
        </div>
      )}
    </div>
  );
};
