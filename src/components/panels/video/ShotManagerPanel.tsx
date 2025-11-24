import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Plus, Play } from "lucide-react";

export const ShotManagerPanel = () => {
  const shots = [
    { id: 1, name: "Opening Scene", duration: "5.2s", status: "ready" },
    { id: 2, name: "Character Intro", duration: "3.8s", status: "generating" },
    { id: 3, name: "Action Sequence", duration: "7.5s", status: "ready" },
    { id: 4, name: "Dialogue", duration: "4.2s", status: "pending" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Shot Manager</h3>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Video shot organization
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {shots.map((shot) => (
            <div
              key={shot.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{shot.name}</span>
                  <Badge
                    variant={
                      shot.status === "ready"
                        ? "default"
                        : shot.status === "generating"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {shot.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{shot.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
