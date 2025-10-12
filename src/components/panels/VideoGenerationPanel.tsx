import { useState } from 'react';
import { Upload, Layers, Image as ImageIcon, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type InputSource = 'layer' | 'canvas' | 'asset' | 'upload';

export const VideoGenerationPanel = () => {
  const [inputSource, setInputSource] = useState<InputSource>('canvas');
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([5]);
  const [fps, setFps] = useState('24');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  const handleGenerate = () => {
    console.log('Generating video with:', {
      inputSource,
      prompt,
      duration: duration[0],
      fps,
      aspectRatio,
    });
    // TODO: Integrate with Google Video Gen API
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Generate Video Shot</h3>
        <p className="text-sm text-muted-foreground">
          Create AI-generated video from your content
        </p>
      </div>

      {/* Input Source Selection */}
      <div className="space-y-2">
        <Label>First Frame Source</Label>
        <Tabs value={inputSource} onValueChange={(v) => setInputSource(v as InputSource)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="canvas" className="text-xs">
              <ImageIcon className="w-3 h-3 mr-1" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="layer" className="text-xs">
              <Layers className="w-3 h-3 mr-1" />
              Layer
            </TabsTrigger>
            <TabsTrigger value="asset" className="text-xs">
              <FileImage className="w-3 h-3 mr-1" />
              Asset
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="w-3 h-3 mr-1" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="canvas" className="mt-4">
            <div className="aspect-video bg-black/50 rounded border border-panel-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Current canvas preview</p>
            </div>
          </TabsContent>

          <TabsContent value="layer" className="mt-4 space-y-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a layer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="layer1">Background Layer</SelectItem>
                <SelectItem value="layer2">Character Layer</SelectItem>
                <SelectItem value="layer3">Effects Layer</SelectItem>
              </SelectContent>
            </Select>
            <div className="aspect-video bg-black/50 rounded border border-panel-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Layer preview</p>
            </div>
          </TabsContent>

          <TabsContent value="asset" className="mt-4 space-y-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asset1">Scene 01.png</SelectItem>
                <SelectItem value="asset2">Character.png</SelectItem>
                <SelectItem value="asset3">Background.jpg</SelectItem>
              </SelectContent>
            </Select>
            <div className="aspect-video bg-black/50 rounded border border-panel-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Asset preview</p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="aspect-video bg-black/50 rounded border-2 border-dashed border-panel-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <Label htmlFor="prompt">Video Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Describe the motion and action for this video shot..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">
          Tip: Be specific about camera movement, subject actions, and transitions
        </p>
      </div>

      {/* Video Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Duration: {duration[0]}s</Label>
          <Slider
            value={duration}
            onValueChange={setDuration}
            min={2}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Frame Rate</Label>
            <Select value={fps} onValueChange={setFps}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 fps</SelectItem>
                <SelectItem value="30">30 fps</SelectItem>
                <SelectItem value="60">60 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button 
        className="w-full" 
        size="lg"
        onClick={handleGenerate}
        disabled={!prompt}
      >
        Generate Video Shot
      </Button>
    </div>
  );
};
