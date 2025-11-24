import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Plus } from "lucide-react";

export const SceneLibraryPanel = () => {
  const scenes = [
    { id: 1, name: "Modern Office", type: "Interior", elements: 12 },
    { id: 2, name: "City Street", type: "Exterior", elements: 24 },
    { id: 3, name: "Apartment Living Room", type: "Interior", elements: 18 },
    { id: 4, name: "Coffee Shop", type: "Interior", elements: 15 },
    { id: 5, name: "Park Landscape", type: "Exterior", elements: 20 },
    { id: 6, name: "Restaurant", type: "Interior", elements: 22 },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Scene Library</h3>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Complete environment templates
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {scenes.map((scene) => (
            <Button
              key={scene.id}
              variant="outline"
              className="w-full h-auto p-3 flex items-start gap-3 hover:border-primary"
            >
              <div className="w-20 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Film className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left space-y-2">
                <div className="font-medium text-sm">{scene.name}</div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {scene.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {scene.elements} elements
                  </Badge>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
