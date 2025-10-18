import { useRef, useEffect, useState, useCallback } from 'react';
import { Tool } from '@/lib/types';

interface CanvasSettings {
  brushSize: number;
  opacity: number;
  hardness: number;
  flow: number;
  color: string;
}

export const useCanvas = (tool: Tool, settings: CanvasSettings) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyIndexRef.current++;
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current);
    historyRef.current.push(imageData);
    
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && historyRef.current[historyIndexRef.current]) {
        ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      }
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && historyRef.current[historyIndexRef.current]) {
        ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      }
    }
  }, []);

  const getMousePos = useCallback((e: MouseEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const drawBrush = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { brushSize, opacity, hardness, flow, color } = settings;
    
    ctx.globalAlpha = (opacity / 100) * (flow / 100);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (hardness < 100) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / 2);
      const alpha = ctx.globalAlpha;
      gradient.addColorStop(0, color.replace(')', `, ${alpha})`).replace('hsl', 'hsla'));
      gradient.addColorStop(hardness / 100, color.replace(')', `, ${alpha * 0.5})`).replace('hsl', 'hsla'));
      gradient.addColorStop(1, color.replace(')', ', 0)').replace('hsl', 'hsla'));
      ctx.strokeStyle = gradient;
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [settings, lastPos]);

  const drawEraser = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { brushSize } = settings;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    ctx.globalCompositeOperation = 'source-over';
  }, [settings, lastPos]);

  const drawPen = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { brushSize, color } = settings;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [settings, lastPos]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const pos = getMousePos(e, canvas);
    setIsDrawing(true);
    setLastPos(pos);
    saveHistory();
  }, [getMousePos, saveHistory]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const pos = getMousePos(e, canvas);
    
    switch (tool) {
      case 'brush':
        drawBrush(ctx, pos.x, pos.y);
        break;
      case 'eraser':
        drawEraser(ctx, pos.x, pos.y);
        break;
      case 'pen':
        drawPen(ctx, pos.x, pos.y);
        break;
      case 'dodge-burn':
        ctx.globalCompositeOperation = e.shiftKey ? 'multiply' : 'screen';
        drawBrush(ctx, pos.x, pos.y);
        ctx.globalCompositeOperation = 'source-over';
        break;
      case 'blur-sharpen':
        // Simplified blur/sharpen - would need proper convolution in production
        ctx.filter = e.shiftKey ? 'blur(2px)' : 'contrast(1.5)';
        drawBrush(ctx, pos.x, pos.y);
        ctx.filter = 'none';
        break;
    }
    
    setLastPos(pos);
  }, [isDrawing, tool, getMousePos, drawBrush, drawEraser, drawPen]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    saveHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [saveHistory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize with white background
    if (historyRef.current.length === 0) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistory();
    }
  }, [saveHistory]);

  return {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    undo,
    redo
  };
};
