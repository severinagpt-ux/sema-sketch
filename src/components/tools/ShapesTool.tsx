import { useCallback } from 'react';

interface ShapeToolSettings {
  shape: 'rectangle' | 'circle' | 'line' | 'polygon';
  fill: boolean;
  strokeWidth: number;
  color: string;
}

export const useShapesTool = (settings: ShapeToolSettings) => {
  const drawRectangle = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.strokeWidth;
    
    if (settings.fill) {
      ctx.fillStyle = settings.color;
      ctx.fillRect(x, y, width, height);
    } else {
      ctx.strokeRect(x, y, width, height);
    }
  }, [settings]);

  const drawCircle = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.strokeWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    if (settings.fill) {
      ctx.fillStyle = settings.color;
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }, [settings]);

  const drawLine = useCallback((
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.strokeWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }, [settings]);

  return {
    drawRectangle,
    drawCircle,
    drawLine
  };
};
