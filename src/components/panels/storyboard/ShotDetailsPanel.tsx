import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Camera } from "lucide-react";

export const ShotDetailsPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Shot Details</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Camera angles and composition
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Shot Type</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extreme-wide">Extreme Wide Shot</SelectItem>
                <SelectItem value="wide">Wide Shot</SelectItem>
                <SelectItem value="medium">Medium Shot</SelectItem>
                <SelectItem value="close-up">Close-Up</SelectItem>
                <SelectItem value="extreme-close-up">Extreme Close-Up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Camera Angle</Label>
            <Select defaultValue="eye-level">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Angle</SelectItem>
                <SelectItem value="eye-level">Eye Level</SelectItem>
                <SelectItem value="low">Low Angle</SelectItem>
                <SelectItem value="dutch">Dutch Angle</SelectItem>
                <SelectItem value="overhead">Overhead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Camera Movement</Label>
            <Select defaultValue="static">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="pan">Pan</SelectItem>
                <SelectItem value="tilt">Tilt</SelectItem>
                <SelectItem value="dolly">Dolly</SelectItem>
                <SelectItem value="tracking">Tracking</SelectItem>
                <SelectItem value="crane">Crane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Focal Length: 50mm</Label>
            <Slider defaultValue={[50]} min={18} max={200} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Depth of Field</Label>
            <Slider defaultValue={[5]} min={0} max={10} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Composition</Label>
            <Select defaultValue="rule-of-thirds">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rule-of-thirds">Rule of Thirds</SelectItem>
                <SelectItem value="golden-ratio">Golden Ratio</SelectItem>
                <SelectItem value="centered">Centered</SelectItem>
                <SelectItem value="symmetrical">Symmetrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
