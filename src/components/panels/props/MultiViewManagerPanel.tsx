import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Camera, RotateCw } from "lucide-react";

export const MultiViewManagerPanel = () => {
  const views = [
    { id: "top", name: "Top View", generated: true },
    { id: "front", name: "Front View", generated: true },
    { id: "side", name: "Side View", generated: true },
    { id: "perspective", name: "Perspective", generated: false },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Multi-View Manager</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Different angles and perspectives
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {views.map((view) => (
            <div
              key={view.id}
              className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
            >
              <div className="aspect-video bg-muted flex items-center justify-center relative">
                {view.generated ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
                ) : (
                  <Camera className="w-12 h-12 text-muted-foreground opacity-30" />
                )}
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{view.name}</span>
                  {view.generated && (
                    <span className="text-xs text-primary">✓ Generated</span>
                  )}
                </div>
                {view.generated ? (
                  <Button className="w-full" size="sm" variant="outline">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                ) : (
                  <Button className="w-full" size="sm">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Generate View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
