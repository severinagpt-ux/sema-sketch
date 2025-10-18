import { useCallback } from 'react';

interface TextToolSettings {
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

export const useTextTool = (settings: TextToolSettings) => {
  const drawText = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number
  ) => {
    let font = '';
    if (settings.italic) font += 'italic ';
    if (settings.bold) font += 'bold ';
    font += `${settings.fontSize}px ${settings.fontFamily}`;
    
    ctx.font = font;
    ctx.fillStyle = settings.color;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  }, [settings]);

  const measureText = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string
  ) => {
    let font = '';
    if (settings.italic) font += 'italic ';
    if (settings.bold) font += 'bold ';
    font += `${settings.fontSize}px ${settings.fontFamily}`;
    
    ctx.font = font;
    return ctx.measureText(text);
  }, [settings]);

  return {
    drawText,
    measureText
  };
};
