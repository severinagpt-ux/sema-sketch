import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Palette, Wand2 } from "lucide-react";

export const StyleVariationsPanel = () => {
  const styles = [
    "Realistic", "Cartoon", "Anime", "Sketch", 
    "Watercolor", "Oil Painting", "3D Render", "Pixel Art"
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Style Variations</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Different visual styles
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Button className="w-full">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate All Styles
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {styles.map((style) => (
              <Button
                key={style}
                variant="outline"
                className="h-auto p-3 flex flex-col gap-2 hover:border-primary"
              >
                <div className="w-full aspect-square bg-muted rounded flex items-center justify-center">
                  <Palette className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium">{style}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
