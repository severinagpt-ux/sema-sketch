import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Lock, Unlock, Sparkles, Wand2, Palette, RefreshCw, 
  Check, X, Layers, User, ImagePlus
} from "lucide-react";
import { useCharacterAI } from "@/hooks/useCharacterAI";

interface CharacterSculptPanelProps {
  characterImage?: string;
  onSave: (finalImage: string) => void;
}

const styleTemplates = [
  { id: 'photoreal', label: 'Photoreal Film Still', icon: '🎬' },
  { id: 'anime', label: 'Anime Cel-Shaded', icon: '🎨' },
  { id: 'painterly', label: 'Painterly Concept Art', icon: '🖌️' },
  { id: 'cinematic', label: 'Cinematic Portrait', icon: '📽️' },
  { id: 'noir', label: 'Film Noir', icon: '🌑' },
  { id: 'fantasy', label: 'Fantasy Illustration', icon: '✨' },
];

const backgroundOptions = [
  { id: 'studio-white', label: 'Studio White' },
  { id: 'studio-dark', label: 'Dark Gradient' },
  { id: 'transparent', label: 'Transparent' },
  { id: 'thematic', label: 'Thematic Environment' },
];

export const CharacterSculptPanel = ({ characterImage, onSave }: CharacterSculptPanelProps) => {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('photoreal');
  const [selectedBackground, setSelectedBackground] = useState('studio-white');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [variants, setVariants] = useState<string[]>([]);
  const [activeVariant, setActiveVariant] = useState<number | null>(null);
  
  const { loading, generateCharacterImage } = useCharacterAI();

  // Proportion adjustments
  const [proportions, setProportions] = useState({
    height: 50,
    shoulderWidth: 50,
    jawline: 50,
    noseSize: 50,
    eyeSpacing: 50,
  });

  const handleLockIdentity = async () => {
    setIsLocked(true);
    // This would clean artifacts and lock the style
  };

  const handleGenerateVariants = async () => {
    // Generate subtle variants for user to choose from
    // This would use the AI to create micro-changes
  };

  const handleRefine = async () => {
    if (!refinementPrompt) return;
    // Apply the refinement using AI
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">Character Sculpt</h3>
          <Button
            size="sm"
            variant={isLocked ? "default" : "outline"}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-powered refinement tools
        </p>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="w-full grid grid-cols-3 px-4 pt-2">
            <TabsTrigger value="identity" className="text-xs">Identity</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="variants" className="text-xs">Variants</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="p-4 space-y-4">
            {/* Lock Identity Button */}
            <Button 
              className="w-full" 
              onClick={handleLockIdentity}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Lock Identity (Clean Artifacts)
            </Button>

            {/* Local Refinement */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">AI Refinement</Label>
              <Textarea
                placeholder="e.g., Change the jacket to dark red leather, make eyes slightly brighter..."
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                className="w-full" 
                variant="secondary"
                disabled={!refinementPrompt || loading}
                onClick={handleRefine}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Apply Refinement
              </Button>
            </div>

            {/* Proportion Adjustments */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Proportion Adjustments</Label>
              
              {Object.entries(proportions).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-xs text-primary">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    min={0}
                    max={100}
                    step={1}
                    disabled={isLocked}
                    onValueChange={([v]) => setProportions(prev => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            {/* Style Templates */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Style Template</Label>
              <div className="grid grid-cols-2 gap-2">
                {styleTemplates.map(style => (
                  <Card
                    key={style.id}
                    className={`p-3 cursor-pointer transition-all hover:border-primary ${
                      selectedStyle === style.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <span className="text-lg mb-1 block">{style.icon}</span>
                    <p className="text-xs font-medium">{style.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Background Control */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Background</Label>
              <div className="flex flex-wrap gap-2">
                {backgroundOptions.map(bg => (
                  <Badge
                    key={bg.id}
                    variant={selectedBackground === bg.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedBackground(bg.id)}
                  >
                    {bg.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full" disabled={loading}>
              <Palette className="w-4 h-4 mr-2" />
              Apply Style
            </Button>
          </TabsContent>

          <TabsContent value="variants" className="p-4 space-y-4">
            {/* Generate Variants */}
            <Button 
              className="w-full"
              onClick={handleGenerateVariants}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Subtle Variants
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Try micro-changes: haircut, aging, wardrobe
            </p>

            {/* Variants Grid */}
            {variants.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {variants.map((variant, idx) => (
                  <Card
                    key={idx}
                    className={`relative overflow-hidden cursor-pointer transition-all ${
                      activeVariant === idx ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveVariant(idx)}
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    {activeVariant === idx && (
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <Button size="icon" variant="default" className="w-6 h-6">
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="destructive" className="w-6 h-6">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Layers className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No variants generated yet
                </p>
              </div>
            )}

            {/* Layer Control */}
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <Label className="text-xs font-medium">Layer View</Label>
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer">Original</Badge>
                <Badge variant="outline" className="cursor-pointer">Current</Badge>
                <Badge variant="outline" className="cursor-pointer">Masks</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Final Button */}
        <div className="p-4 border-t border-border">
          <Button 
            className="w-full"
            onClick={() => onSave(characterImage || '')}
          >
            <User className="w-4 h-4 mr-2" />
            Save as Canonical Character
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
