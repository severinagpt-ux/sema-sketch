import { useCallback } from 'react';

interface GradientToolSettings {
  type: 'linear' | 'radial';
  colors: string[];
  stops: number[];
}

export const useGradientTool = (settings: GradientToolSettings) => {
  const drawLinearGradient = useCallback((
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    
    settings.colors.forEach((color, i) => {
      const stop = settings.stops[i] || i / (settings.colors.length - 1);
      gradient.addColorStop(stop, color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), width, height);
  }, [settings]);

  const drawRadialGradient = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    
    settings.colors.forEach((color, i) => {
      const stop = settings.stops[i] || i / (settings.colors.length - 1);
      gradient.addColorStop(stop, color);
    });
    
    ctx.fillStyle = gradient;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }, [settings]);

  return {
    drawLinearGradient,
    drawRadialGradient
  };
};
