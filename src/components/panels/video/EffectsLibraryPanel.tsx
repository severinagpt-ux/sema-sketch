import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wand2, Search, Plus } from "lucide-react";

export const EffectsLibraryPanel = () => {
  const effects = [
    { id: 1, name: "Blur", category: "Basic", premium: false },
    { id: 2, name: "Chromatic Aberration", category: "Cinematic", premium: true },
    { id: 3, name: "Film Grain", category: "Vintage", premium: false },
    { id: 4, name: "Lens Flare", category: "Lighting", premium: true },
    { id: 5, name: "Vignette", category: "Basic", premium: false },
    { id: 6, name: "Glitch", category: "Digital", premium: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Effects Library</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          350+ AI visual effects
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search effects..." className="pl-9" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {effects.map((effect) => (
            <Button
              key={effect.id}
              variant="outline"
              className="w-full h-auto p-3 flex items-center gap-3 hover:border-primary"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted-foreground/20 rounded flex items-center justify-center flex-shrink-0">
                <Wand2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left space-y-1">
                <div className="font-medium text-sm">{effect.name}</div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {effect.category}
                  </Badge>
                  {effect.premium && (
                    <Badge variant="default" className="text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              <Plus className="w-5 h-5 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
