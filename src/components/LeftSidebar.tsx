import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { 
  Menu, X, Layers, Users, Film, Box, Music, Sparkles,
  FileText, Camera, Palette, Wand2, Settings, Info
} from 'lucide-react';
import { PageType } from '@/lib/types';

interface LeftSidebarProps {
  currentPage?: PageType;
}

export const LeftSidebar = ({ currentPage = 'canvas' }: LeftSidebarProps) => {
  const [open, setOpen] = useState(false);

  // Pages that should show a drawer instead of toolbar
  const drawerPages: PageType[] = ['storyboard', 'characters', 'props', 'video', 'audio'];
  const shouldShowDrawer = drawerPages.includes(currentPage);

  if (!shouldShowDrawer) {
    return null; // Canvas page uses LeftToolbar instead
  }

  const getPageContent = () => {
    switch (currentPage) {
      case 'storyboard':
        return {
          title: 'Storyboard Tools',
          sections: [
            {
              title: 'Shot Management',
              items: [
                { icon: Camera, label: 'Add Shot', desc: 'Create new storyboard panel' },
                { icon: Film, label: 'Scene Manager', desc: 'Organize scenes and sequences' },
                { icon: FileText, label: 'Script Sync', desc: 'Sync with script' }
              ]
            },
            {
              title: 'Visual Tools',
              items: [
                { icon: Palette, label: 'Visual Style', desc: 'Apply cinematic styles' },
                { icon: Sparkles, label: 'AI Generate', desc: 'Generate panels with AI' },
                { icon: Wand2, label: 'Auto-Layout', desc: 'Smart panel arrangement' }
              ]
            }
          ]
        };
      
      case 'characters':
        return {
          title: 'Character Tools',
          sections: [
            {
              title: 'Character Creation',
              items: [
                { icon: Users, label: 'New Character', desc: 'Create character profile' },
                { icon: Sparkles, label: 'AI Generate', desc: 'Generate character with AI' },
                { icon: Camera, label: 'Multi-Angle Views', desc: 'Generate all angles' }
              ]
            },
            {
              title: 'Character Development',
              items: [
                { icon: FileText, label: 'Backstory', desc: 'Write character history' },
                { icon: Palette, label: 'Outfits', desc: 'Design costume variations' },
                { icon: Info, label: 'Personality', desc: 'Define traits and behavior' }
              ]
            }
          ]
        };
      
      case 'props':
        return {
          title: 'Props & Scenes',
          sections: [
            {
              title: 'Asset Management',
              items: [
                { icon: Box, label: 'Props Library', desc: 'Browse prop collection' },
                { icon: Film, label: 'Scene Library', desc: 'Browse scene templates' },
                { icon: Sparkles, label: 'AI Generate', desc: 'Create props with AI' }
              ]
            },
            {
              title: 'Customization',
              items: [
                { icon: Palette, label: 'Style Variations', desc: 'Apply style changes' },
                { icon: Wand2, label: 'Customize', desc: 'Modify asset properties' },
                { icon: Camera, label: 'Multi-View', desc: 'View from all angles' }
              ]
            }
          ]
        };
      
      case 'video':
        return {
          title: 'Video Tools',
          sections: [
            {
              title: 'Shot Management',
              items: [
                { icon: Film, label: 'Shot Manager', desc: 'Organize video shots' },
                { icon: Camera, label: 'Motion Analysis', desc: 'Analyze movement' },
                { icon: Layers, label: 'Frame Extract', desc: 'Extract key frames' }
              ]
            },
            {
              title: 'Enhancement',
              items: [
                { icon: Palette, label: 'Color Grading', desc: 'Adjust colors and tones' },
                { icon: Sparkles, label: 'Cinematic Styles', desc: 'Apply film looks' },
                { icon: Wand2, label: 'Effects', desc: 'Add visual effects' }
              ]
            }
          ]
        };
      
      case 'audio':
        return {
          title: 'Audio Tools',
          sections: [
            {
              title: 'Audio Creation',
              items: [
                { icon: Music, label: 'Audio Forge', desc: 'Record and edit audio' },
                { icon: Sparkles, label: 'Voice Synthesis', desc: 'Generate AI voices' },
                { icon: Wand2, label: 'Music Generator', desc: 'Create music with AI' }
              ]
            },
            {
              title: 'Processing',
              items: [
                { icon: Palette, label: 'Audio Mixer', desc: 'Mix multiple tracks' },
                { icon: Settings, label: 'Effects', desc: 'Apply audio effects' },
                { icon: Camera, label: 'Spatial Audio', desc: '3D audio positioning' }
              ]
            }
          ]
        };
      
      default:
        return { title: 'Tools', sections: [] };
    }
  };

  const content = getPageContent();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-2 top-20 z-50 bg-toolbar border border-panel-border shadow-lg hover:bg-accent"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            {content.title}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="p-4 space-y-6">
            {content.sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <Button
                      key={itemIdx}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
