import { useState } from 'react';
import { Layers, Info, Wand, Palette, ChevronLeft, Package, ZoomIn, Microscope, ImagePlus, MessageSquare, Settings as SettingsIcon, Film, Users, Box, Video, Music, FileText, Palette as PaletteIcon, Lightbulb, ListChecks, Ruler, Camera, Sparkles, Images, Library, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Panel, PageType, UniversalPanel, CanvasPanel, StoryboardPanel, CharactersPanel, PropsPanel, VideoPanel, AudioPanel } from '@/lib/types';
import { LayersPanel } from './panels/LayersPanel';
import { InspectorPanel } from './panels/InspectorPanel';
import { ColorPickerPanel } from './panels/ColorPickerPanel';
import { FeatherEdgesPanel } from './panels/FeatherEdgesPanel';
import { AssetBrowserPanel } from './panels/AssetBrowserPanel';
import { CursorZoomPanel } from './panels/CursorZoomPanel';
import { MicroscopePanel } from './panels/MicroscopePanel';
import { AIImageGenPanel } from './panels/AIImageGenPanel';
import { AIAssistantPanel } from './panels/universal/AIAssistantPanel';
import { AssetsBrowserPanel } from './panels/universal/AssetsBrowserPanel';
import { ProjectSettingsPanel } from './panels/universal/ProjectSettingsPanel';
import { VideoGenerationPanel } from './panels/VideoGenerationPanel';
import { MotionAnalysisPanel } from './panels/MotionAnalysisPanel';
import { FrameExtractionPanel } from './panels/FrameExtractionPanel';
import { ShotListPanel } from './panels/storyboard/ShotListPanel';
import { ScriptIntegrationPanel } from './panels/storyboard/ScriptIntegrationPanel';
import { ShotDetailsPanel } from './panels/storyboard/ShotDetailsPanel';
import { VisualStylePanel } from './panels/storyboard/VisualStylePanel';
import { SceneBreakdownPanel } from './panels/storyboard/SceneBreakdownPanel';
import { ProductionNotesPanel } from './panels/storyboard/ProductionNotesPanel';
import { CharacterDNAPanel } from './panels/characters/CharacterDNAPanel';
import { PersonalityEditorPanel } from './panels/characters/PersonalityEditorPanel';
import { BackstoryManagerPanel } from './panels/characters/BackstoryManagerPanel';
import { ExpressionLibraryPanel } from './panels/characters/ExpressionLibraryPanel';
import { VoiceProfilePanel } from './panels/characters/VoiceProfilePanel';
import { OutfitVariationsPanel } from './panels/characters/OutfitVariationsPanel';
import { MultiAngleViewsPanel } from './panels/characters/MultiAngleViewsPanel';
import { ConsistencyValidatorPanel } from './panels/characters/ConsistencyValidatorPanel';
import { DNAProfileLibraryPanel } from './panels/characters/DNAProfileLibraryPanel';
import { CharacterGalleryPanel } from './panels/characters/CharacterGalleryPanel';
import { CharacterInputPanel } from './panels/characters/CharacterInputPanel';
import { CharacterSculptPanel } from './panels/characters/CharacterSculptPanel';
import { ManualSculptToolsPanel } from './panels/characters/ManualSculptToolsPanel';
import { CharacterPackPanel } from './panels/characters/CharacterPackPanel';
import { CharacterUploadForm } from './panels/characters/CharacterUploadForm';
import { PropsLibraryPanel } from './panels/props/PropsLibraryPanel';
import { SceneLibraryPanel } from './panels/props/SceneLibraryPanel';
import { StyleVariationsPanel } from './panels/props/StyleVariationsPanel';
import { CustomizationToolsPanel } from './panels/props/CustomizationToolsPanel';
import { BrandIntegrationPanel } from './panels/props/BrandIntegrationPanel';
import { MarketplacePanel } from './panels/props/MarketplacePanel';
import { MultiViewManagerPanel } from './panels/props/MultiViewManagerPanel';
import { ShotManagerPanel } from './panels/video/ShotManagerPanel';
import { CinematicStylesPanel } from './panels/video/CinematicStylesPanel';
import { TimelineControlsPanel } from './panels/video/TimelineControlsPanel';
import { ColorGradingPanel } from './panels/video/ColorGradingPanel';
import { EffectsLibraryPanel } from './panels/video/EffectsLibraryPanel';
import { AudioSyncPanel } from './panels/video/AudioSyncPanel';
import { AudioForgePanel } from './panels/audio/AudioForgePanel';
import { VoiceSynthesisPanel } from './panels/audio/VoiceSynthesisPanel';
import { PanelSize } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

