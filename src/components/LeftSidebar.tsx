import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Menu, ChevronRight, MousePointer2, Wand2, Lasso, Crop, PenTool, 
  Paintbrush, Eraser, Layers, Users, Film, Box, Music, Sparkles,
  FileText, Camera, Palette, Settings, Info, MessageSquare, Package
} from 'lucide-react';
import { PageType } from '@/lib/types';
import { useToolContext } from '@/contexts/ToolContext';

interface LeftSidebarProps {
  currentPage?: PageType;
  onToolChange?: (tool: string) => void;
}

// Universal tools (bottom section - available on all pages)
const universalTools = [
  { icon: MessageSquare, id: 'ai-chat', label: 'AI Chat' },
  { icon: Package, id: 'assets', label: 'Assets' },
  { icon: Settings, id: 'settings', label: 'Settings' },
];

export const LeftSidebar = ({ currentPage = 'canvas', onToolChange }: LeftSidebarProps) => {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const { activeTool, setActiveTool } = useToolContext();

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool('select' as any);
      onToolChange?.('select' as any);
    } else {
      setActiveTool(toolId as any);
      onToolChange?.(toolId as any);
    }
  };

  const handleDrawerToggle = (drawerId: string) => {
    setActiveDrawer(activeDrawer === drawerId ? null : drawerId);
  };

  // Get page-specific tools
  const getPageTools = () => {
    switch (currentPage) {
      case 'canvas':
        return [
          { icon: MousePointer2, id: 'select', label: 'Select' },
          { icon: Wand2, id: 'magic-wand', label: 'Magic Wand' },
          { icon: Lasso, id: 'lasso', label: 'Lasso' },
          { icon: Crop, id: 'crop', label: 'Crop' },
          { icon: PenTool, id: 'pen', label: 'Pen' },
          { icon: Paintbrush, id: 'brush', label: 'Brush' },
          { icon: Eraser, id: 'eraser', label: 'Eraser' },
        ];
      case 'storyboard':
        return [
          { icon: Camera, id: 'add-shot', label: 'Add Shot' },
          { icon: Film, id: 'scene-manager', label: 'Scene Manager' },
          { icon: FileText, id: 'script', label: 'Script' },
          { icon: Palette, id: 'visual-style', label: 'Visual Style' },
          { icon: Sparkles, id: 'ai-generate', label: 'AI Generate' },
        ];
      case 'characters':
        return [
          { icon: Users, id: 'new-character', label: 'New Character' },
          { icon: Paintbrush, id: 'recolor', label: 'Recolor Brush' },
          { icon: Lasso, id: 'lasso', label: 'Lasso Select' },
          { icon: Crop, id: 'proportion-warp', label: 'Proportion Warp' },
          { icon: Eraser, id: 'bg-eraser', label: 'Background Eraser' },
          { icon: Layers, id: 'layer-view', label: 'Layer View' },
          { icon: Sparkles, id: 'ai-generate', label: 'AI Generate' },
        ];
      case 'props':
        return [
          { icon: Box, id: 'props-library', label: 'Props Library' },
          { icon: Film, id: 'scene-library', label: 'Scene Library' },
          { icon: Sparkles, id: 'ai-generate', label: 'AI Generate' },
          { icon: Palette, id: 'style-variations', label: 'Style Variations' },
          { icon: Wand2, id: 'customize', label: 'Customize' },
        ];
      case 'video':
        return [
          { icon: Film, id: 'shot-manager', label: 'Shot Manager' },
          { icon: Camera, id: 'motion-analysis', label: 'Motion Analysis' },
          { icon: Layers, id: 'frame-extract', label: 'Frame Extract' },
          { icon: Palette, id: 'color-grading', label: 'Color Grading' },
          { icon: Sparkles, id: 'cinematic-styles', label: 'Cinematic Styles' },
        ];
      case 'audio':
        return [
          { icon: Music, id: 'audio-forge', label: 'Audio Forge' },
          { icon: Sparkles, id: 'voice-synthesis', label: 'Voice Synthesis' },
          { icon: Wand2, id: 'music-generator', label: 'Music Generator' },
          { icon: Palette, id: 'audio-mixer', label: 'Audio Mixer' },
        ];
      default:
        return [];
    }
  };

  const pageTools = getPageTools();

  const renderDrawerContent = () => {
    if (!activeDrawer) return null;
    
    return (
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-4">{activeDrawer}</h3>
          <p className="text-xs text-muted-foreground">Drawer content for {activeDrawer}</p>
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Icon Button Bar */}
      <div className="w-12 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
        {/* Page-Specific Tools (Top Section) */}
        {pageTools.map(({ icon: Icon, id, label }) => (
          <Button
            key={id}
            variant={activeTool === id ? "default" : "ghost"}
            size="icon"
            className="tool-button"
            onClick={() => handleToolClick(id)}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
        
        {/* Divider */}
        <div className="h-px w-8 bg-border my-2" />
        
        {/* Universal Tools (Bottom Section) */}
        {universalTools.map(({ icon: Icon, id, label }) => (
          <Button
            key={id}
            variant={activeDrawer === id ? "default" : "ghost"}
            size="icon"
            className="tool-button"
            onClick={() => handleDrawerToggle(id)}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {/* Drawer Content */}
      {activeDrawer && (
        <div 
          className="bg-panel-bg border-r border-panel-border panel-slide"
          style={{ width: '280px' }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border">
              <h2 className="text-sm font-semibold capitalize">{activeDrawer.replace(/-/g, ' ')}</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="icon-button h-6 w-6"
                onClick={() => setActiveDrawer(null)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {renderDrawerContent()}
          </div>
        </div>
      )}
    </div>
  );
};
