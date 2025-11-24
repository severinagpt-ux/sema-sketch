import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

export const CinematicStylesPanel = () => {
  const styles = [
    { id: "film-noir", name: "Film Noir", desc: "High contrast, dramatic shadows" },
    { id: "golden-hour", name: "Golden Hour", desc: "Warm, soft natural lighting" },
    { id: "cyberpunk", name: "Cyberpunk", desc: "Neon lights, dark atmosphere" },
    { id: "horror", name: "Horror", desc: "Dark, eerie, unsettling" },
    { id: "sci-fi", name: "Sci-Fi", desc: "Futuristic, clean, technological" },
    { id: "vintage", name: "Vintage 70s", desc: "Retro color grading, grain" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Cinematic Styles</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Film noir, golden hour, cyberpunk, etc.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {styles.map((style, index) => (
            <Button
              key={style.id}
              variant="outline"
              className="w-full h-auto p-3 flex items-start gap-3 hover:border-primary relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/30 rounded flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm mb-1">{style.name}</div>
                <p className="text-xs text-muted-foreground">{style.desc}</p>
              </div>
              {index === 1 && (
                <Check className="w-5 h-5 text-primary absolute top-3 right-3" />
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
