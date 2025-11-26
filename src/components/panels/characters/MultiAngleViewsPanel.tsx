import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Camera, RotateCw, Loader2 } from "lucide-react";
import { useCharacterAI } from "@/hooks/useCharacterAI";
import { useState } from "react";

export const MultiAngleViewsPanel = () => {
  const { loading, generateCharacterImage } = useCharacterAI();
  const [generatingAngle, setGeneratingAngle] = useState<string | null>(null);
  
  const angles = [
    { id: "front", name: "Front View", status: "generated" },
    { id: "threequarter", name: "3/4 View", status: "generated" },
    { id: "side", name: "Side Profile", status: "generated" },
    { id: "rear", name: "Back View", status: "pending" },
  ];

  const handleGenerate = async (angleId: string, angleName: string) => {
    setGeneratingAngle(angleId);
    
    // Mock character data - in real app, this would come from selected character
    const characterData = {
      name: "Sarah Chen",
      description: "Professional woman in her late 20s",
      dna: {
        faceShape: "oval",
        eyeSize: "medium",
        noseSize: "medium",
        mouthSize: "medium",
        hairStyle: "shoulder length",
        bodyType: "athletic",
        skinTone: "medium"
      },
      angle: angleName
    };

    await generateCharacterImage(characterData, 'multi-angle', {
      enabled: true,
      referenceFeatures: "Consistent facial features across all angles"
    });
    
    setGeneratingAngle(null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Multi-Angle Views</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Front, 3/4, side, back views with DNA consistency
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {angles.map((angle) => (
            <div
              key={angle.id}
              className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
            >
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {angle.status === "generated" ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
                ) : (
                  <Camera className="w-12 h-12 text-muted-foreground opacity-30" />
                )}
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{angle.name}</span>
                  {angle.status === "generated" && (
                    <span className="text-xs text-primary">✓ Generated</span>
                  )}
                </div>
                {angle.status === "pending" ? (
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleGenerate(angle.id, angle.name)}
                    disabled={loading}
                  >
                    {loading && generatingAngle === angle.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4 mr-2" />
                        Generate View
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerate(angle.id, angle.name)}
                    disabled={loading}
                  >
                    {loading && generatingAngle === angle.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </>
                    )}
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
