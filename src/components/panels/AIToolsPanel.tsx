import { useState } from 'react';
import { Wand2, Sparkles, Brush, Pin, Lasso } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const AIToolsPanel = () => {
  const [activeTab, setActiveTab] = useState('instruct');

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      <div className="border-b border-panel-border px-4 py-2">
        <h2 className="text-sm font-semibold">AI Tools</h2>
      </div>

      {/* Area Selection Tools */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-panel-border">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pin className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Wand2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Lasso className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Brush className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground ml-2">Mark areas</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-panel-border bg-transparent h-auto p-0">
          <TabsTrigger value="instruct" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Instruct</TabsTrigger>
          <TabsTrigger value="generate" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Generate</TabsTrigger>
          <TabsTrigger value="enhance" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Enhance</TabsTrigger>
          <TabsTrigger value="inpaint" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Inpaint</TabsTrigger>
          <TabsTrigger value="lighting" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Lighting</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="instruct" className="p-4 space-y-3 mt-0">
            <h3 className="text-sm font-medium">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" className="h-auto py-2 flex flex-col gap-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Remove Blemish</span>
              </Button>
              <Button variant="secondary" size="sm" className="h-auto py-2 flex flex-col gap-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Add Object</span>
              </Button>
              <Button variant="secondary" size="sm" className="h-auto py-2 flex flex-col gap-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Remove Object</span>
              </Button>
              <Button variant="secondary" size="sm" className="h-auto py-2 flex flex-col gap-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Change Color</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="p-4 space-y-3 mt-0">
            <Textarea 
              placeholder="Describe what you want to generate..."
              className="min-h-[100px]"
            />
            
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Realism</label>
              <div className="relative">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="50"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Cartoon</span>
                  <span>Realistic</span>
                  <span>3D</span>
                </div>
              </div>
            </div>

            <Select defaultValue="balanced">
              <SelectTrigger>
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="high">High Quality</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </TabsContent>

          <TabsContent value="enhance" className="p-4 space-y-3 mt-0">
            <p className="text-sm text-muted-foreground">
              Enhance selected area with AI-powered improvements
            </p>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">Upscale Resolution</Button>
              <Button variant="secondary" className="w-full justify-start">Enhance Details</Button>
              <Button variant="secondary" className="w-full justify-start">Fix Compression</Button>
              <Button variant="secondary" className="w-full justify-start">Denoise</Button>
            </div>
          </TabsContent>

          <TabsContent value="inpaint" className="p-4 space-y-3 mt-0">
            <Textarea 
              placeholder="Describe what to fill the masked area with..."
              className="min-h-[100px]"
            />
            <Button className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Inpaint Selection
            </Button>
          </TabsContent>

          <TabsContent value="lighting" className="p-4 space-y-3 mt-0">
            <p className="text-sm text-muted-foreground">
              Adjust lighting and atmosphere with AI
            </p>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">Auto Relight</Button>
              <Button variant="secondary" className="w-full justify-start">Add Shadows</Button>
              <Button variant="secondary" className="w-full justify-start">Golden Hour</Button>
              <Button variant="secondary" className="w-full justify-start">Studio Lighting</Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
