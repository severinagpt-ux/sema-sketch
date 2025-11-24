import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Ruler, Play } from "lucide-react";

export const TimelineControlsPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Ruler className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Timeline Controls</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Detailed timeline management
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Zoom Level: 100%</Label>
            <Slider defaultValue={[100]} min={10} max={500} step={10} />
          </div>

          <div className="space-y-2">
            <Label>Playback Speed: 1.0x</Label>
            <Slider defaultValue={[1]} min={0.25} max={2} step={0.25} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Snap to Grid</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Waveforms</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Thumbnails</Label>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Frame Rate</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm">24 fps</Button>
              <Button variant="default" size="sm">30 fps</Button>
              <Button variant="outline" size="sm">60 fps</Button>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg space-y-2">
            <p className="text-xs font-semibold">Timeline Info</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Duration:</span>
                <span>1:23:45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clips:</span>
                <span>12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transitions:</span>
                <span>8</span>
              </div>
            </div>
          </div>

          <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Preview Timeline
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
