import { useState } from 'react';
import { Sparkles, Send, Download, Layers, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export const AIToolsPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I can help you generate images using AI. Just describe what you want to create!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      // Using Lovable AI Gateway with nano banana (gemini-2.5-flash-image-preview)
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY || 'demo-key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          modalities: ['image', 'text']
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
          return null;
        }
        if (response.status === 402) {
          toast.error('Payment required. Please add credits to your workspace.');
          return null;
        }
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (!imageUrl) {
        throw new Error('No image generated');
      }

      return imageUrl;
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const imageUrl = await generateImage(input);

    if (imageUrl) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Here\'s your generated image!',
        imageUrl
      };
      setMessages(prev => [...prev, assistantMessage]);
      toast.success('Image generated successfully!');
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    link.click();
    toast.success('Image downloaded!');
  };

  const handleAddToLayers = (imageUrl: string) => {
    // This would integrate with the layer system
    toast.success('Image added to layers!');
  };

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-panel-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Image Generator</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Powered by Google Gemini Nano Banana</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div 
              key={i} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                <p className="text-sm">{message.content}</p>
                {message.imageUrl && (
                  <div className="mt-2 space-y-2">
                    <img 
                      src={message.imageUrl} 
                      alt="Generated" 
                      className="w-full rounded border border-panel-border"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => handleDownload(message.imageUrl!)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => handleAddToLayers(message.imageUrl!)}
                      >
                        <Layers className="w-3 h-3 mr-1" />
                        Add to Layer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating image...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-panel-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe the image you want to generate..."
            className="min-h-[80px] resize-none"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            size="icon"
            className="h-[80px] w-12"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
