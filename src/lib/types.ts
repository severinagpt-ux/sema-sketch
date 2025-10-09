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

export type Panel = 'layers' | 'inspector' | 'effects' | 'color';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  thumbnail?: string;
  modifiers?: number;
}

export interface Project {
  id: string;
  name: string;
  magnifierPreset1: number;
  magnifierPreset2: number;
  activeMagnifier: 1 | 2;
  layers: Layer[];
}
