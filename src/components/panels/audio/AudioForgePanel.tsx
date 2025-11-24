import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Plus } from "lucide-react";

export const AudioForgePanel = () => {
  const tracks = [
    { id: 1, name: "Master", type: "Master", muted: false },
    { id: 2, name: "Vocals", type: "Voice", muted: false },
    { id: 3, name: "Music", type: "Music", muted: false },
    { id: 4, name: "SFX", type: "Effects", muted: false },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Audio Forge</h3>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Track
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Multi-track audio editor</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {tracks.map((track) => (
            <div key={track.id} className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{track.name}</span>
                <Badge variant="secondary" className="text-xs">{track.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
