import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles } from "lucide-react";

interface AIAssistantPanelProps {
  currentPage?: string;
}

export const AIAssistantPanel = ({ currentPage }: AIAssistantPanelProps) => {
  const getPageContext = () => {
    switch (currentPage) {
      case 'canvas':
        return 'image editing and composition';
      case 'storyboard':
        return 'storyboard creation and shot planning';
      case 'characters':
        return 'character design and development';
      case 'props':
        return 'props and scene creation';
      case 'video':
        return 'video editing and cinematic effects';
      case 'audio':
        return 'audio editing and sound design';
      default:
        return 'your creative work';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Context-aware help for {getPageContext()}
        </p>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-lg p-3 flex-1">
              <p className="text-sm text-foreground">
                Hello! I'm your AI assistant. I can help you with {getPageContext()}. 
                What would you like to create today?
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input 
            placeholder="Ask me anything..." 
            className="flex-1"
          />
          <Button size="icon" variant="default">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
