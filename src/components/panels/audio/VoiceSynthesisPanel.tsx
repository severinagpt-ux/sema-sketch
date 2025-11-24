import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Play } from "lucide-react";

export const VoiceSynthesisPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Voice Synthesis</h3>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Select defaultValue="elevenlabs">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
              <SelectItem value="playht">PlayHT</SelectItem>
              <SelectItem value="amazon">Amazon Polly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Generate Speech
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
