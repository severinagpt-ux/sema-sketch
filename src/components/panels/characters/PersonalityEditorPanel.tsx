import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

export const PersonalityEditorPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Personality Editor</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          OCEAN, MBTI, Enneagram systems
        </p>
      </div>

      <Tabs defaultValue="ocean" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4">
          <TabsTrigger value="ocean">OCEAN</TabsTrigger>
          <TabsTrigger value="mbti">MBTI</TabsTrigger>
          <TabsTrigger value="enneagram">Enneagram</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="ocean" className="m-0 p-4 space-y-4">
            <div className="space-y-2">
              <Label>Openness: 82%</Label>
              <Slider defaultValue={[82]} min={0} max={100} step={1} />
              <p className="text-xs text-muted-foreground">Imaginative, curious, open to new experiences</p>
            </div>

            <div className="space-y-2">
              <Label>Conscientiousness: 65%</Label>
              <Slider defaultValue={[65]} min={0} max={100} step={1} />
              <p className="text-xs text-muted-foreground">Organized, responsible, dependable</p>
            </div>

            <div className="space-y-2">
              <Label>Extraversion: 45%</Label>
              <Slider defaultValue={[45]} min={0} max={100} step={1} />
              <p className="text-xs text-muted-foreground">Moderate social engagement</p>
            </div>

            <div className="space-y-2">
              <Label>Agreeableness: 78%</Label>
              <Slider defaultValue={[78]} min={0} max={100} step={1} />
              <p className="text-xs text-muted-foreground">Compassionate, cooperative, trusting</p>
            </div>

            <div className="space-y-2">
              <Label>Neuroticism: 35%</Label>
              <Slider defaultValue={[35]} min={0} max={100} step={1} />
              <p className="text-xs text-muted-foreground">Emotionally stable, calm under pressure</p>
            </div>
          </TabsContent>

          <TabsContent value="mbti" className="m-0 p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="default" className="justify-center py-2">I - Introvert</Badge>
                <Badge variant="outline" className="justify-center py-2">E - Extravert</Badge>
                <Badge variant="default" className="justify-center py-2">N - Intuitive</Badge>
                <Badge variant="outline" className="justify-center py-2">S - Sensing</Badge>
                <Badge variant="outline" className="justify-center py-2">T - Thinking</Badge>
                <Badge variant="default" className="justify-center py-2">F - Feeling</Badge>
                <Badge variant="default" className="justify-center py-2">J - Judging</Badge>
                <Badge variant="outline" className="justify-center py-2">P - Perceiving</Badge>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary mb-2">Type: INFJ</p>
                <p className="text-xs text-muted-foreground">
                  "The Advocate" - Idealistic, organized, insightful, and nurturing. 
                  Seeks meaning and authenticity in relationships.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="enneagram" className="m-0 p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Badge
                    key={num}
                    variant={num === 4 ? "default" : "outline"}
                    className="justify-center py-3"
                  >
                    Type {num}
                  </Badge>
                ))}
              </div>

              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary mb-2">Type 4: The Individualist</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Creative, sensitive, and introspective. Seeks authenticity and self-expression.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wing:</span>
                    <span>4w5 (with Five)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tritype:</span>
                    <span>4-5-9</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
