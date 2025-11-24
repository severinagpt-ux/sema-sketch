import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Plus, Trash2, GripVertical } from "lucide-react";

export const ShotListPanel = () => {
  const shots = [
    { id: 1, name: "Shot 1A", scene: "Scene 1", duration: "3s", status: "completed" },
    { id: 2, name: "Shot 1B", scene: "Scene 1", duration: "2s", status: "in-progress" },
    { id: 3, name: "Shot 1C", scene: "Scene 1", duration: "4s", status: "pending" },
    { id: 4, name: "Shot 2A", scene: "Scene 2", duration: "5s", status: "pending" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Shot List</h3>
          </div>
          <Button size="sm" variant="default">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage all storyboard shots
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {shots.map((shot) => (
            <div
              key={shot.id}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{shot.name}</span>
                  <Badge
                    variant={
                      shot.status === "completed"
                        ? "default"
                        : shot.status === "in-progress"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {shot.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{shot.scene}</span>
                  <span>•</span>
                  <span>{shot.duration}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
