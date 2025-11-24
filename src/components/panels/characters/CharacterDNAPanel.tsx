import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Users, Lock, Unlock } from "lucide-react";
import { useState } from "react";

export const CharacterDNAPanel = () => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Character DNA</h3>
          </div>
          <Button
            size="sm"
            variant={isLocked ? "default" : "outline"}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Visual consistency controls (99.9%)
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">DNA Locked</p>
            <p className="text-xs text-muted-foreground">
              Character features are locked for consistency across all generations
            </p>
          </div>

          <div className="space-y-2">
            <Label>Face Shape</Label>
            <Slider defaultValue={[7]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Eye Size</Label>
            <Slider defaultValue={[5]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Nose Width</Label>
            <Slider defaultValue={[6]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Mouth Size</Label>
            <Slider defaultValue={[5]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Jaw Definition</Label>
            <Slider defaultValue={[7]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Skin Tone</Label>
            <Slider defaultValue={[5]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Hair Volume</Label>
            <Slider defaultValue={[8]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="space-y-2">
            <Label>Body Build</Label>
            <Slider defaultValue={[6]} min={0} max={10} step={1} disabled={isLocked} />
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Consistency Score</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">99.9%</span>
              <span className="text-xs text-muted-foreground">Across 47 generations</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
