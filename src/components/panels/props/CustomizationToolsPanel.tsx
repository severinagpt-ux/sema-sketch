import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Wand2, RotateCw } from "lucide-react";

export const CustomizationToolsPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Customization Tools</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Modify existing assets
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Scale</Label>
            <Slider defaultValue={[100]} min={50} max={200} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Rotation</Label>
            <Slider defaultValue={[0]} min={0} max={360} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Color Tint</Label>
            <Slider defaultValue={[0]} min={0} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Wear & Tear</Label>
            <Slider defaultValue={[0]} min={0} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Material Finish</Label>
            <Slider defaultValue={[50]} min={0} max={100} step={1} />
            <p className="text-xs text-muted-foreground">Matte ← → Glossy</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <RotateCw className="w-4 h-4 mr-2" />
              Apply
            </Button>
            <Button variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