interface RightPanelsProps {
  onLayerVisibilityToggle: (layerId: string) => void;
  currentPage?: PageType;
}

// Universal panels available on all pages (bottom section)
const universalPanels: { icon: typeof MessageSquare; panel: UniversalPanel; label: string }[] = [
  { icon: MessageSquare, panel: 'ai-assistant', label: 'AI Assistant' },
  { icon: Package, panel: 'assets', label: 'Assets' },
  { icon: SettingsIcon, panel: 'settings', label: 'Settings' },
];

// Page-specific panels (top section)
const canvasPanels: { icon: typeof Layers; panel: CanvasPanel; label: string }[] = [
  { icon: Layers, panel: 'layers', label: 'Layers' },
  { icon: Info, panel: 'inspector', label: 'Inspector' },
  { icon: Palette, panel: 'color', label: 'Color Picker' },
  { icon: Wand, panel: 'effects', label: 'Effects' },
  { icon: ImagePlus, panel: 'ai-image-gen', label: 'AI Image Gen' },
  { icon: ZoomIn, panel: 'cursor-zoom', label: 'Cursor Zoom' },
  { icon: Microscope, panel: 'microscope', label: 'Microscope' },
];

const storyboardPanels: { icon: any; panel: StoryboardPanel; label: string }[] = [
  { icon: ListChecks, panel: 'shot-list', label: 'Shot List' },
  { icon: FileText, panel: 'script', label: 'Script' },
  { icon: Camera, panel: 'shot-details', label: 'Shot Details' },
  { icon: PaletteIcon, panel: 'visual-style', label: 'Visual Style' },
  { icon: Box, panel: 'scene-breakdown', label: 'Scene Breakdown' },
  { icon: Lightbulb, panel: 'production-notes', label: 'Production Notes' },
];

const charactersPanels: { icon: any; panel: CharactersPanel; label: string }[] = [
  { icon: Upload, panel: 'character-upload', label: 'Upload Character' },
  { icon: ImagePlus, panel: 'character-input', label: 'Character Input' },
  { icon: Wand, panel: 'character-sculpt', label: 'AI Sculpt Tools' },
  { icon: Package, panel: 'character-pack', label: 'Character Pack' },
  { icon: Images, panel: 'character-gallery', label: 'Character Gallery' },
  { icon: Library, panel: 'dna-library', label: 'DNA Library' },
  { icon: Users, panel: 'character-dna', label: 'Character DNA' },
  { icon: Info, panel: 'personality', label: 'Personality' },
  { icon: Sparkles, panel: 'expressions', label: 'Expressions' },
  { icon: Palette, panel: 'outfits', label: 'Outfits' },
  { icon: Camera, panel: 'multi-angle', label: 'Multi-Angle' },
  { icon: ListChecks, panel: 'consistency', label: 'Consistency' },
];

const propsPanels: { icon: any; panel: PropsPanel; label: string }[] = [
  { icon: Box, panel: 'props-library', label: 'Props Library' },
  { icon: Film, panel: 'scene-library', label: 'Scene Library' },
  { icon: Palette, panel: 'style-variations', label: 'Style Variations' },
  { icon: Wand, panel: 'customization', label: 'Customization' },
  { icon: Sparkles, panel: 'brand-integration', label: 'Brand Integration' },
  { icon: Package, panel: 'marketplace', label: 'Marketplace' },
  { icon: Camera, panel: 'multi-view', label: 'Multi-View' },
];

const videoPanels: { icon: any; panel: VideoPanel; label: string }[] = [
  { icon: Film, panel: 'shot-manager', label: 'Shot Manager' },
  { icon: Sparkles, panel: 'cinematic-styles', label: 'Cinematic Styles' },
  { icon: Ruler, panel: 'timeline-controls', label: 'Timeline Controls' },
  { icon: Palette, panel: 'color-grading', label: 'Color Grading' },
  { icon: Wand, panel: 'effects-library', label: 'Effects Library' },
  { icon: Music, panel: 'audio-sync', label: 'Audio Sync' },
  { icon: Camera, panel: 'motion-analysis', label: 'Motion Analysis' },
  { icon: ImagePlus, panel: 'frame-extraction', label: 'Frame Extraction' },
];

