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

export type Panel = 'layers' | 'inspector' | 'effects' | 'color' | 'assets' | 'cursor-zoom' | 'microscope';

export type PanelSize = 'full' | 'top' | 'bottom';

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
