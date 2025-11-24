import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";

export const VisualStylePanel = () => {
  const styles = [
    { id: "film-noir", name: "Film Noir", colors: ["#000000", "#333333", "#FFFFFF"] },
    { id: "golden-hour", name: "Golden Hour", colors: ["#FF9800", "#FFC107", "#FFE082"] },
    { id: "cyberpunk", name: "Cyberpunk", colors: ["#FF00FF", "#00FFFF", "#000033"] },
    { id: "wes-anderson", name: "Wes Anderson", colors: ["#F4C095", "#E8A87C", "#C38D9E"] },
    { id: "horror", name: "Horror", colors: ["#8B0000", "#2C0000", "#000000"] },
    { id: "sci-fi", name: "Sci-Fi", colors: ["#0066FF", "#00CCFF", "#003366"] },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Visual Style</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Cinematic style presets
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {styles.map((style) => (
            <Button
              key={style.id}
              variant="outline"
              className="w-full h-auto p-3 flex items-start gap-3 hover:border-primary"
            >
              <div className="flex gap-1">
                {style.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{style.name}</div>
              </div>
              {style.id === "golden-hour" && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
