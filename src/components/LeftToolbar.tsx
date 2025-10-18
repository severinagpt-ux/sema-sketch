import { 
  MousePointer2, Wand2, Lasso, Crop, PenTool, Paintbrush, 
  Eraser, Copy, SunMoon, Droplet, Palette, Square, 
  Type, Sparkles, Ruler, ZoomIn 
} from 'lucide-react';
import { Button } from './ui/button';
import { Tool } from '@/lib/types';
import { useToolContext } from '@/contexts/ToolContext';

interface LeftToolbarProps {
  onToolChange: (tool: Tool) => void;
}

const tools: { icon: typeof MousePointer2; tool: Tool; label: string }[] = [
  { icon: MousePointer2, tool: 'select', label: 'Select' },
  { icon: Wand2, tool: 'magic-wand', label: 'Magic Wand' },
  { icon: Lasso, tool: 'lasso', label: 'Lasso' },
  { icon: Crop, tool: 'crop', label: 'Crop' },
  { icon: PenTool, tool: 'pen', label: 'Pen' },
  { icon: Paintbrush, tool: 'brush', label: 'Brush' },
  { icon: Eraser, tool: 'eraser', label: 'Eraser' },
  { icon: Copy, tool: 'clone', label: 'Clone' },
  { icon: SunMoon, tool: 'dodge-burn', label: 'Dodge/Burn' },
  { icon: Droplet, tool: 'blur-sharpen', label: 'Blur/Sharpen' },
  { icon: Palette, tool: 'gradient', label: 'Gradient' },
  { icon: Square, tool: 'shapes', label: 'Shapes' },
  { icon: Type, tool: 'text', label: 'Text' },
  { icon: Sparkles, tool: 'ai-tools', label: 'AI Tools' },
  { icon: Ruler, tool: 'measure', label: 'Measure' },
  { icon: ZoomIn, tool: 'magnifier', label: 'Magnifier' },
];

export const LeftToolbar = ({ onToolChange }: LeftToolbarProps) => {
  const { activeTool, setActiveTool } = useToolContext();
  
  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    onToolChange(tool);
  };
  return (
    <div className="w-14 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
      {tools.map(({ icon: Icon, tool, label }) => (
        <Button
          key={tool}
          variant={activeTool === tool ? "default" : "ghost"}
          size="icon"
          className="tool-button"
          onClick={() => handleToolChange(tool)}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </Button>
      ))}
    </div>
  );
};
