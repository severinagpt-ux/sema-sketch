import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shirt, Plus } from "lucide-react";

export const OutfitVariationsPanel = () => {
  const outfits = [
    { id: 1, name: "Casual Everyday", items: ["Jeans", "T-Shirt", "Sneakers"], season: "All" },
    { id: 2, name: "Business Formal", items: ["Suit", "Tie", "Dress Shoes"], season: "All" },
    { id: 3, name: "Evening Wear", items: ["Dress", "Heels", "Clutch"], season: "All" },
    { id: 4, name: "Athletic", items: ["Tracksuit", "Running Shoes"], season: "All" },
    { id: 5, name: "Winter Coat", items: ["Coat", "Scarf", "Boots"], season: "Winter" },
    { id: 6, name: "Summer Light", items: ["Shorts", "Tank Top", "Sandals"], season: "Summer" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Outfit Variations</h3>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Clothing and style options
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {outfits.map((outfit) => (
            <Button
              key={outfit.id}
              variant="outline"
              className="w-full h-auto p-3 flex items-start gap-3 hover:border-primary"
            >
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Shirt className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left space-y-2">
                <div className="font-medium text-sm">{outfit.name}</div>
                <div className="flex flex-wrap gap-1">
                  {outfit.items.map((item, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
                <Badge variant="outline" className="text-xs">
                  {outfit.season}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
