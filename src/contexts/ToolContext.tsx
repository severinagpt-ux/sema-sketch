import { createContext, useContext, useState, ReactNode } from 'react';
import { Tool } from '@/lib/types';

interface ToolSettings {
  brushSize: number;
  opacity: number;
  hardness: number;
  flow: number;
  color: string;
  pressureSensitivity: boolean;
  smoothing: boolean;
  autoErase: boolean;
}

interface ToolContextType {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  settings: ToolSettings;
  updateSettings: (updates: Partial<ToolSettings>) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const useToolContext = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useToolContext must be used within ToolProvider');
  }
  return context;
};

export const ToolProvider = ({ children }: { children: ReactNode }) => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [settings, setSettings] = useState<ToolSettings>({
    brushSize: 25,
    opacity: 100,
    hardness: 75,
    flow: 100,
    color: 'hsl(var(--primary))',
    pressureSensitivity: false,
    smoothing: true,
    autoErase: false
  });

  const updateSettings = (updates: Partial<ToolSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <ToolContext.Provider value={{ activeTool, setActiveTool, settings, updateSettings }}>
      {children}
    </ToolContext.Provider>
  );
};
