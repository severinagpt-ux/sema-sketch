export type Tool = 
  | 'select'
  | 'magic-wand'
  | 'lasso'
  | 'crop'
  | 'pen'
  | 'brush'
  | 'eraser'
  | 'clone'
  | 'dodge-burn'
  | 'blur-sharpen'
  | 'gradient'
  | 'shapes'
  | 'text'
  | 'ai-tools'
  | 'measure'
  | 'magnifier';

// Universal panels (available on all pages)
export type UniversalPanel = 'ai-assistant' | 'assets' | 'settings';

// Canvas/Image Editor panels
export type CanvasPanel = 'layers' | 'inspector' | 'color' | 'effects' 
  | 'cursor-zoom' | 'microscope' | 'ai-image-gen';

// Storyboard panels
export type StoryboardPanel = 'shot-list' | 'script' | 'shot-details' 
  | 'visual-style' | 'scene-breakdown' | 'production-notes';

// Characters panels
export type CharactersPanel = 'character-gallery' | 'dna-library' | 'character-dna' | 'personality' | 'backstory' 
  | 'expressions' | 'voice-profile' | 'outfits' | 'multi-angle' | 'consistency';

// Props/Scenes panels
export type PropsPanel = 'props-library' | 'scene-library' | 'style-variations' 
  | 'customization' | 'brand-integration' | 'marketplace' | 'multi-view';

// Video Editor panels
export type VideoPanel = 'shot-manager' | 'cinematic-styles' | 'timeline-controls' 
  | 'color-grading' | 'effects-library' | 'audio-sync' | 'motion-analysis' 
  | 'frame-extraction';

// Audio Editor panels
export type AudioPanel = 'audio-forge' | 'voice-synthesis' | 'music-generator' 
  | 'sound-design' | 'audio-mixer' | 'spatial-audio' | 'waveform' 
  | 'character-voices';

// Combined types
export type PageSpecificPanel = CanvasPanel | StoryboardPanel | CharactersPanel 
  | PropsPanel | VideoPanel | AudioPanel;

export type Panel = UniversalPanel | PageSpecificPanel;

export type PageType = 'canvas' | 'storyboard' | 'characters' | 'props' | 'video' | 'audio';

export type PanelSize = 'full' | 'top' | 'bottom';

export type AppView = 'canvas' | 'timeline';

export interface Modifier {
  id: string;
  type: 'transparency' | 'mask' | 'warp' | 'blend' | 'filter';
  name: string;
  enabled: boolean;
  opacity: number;
  maskColor?: string;
  settings?: Record<string, any>;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  thumbnail?: string;
  modifiers: Modifier[];
  maskVisible?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  variants?: {
    front?: string;
    threequarter?: string;
    side?: string;
    rear?: string;
  };
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  magnifierPreset1: number;
  magnifierPreset2: number;
  activeMagnifier: 1 | 2;
  layers: Layer[];
}

export interface VideoFrame {
  id: string;
  timestamp: number;
  thumbnail: string;
  fullImage?: string;
}

export interface MotionAnalysis {
  direction: { x: number; y: number };
  speed: number;
  acceleration: number;
  description: string;
  keyFrames: string[];
}

export interface VideoShot {
  id: string;
  name: string;
  videoUrl?: string;
  frames: VideoFrame[];
  duration: number;
  firstFrame: string;
  lastFrame: string;
  motionAnalysis?: MotionAnalysis;
  prompt: string;
  status: 'generating' | 'ready' | 'error';
}

export interface TimelineProject {
  id: string;
  name: string;
  shots: VideoShot[];
  currentShotId?: string;
}
