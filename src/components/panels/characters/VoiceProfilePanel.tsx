import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Play, Download } from "lucide-react";

export const VoiceProfilePanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Voice Profile</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Voice synthesis and characteristics
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Voice Model</Label>
            <Select defaultValue="elevenlabs">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs">ElevenLabs - Professional</SelectItem>
                <SelectItem value="playht">PlayHT - Natural</SelectItem>
                <SelectItem value="amazon">Amazon Polly - Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Voice Type</Label>
            <Select defaultValue="female-young">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female-young">Female - Young Adult</SelectItem>
                <SelectItem value="female-mature">Female - Mature</SelectItem>
                <SelectItem value="male-young">Male - Young Adult</SelectItem>
                <SelectItem value="male-mature">Male - Mature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pitch: 1.0</Label>
            <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
          </div>

          <div className="space-y-2">
            <Label>Speed: 1.0x</Label>
            <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
          </div>

          <div className="space-y-2">
            <Label>Emotion: Neutral</Label>
            <Slider defaultValue={[5]} min={0} max={10} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Accent</Label>
            <Select defaultValue="american">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="australian">Australian</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Test Voice</p>
            <p className="text-xs text-muted-foreground mb-3">
              "Hello, this is a test of the voice synthesis system. How do I sound?"
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Play className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