const audioPanels: { icon: any; panel: AudioPanel; label: string }[] = [
  { icon: Music, panel: 'audio-forge', label: 'Audio Forge' },
  { icon: MessageSquare, panel: 'voice-synthesis', label: 'Voice Synthesis' },
  { icon: Sparkles, panel: 'music-generator', label: 'Music Generator' },
  { icon: Wand, panel: 'sound-design', label: 'Sound Design' },
  { icon: Palette, panel: 'audio-mixer', label: 'Audio Mixer' },
  { icon: Camera, panel: 'spatial-audio', label: 'Spatial Audio' },
  { icon: Info, panel: 'waveform', label: 'Waveform' },
  { icon: Users, panel: 'character-voices', label: 'Character Voices' },
];

export const RightPanels = ({ onLayerVisibilityToggle, currentPage = 'canvas' }: RightPanelsProps) => {
  // Only default to 'layers' panel on canvas page, null everywhere else
  const [activePanel, setActivePanel] = useState<Panel | null>(currentPage === 'canvas' ? 'layers' : null);
  const [panelSize, setPanelSize] = useState<PanelSize>('full');

  const handlePanelClick = (panel: Panel, size: PanelSize = 'full') => {
    if (activePanel === panel && panelSize === size) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
      setPanelSize(size);
    }
  };

  // Get page-specific panels based on current page
  const getPagePanels = () => {
    switch (currentPage) {
      case 'canvas':
        return canvasPanels;
      case 'storyboard':
        return storyboardPanels;
      case 'characters':
        return charactersPanels;
      case 'props':
        return propsPanels;
      case 'video':
        return videoPanels;
      case 'audio':
        return audioPanels;
      default:
        return canvasPanels;
    }
  };

  const renderPanelContent = () => {
    // Canvas panels
    if (activePanel === 'layers') return <LayersPanel onLayerVisibilityToggle={onLayerVisibilityToggle} />;
    if (activePanel === 'inspector') return <InspectorPanel />;
    if (activePanel === 'color') return <ColorPickerPanel />;
    if (activePanel === 'effects') return <FeatherEdgesPanel />;
    if (activePanel === 'ai-image-gen') return <AIImageGenPanel />;
    if (activePanel === 'cursor-zoom') return <CursorZoomPanel size={panelSize === 'full' ? 'full' : 'half'} />;
    if (activePanel === 'microscope') return <MicroscopePanel size={panelSize === 'full' ? 'full' : 'half'} />;
    
    // Storyboard panels
    if (activePanel === 'shot-list') return <ShotListPanel />;
    if (activePanel === 'script') return <ScriptIntegrationPanel />;
    if (activePanel === 'shot-details') return <ShotDetailsPanel />;
    if (activePanel === 'visual-style') return <VisualStylePanel />;
    if (activePanel === 'scene-breakdown') return <SceneBreakdownPanel />;
    if (activePanel === 'production-notes') return <ProductionNotesPanel />;
    
    // Characters panels
    if (activePanel === 'character-upload') return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <CharacterUploadForm 
            onCharacterCreated={(char) => {
              console.log('Character created:', char);
              setActivePanel('character-pack');
            }}
          />
        </div>
      </ScrollArea>
    );
    if (activePanel === 'character-input') return <CharacterInputPanel onStartSculpt={(data) => console.log('Start sculpt:', data)} />;
    if (activePanel === 'character-sculpt') return <CharacterSculptPanel onSave={(img) => console.log('Save:', img)} />;
    if (activePanel === 'character-gallery') return <CharacterGalleryPanel onSelectCharacter={(char) => console.log('Selected:', char)} />;
    if (activePanel === 'dna-library') return <DNAProfileLibraryPanel onLoadProfile={(dna) => console.log('Loaded DNA:', dna)} />;
    if (activePanel === 'character-dna') return <CharacterDNAPanel />;
    if (activePanel === 'personality') return <PersonalityEditorPanel />;
    if (activePanel === 'expressions') return <ExpressionLibraryPanel />;
    if (activePanel === 'outfits') return <OutfitVariationsPanel />;
    if (activePanel === 'multi-angle') return <MultiAngleViewsPanel />;
    if (activePanel === 'consistency') return <ConsistencyValidatorPanel />;
    if (activePanel === 'character-pack') return <CharacterPackPanel />;
    
    // Props panels
    if (activePanel === 'props-library') return <PropsLibraryPanel />;
    if (activePanel === 'scene-library') return <SceneLibraryPanel />;
    if (activePanel === 'style-variations') return <StyleVariationsPanel />;
    if (activePanel === 'customization') return <CustomizationToolsPanel />;
    if (activePanel === 'brand-integration') return <BrandIntegrationPanel />;
    if (activePanel === 'marketplace') return <MarketplacePanel />;
    if (activePanel === 'multi-view') return <MultiViewManagerPanel />;
    
    // Video panels
    if (activePanel === 'shot-manager') return <ShotManagerPanel />;
    if (activePanel === 'cinematic-styles') return <CinematicStylesPanel />;
    if (activePanel === 'timeline-controls') return <TimelineControlsPanel />;
    if (activePanel === 'color-grading') return <ColorGradingPanel />;
    if (activePanel === 'effects-library') return <EffectsLibraryPanel />;
    if (activePanel === 'audio-sync') return <AudioSyncPanel />;
    if (activePanel === 'motion-analysis') return <MotionAnalysisPanel shot={{ id: '1', name: 'Shot 1', frames: [], duration: 5, firstFrame: '', lastFrame: '', prompt: '', status: 'ready' }} />;
    if (activePanel === 'frame-extraction') return <FrameExtractionPanel shot={{ id: '1', name: 'Shot 1', frames: [], duration: 5, firstFrame: '', lastFrame: '', prompt: '', status: 'ready' }} />;
    
    // Audio panels
    if (activePanel === 'audio-forge') return <AudioForgePanel />;
    if (activePanel === 'voice-synthesis') return <VoiceSynthesisPanel />;
    
    // Universal panels
    if (activePanel === 'ai-assistant') return <AIAssistantPanel currentPage={currentPage} />;
    if (activePanel === 'assets') return <AssetsBrowserPanel />;
    if (activePanel === 'settings') return <ProjectSettingsPanel />;
    
    return null;
  };

  const pagePanels = getPagePanels();

  return (
    <div className="flex h-full">
      {/* Panel Content */}
      {activePanel && (
        <div 
          className={`bg-panel-bg border-l border-panel-border panel-slide ${
            panelSize === 'full' ? 'h-full' : panelSize === 'top' ? 'h-1/2' : 'h-1/2 self-end'
          }`}
          style={{ width: '320px' }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border">
              <h2 className="text-sm font-semibold capitalize">{activePanel.replace(/-/g, ' ')}</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="icon-button h-6 w-6"
                onClick={() => setActivePanel(null)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderPanelContent()}
            </div>
          </div>
        </div>
      )}
      
      {/* Panel Button Bar */}
      <div className="w-12 bg-toolbar border-l border-panel-border flex flex-col items-center py-2 gap-1">
        {/* Page-Specific Panels (Top Section) */}
        {pagePanels.map(({ icon: Icon, panel, label }) => (
          <div key={panel} className="relative group">
            <div className="relative">
              <Button
                variant={activePanel === panel ? "default" : "ghost"}
                size="icon"
                className="panel-icon-button relative overflow-hidden"
                title={label}
              >
                <Icon className="w-5 h-5" />
                
                {/* Invisible click zones */}
                <div
                  className="absolute inset-0 flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left half - Full size */}
                  <div
                    className="w-1/2 h-full cursor-pointer hover:bg-primary/10"
                    onClick={() => handlePanelClick(panel, 'full')}
                  />
                  {/* Right half split into top/bottom */}
                  <div className="w-1/2 h-full flex flex-col">
                    <div
                      className="h-1/2 cursor-pointer hover:bg-primary/10"
                      onClick={() => handlePanelClick(panel, 'top')}
                    />
                    <div
                      className="h-1/2 cursor-pointer hover:bg-primary/10"
                      onClick={() => handlePanelClick(panel, 'bottom')}
                    />
                  </div>
                </div>
              </Button>
              
              {/* Hover Split Visual Indicator */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-0 bottom-0 left-0 w-1/2 border-2 border-primary/40 rounded-l" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 border-2 border-primary/40 rounded-tr" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-2 border-primary/40 rounded-br" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Divider */}
        <div className="h-px w-8 bg-border my-2" />
        
        {/* Universal Panels (Bottom Section) */}
        {universalPanels.map(({ icon: Icon, panel, label }) => (
          <div key={panel} className="relative group">
            <Button
              variant={activePanel === panel ? "default" : "ghost"}
              size="icon"
              className="panel-icon-button"
              title={label}
              onClick={() => handlePanelClick(panel, 'full')}
            >
              <Icon className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
