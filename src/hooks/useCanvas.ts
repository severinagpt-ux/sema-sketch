import { useRef, useEffect, useState, useCallback } from 'react';
import { Tool } from '@/lib/types';

interface CanvasSettings {
  brushSize: number;
  opacity: number;
  hardness: number;
  flow: number;
  color: string;
  smoothing: boolean;
  smoothingStrength: number;
  pathElasticity: number;
  speedDynamics: boolean;
  speedAffectsSize: boolean;
  speedAffectsOpacity: boolean;
}

interface Point {
  x: number;
  y: number;
  time: number;
  speed?: number;
}

export const useCanvas = (tool: Tool, settings: CanvasSettings) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);
  const pathPointsRef = useRef<Point[]>([]);
  const lastRenderTimeRef = useRef<number>(0);

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

  // Catmull-Rom spline interpolation for smooth curves
  const catmullRomSpline = useCallback((points: Point[], t: number): Point => {
    const p0 = points[0];
    const p1 = points[1];
    const p2 = points[2];
    const p3 = points[3];
    
    const t2 = t * t;
    const t3 = t2 * t;
    
    const x = 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );
    
    const y = 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );
    
    return { x, y, time: Date.now() };
  }, []);

  // Apply elasticity (sine wave modulation) to path
  const applyElasticity = useCallback((x: number, y: number, progress: number): Point => {
    const elasticity = settings.pathElasticity / 100;
    const frequency = 2 + elasticity * 3;
    const amplitude = elasticity * 5;
    
    const perpOffset = Math.sin(progress * Math.PI * frequency) * amplitude;
    
    return { x: x + perpOffset, y: y + perpOffset, time: Date.now() };
  }, [settings.pathElasticity]);

  // Calculate speed between two points
  const calculateSpeed = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dt = Math.max(1, p2.time - p1.time);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance / dt;
  }, []);

  // Draw a rotated, stretched brush stamp
  const drawBrushStamp = useCallback((
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    angle: number,
    speed: number = 1
  ) => {
    const { brushSize, opacity, hardness, flow, color, speedDynamics, speedAffectsSize, speedAffectsOpacity } = settings;
    
    // Speed-based dynamics
    const speedFactor = speedDynamics ? Math.min(speed * 0.1, 2) : 1;
    const dynamicSize = speedAffectsSize ? brushSize * (0.5 + speedFactor * 0.5) : brushSize;
    const dynamicOpacity = speedAffectsOpacity ? (opacity / 100) * (0.5 + speedFactor * 0.5) : (opacity / 100);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.globalAlpha = dynamicOpacity * (flow / 100);
    
    if (hardness < 100) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, dynamicSize / 2);
      
      const colorWithAlpha = (a: number) => {
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        return color;
      };
      
      gradient.addColorStop(0, colorWithAlpha(ctx.globalAlpha));
      gradient.addColorStop(hardness / 100, colorWithAlpha(ctx.globalAlpha * 0.5));
      gradient.addColorStop(1, colorWithAlpha(0));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color;
    }
    
    // Draw ellipse stretched along movement direction
    ctx.beginPath();
    ctx.ellipse(0, 0, dynamicSize / 2, dynamicSize / 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, [settings]);

  // Main brush drawing with smooth path
  const drawBrush = useCallback((ctx: CanvasRenderingContext2D, currentPoint: Point) => {
    pathPointsRef.current.push(currentPoint);
    
    // Calculate speed
    if (pathPointsRef.current.length > 1) {
      const prevPoint = pathPointsRef.current[pathPointsRef.current.length - 2];
      currentPoint.speed = calculateSpeed(prevPoint, currentPoint);
    }
    
    // Need at least 4 points for Catmull-Rom
    if (pathPointsRef.current.length < 4) {
      // Draw simple line for first few points
      ctx.globalAlpha = (settings.opacity / 100) * (settings.flow / 100);
      ctx.strokeStyle = settings.color;
      ctx.lineWidth = settings.brushSize;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      return;
    }
    
    // Use smoothing if enabled
    if (settings.smoothing && settings.smoothingStrength > 0) {
      const points = pathPointsRef.current.slice(-4);
      const steps = Math.max(5, Math.floor(settings.smoothingStrength / 10));
      
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        let interpolated = catmullRomSpline(points, t);
        
        // Apply elasticity
        if (settings.pathElasticity > 0) {
          interpolated = applyElasticity(interpolated.x, interpolated.y, t);
        }
        
        // Calculate angle from previous to current point
        const prevPoint = i === 0 ? points[1] : catmullRomSpline(points, (i - 1) / steps);
        const angle = Math.atan2(interpolated.y - prevPoint.y, interpolated.x - prevPoint.x);
        
        drawBrushStamp(ctx, interpolated.x, interpolated.y, angle, currentPoint.speed || 1);
      }
    } else {
      // Direct stamping without smoothing
      const angle = Math.atan2(currentPoint.y - lastPos.y, currentPoint.x - lastPos.x);
      drawBrushStamp(ctx, currentPoint.x, currentPoint.y, angle, currentPoint.speed || 1);
    }
    
    // Keep path buffer reasonable
    if (pathPointsRef.current.length > 20) {
      pathPointsRef.current = pathPointsRef.current.slice(-10);
    }
  }, [settings, lastPos, catmullRomSpline, applyElasticity, calculateSpeed, drawBrushStamp]);

  const drawEraser = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { brushSize } = settings;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    ctx.restore();
  }, [settings, lastPos]);

  const drawPen = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { brushSize, color, opacity } = settings;
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, brushSize * 0.5);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
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
    const currentPoint: Point = { x: pos.x, y: pos.y, time: Date.now() };
    
    switch (tool) {
      case 'brush':
        drawBrush(ctx, currentPoint);
        break;
      case 'eraser':
        drawEraser(ctx, pos.x, pos.y);
        break;
      case 'pen':
        drawPen(ctx, pos.x, pos.y);
        break;
      case 'dodge-burn':
        ctx.save();
        ctx.globalCompositeOperation = e.shiftKey ? 'multiply' : 'screen';
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = e.shiftKey ? '#000000' : '#ffffff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, settings.brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      case 'blur-sharpen':
        ctx.save();
        ctx.filter = e.shiftKey ? 'blur(3px)' : 'contrast(1.2) brightness(1.05)';
        ctx.globalAlpha = 0.5;
        ctx.drawImage(canvas, pos.x - settings.brushSize, pos.y - settings.brushSize, 
          settings.brushSize * 2, settings.brushSize * 2, 
          pos.x - settings.brushSize, pos.y - settings.brushSize, 
          settings.brushSize * 2, settings.brushSize * 2);
        ctx.restore();
        break;
    }
    
    setLastPos(pos);
  }, [isDrawing, tool, getMousePos, drawBrush, drawEraser, drawPen]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    pathPointsRef.current = []; // Clear path on mouse up
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
