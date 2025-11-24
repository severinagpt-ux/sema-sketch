import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Download, Wand2 } from "lucide-react";

export const ScriptIntegrationPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Script Integration</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Scene script and dialogue
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Scene 1 - INT. OFFICE - DAY</label>
            <Textarea
              placeholder="Enter dialogue and action..."
              className="min-h-[120px] font-mono text-sm"
              defaultValue="JOHN enters the office, looking concerned.\n\nJOHN\nWe need to talk about the project."
            />
          </div>

          <Button className="w-full" variant="secondary">
            <Wand2 className="w-4 h-4 mr-2" />
            AI Script Analysis
          </Button>

          <div className="p-3 bg-muted rounded-lg space-y-2">
            <p className="text-xs font-semibold">Script Breakdown:</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters:</span>
                <span>John, Sarah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Props:</span>
                <span>Office desk, Computer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>Office interior</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
