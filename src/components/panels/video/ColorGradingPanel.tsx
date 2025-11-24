import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";

export const ColorGradingPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Color Grading</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Professional color correction
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>LUT Preset</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="bleach-bypass">Bleach Bypass</SelectItem>
                <SelectItem value="teal-orange">Teal & Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Temperature: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Tint: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Exposure: 0</Label>
            <Slider defaultValue={[0]} min={-2} max={2} step={0.1} />
          </div>

          <div className="space-y-2">
            <Label>Contrast: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Saturation: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Highlights: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Shadows: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Vibrance: 0</Label>
            <Slider defaultValue={[0]} min={-100} max={100} step={1} />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Apply</Button>
            <Button variant="outline" className="flex-1">Reset</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
