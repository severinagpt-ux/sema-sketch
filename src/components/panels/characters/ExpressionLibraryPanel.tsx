import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Plus } from "lucide-react";

export const ExpressionLibraryPanel = () => {
  const expressions = [
    { id: 1, name: "Neutral", intensity: "Medium", category: "Base" },
    { id: 2, name: "Happy", intensity: "High", category: "Positive" },
    { id: 3, name: "Sad", intensity: "Medium", category: "Negative" },
    { id: 4, name: "Angry", intensity: "High", category: "Negative" },
    { id: 5, name: "Surprised", intensity: "High", category: "Reactive" },
    { id: 6, name: "Fearful", intensity: "Medium", category: "Negative" },
    { id: 7, name: "Disgusted", intensity: "Low", category: "Negative" },
    { id: 8, name: "Contempt", intensity: "Low", category: "Negative" },
    { id: 9, name: "Excited", intensity: "High", category: "Positive" },
    { id: 10, name: "Curious", intensity: "Medium", category: "Reactive" },
    { id: 11, name: "Confused", intensity: "Medium", category: "Reactive" },
    { id: 12, name: "Determined", intensity: "High", category: "Positive" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Expression Library</h3>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          50+ emotional states
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {expressions.map((expr) => (
              <Button
                key={expr.id}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start gap-2 hover:border-primary"
              >
                <div className="w-full aspect-square bg-muted rounded flex items-center justify-center">
                  <Smile className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="w-full space-y-1">
                  <div className="font-medium text-sm">{expr.name}</div>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {expr.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {expr.intensity}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
