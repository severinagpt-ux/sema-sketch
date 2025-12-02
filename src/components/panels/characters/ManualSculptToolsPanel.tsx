import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Paintbrush, Lasso, Move, Eraser, Droplet, Pipette,
  Undo2, Redo2, ZoomIn, ZoomOut, Eye, EyeOff, Layers
} from "lucide-react";

interface ManualSculptToolsPanelProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const sculptTools = [
  { id: 'recolor', icon: Paintbrush, label: 'Recolor Brush', description: 'Paint to change colors' },
  { id: 'lasso', icon: Lasso, label: 'Lasso Select', description: 'Select region for AI edit' },
  { id: 'warp', icon: Move, label: 'Proportion Warp', description: 'Adjust proportions' },
  { id: 'erase', icon: Eraser, label: 'Background Eraser', description: 'Remove background' },
  { id: 'clone', icon: Droplet, label: 'Clone Stamp', description: 'Clone areas' },
  { id: 'sample', icon: Pipette, label: 'Color Sample', description: 'Pick colors' },
];

export const ManualSculptToolsPanel = ({ activeTool, onToolChange }: ManualSculptToolsPanelProps) => {
  const [brushSize, setBrushSize] = useState([30]);
  const [brushOpacity, setBrushOpacity] = useState([100]);
  const [brushHardness, setBrushHardness] = useState([75]);
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-1">Manual Tools</h3>
        <p className="text-xs text-muted-foreground">
          Direct editing controls
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="w-8 h-8">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <Redo2 className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Tool Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sculpt Tools</Label>
            <div className="grid grid-cols-2 gap-2">
              {sculptTools.map(tool => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-start gap-1"
                  onClick={() => onToolChange(tool.id)}
                >
                  <tool.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Brush Settings */}
          <div className="space-y-3 p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Brush Settings</Label>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Size</span>
                <span className="text-xs text-primary">{brushSize[0]}px</span>
              </div>
              <Slider
                value={brushSize}
                min={1}
                max={200}
                step={1}
                onValueChange={setBrushSize}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Opacity</span>
                <span className="text-xs text-primary">{brushOpacity[0]}%</span>
              </div>
              <Slider
                value={brushOpacity}
                min={1}
                max={100}
                step={1}
                onValueChange={setBrushOpacity}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Hardness</span>
                <span className="text-xs text-primary">{brushHardness[0]}%</span>
              </div>
              <Slider
                value={brushHardness}
                min={0}
                max={100}
                step={1}
                onValueChange={setBrushHardness}
              />
            </div>
          </div>

          {/* Layer Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Layer View</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showOriginal ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
              >
                {showOriginal ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                Original
              </Button>
              <Badge variant="outline" className="cursor-pointer">
                <Layers className="w-3 h-3 mr-1" />
                Hair Mask
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                <Layers className="w-3 h-3 mr-1" />
                Skin Mask
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                <Layers className="w-3 h-3 mr-1" />
                Clothes Mask
              </Badge>
            </div>
          </div>

          {/* Selection Info */}
          {activeTool === 'lasso' && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-primary font-medium mb-1">Lasso Selection Active</p>
              <p className="text-xs text-muted-foreground">
                Draw around an area, then type a description to apply AI changes to that region.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
