import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Music, Zap } from "lucide-react";

export const AudioSyncPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Audio Sync</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Frame-perfect audio-visual sync
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Button className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Auto-Sync Audio
          </Button>

          <div className="flex items-center justify-between">
            <Label>Auto-Sync Enabled</Label>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Audio Offset: 0ms</Label>
            <Slider defaultValue={[0]} min={-500} max={500} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Sync Sensitivity</Label>
            <Slider defaultValue={[75]} min={0} max={100} step={1} />
          </div>

          <div className="p-3 bg-muted rounded-lg space-y-2">
            <p className="text-xs font-semibold">Sync Status</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Video Tracks:</span>
                <span>3 tracks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audio Tracks:</span>
                <span>5 tracks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sync Accuracy:</span>
                <span className="text-primary">99.8%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Beat Detection</Label>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <Label>Lip Sync Assistant</Label>
            <Switch />
          </div>

          <Button variant="outline" className="w-full">
            Manual Sync Adjustment
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
