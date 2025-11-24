import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb, Save } from "lucide-react";

export const ProductionNotesPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Production Notes</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Director notes and requirements
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Director's Vision</label>
            <Textarea
              placeholder="Describe the intended mood, tone, and visual style..."
              className="min-h-[100px]"
              defaultValue="This scene should feel tense and claustrophobic. Use tight framing and harsh lighting to create unease."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technical Requirements</label>
            <Textarea
              placeholder="Camera equipment, special rigs, lighting setup..."
              className="min-h-[80px]"
              defaultValue="- Steadicam for tracking shot\n- 3-point lighting setup\n- Practical desk lamp"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Performance Notes</label>
            <Textarea
              placeholder="Actor direction and performance requirements..."
              className="min-h-[80px]"
              defaultValue="John should appear distracted, constantly checking his phone. Build tension gradually."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Continuity Notes</label>
            <Textarea
              placeholder="Important continuity details..."
              className="min-h-[60px]"
              defaultValue="Sarah's jacket changes from previous scene."
            />
          </div>

          <Button className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Notes
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
