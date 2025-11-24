import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Wand2, Download } from "lucide-react";

export const BackstoryManagerPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Backstory Manager</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Novel-length character development
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button className="flex-1">
              <Wand2 className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Word Count:</span>
              <span className="font-semibold">12,847 words</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Chapters:</span>
              <span className="font-semibold">8 chapters</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Development:</span>
              <span className="font-semibold">Complete</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Chapter 1: Origins</label>
            <Textarea
              className="min-h-[120px] font-serif text-sm"
              defaultValue="Sarah Chen was born in a small coastal town where the fog rolled in like clockwork every evening. Her earliest memories were of her grandmother's stories, told in Mandarin, about ancestors who sailed across oceans in search of new beginnings..."
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Key Life Events</label>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded text-xs">
                <span className="font-semibold">Age 8:</span> Discovered passion for art after visiting grandmother's studio
              </div>
              <div className="p-2 bg-muted rounded text-xs">
                <span className="font-semibold">Age 16:</span> Won regional art competition, decided to pursue creative career
              </div>
              <div className="p-2 bg-muted rounded text-xs">
                <span className="font-semibold">Age 22:</span> Graduated art school, first major setback with gallery rejection
              </div>
              <div className="p-2 bg-muted rounded text-xs">
                <span className="font-semibold">Age 28:</span> First successful exhibition, found her unique voice
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Core Motivations</label>
            <Textarea
              className="min-h-[80px] text-sm"
              defaultValue="Driven by a need to prove herself while honoring her cultural heritage. Seeks validation through art but struggles with imposter syndrome."
              readOnly
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
