import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Play } from "lucide-react";

export const ConsistencyValidatorPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Consistency Validator</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Check character consistency
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Run Validation Check
          </Button>

          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-primary">Overall Score</span>
              <span className="text-3xl font-bold text-primary">99.9%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Excellent consistency across all generations
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Facial Features</span>
                  <Badge variant="default">100%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Perfect match across all angles and expressions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Body Proportions</span>
                  <Badge variant="default">99.8%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Consistent body structure maintained
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Skin Tone</span>
                  <Badge variant="default">100%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Accurate color matching in all lighting
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Hair Style</span>
                  <Badge variant="secondary">99.5%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minor variations in hair volume detected
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Expressions</span>
                  <Badge variant="default">100%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Natural and consistent emotional range
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Validation Details</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Images Analyzed:</span>
                <span>47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Check:</span>
                <span>2 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DNA Lock:</span>
                <span className="text-primary">Active</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
