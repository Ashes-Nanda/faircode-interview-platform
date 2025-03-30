
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eraser, Download, Square, Circle, PenLine, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WhiteboardProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

type DrawingTool = 'pen' | 'rect' | 'circle' | 'eraser';

const Whiteboard: React.FC<WhiteboardProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState('#000000');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  // Initialize canvas on component mount
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      setContext(ctx);
      
      // Save the initial blank state
      const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [isOpen, canvasRef, color]);
  
  // Adjust canvas size when window resizes
  useEffect(() => {
    if (!canvasRef.current || !context) return;
    
    const handleResize = () => {
      if (!canvasRef.current || !context) return;
      
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Save current drawing
      const currentDrawing = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Update canvas size
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      
      // Restore context properties after resize (they get reset)
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = 2;
      context.strokeStyle = color;
      
      // Restore the drawing
      context.putImageData(currentDrawing, 0, 0);
    };
    
    // Set initial size
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [context]);

  const saveToHistory = () => {
    if (!canvasRef.current || !context) return;
    
    const canvas = canvasRef.current;
    const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Remove any states after the current index (if we've gone back in history)
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex <= 0 || !context || !canvasRef.current) return;
    
    const newIndex = historyIndex - 1;
    context.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    startX.current = e.clientX - rect.left;
    startY.current = e.clientY - rect.top;
    
    if (tool === 'pen' || tool === 'eraser') {
      setIsDrawing(true);
      context.beginPath();
      context.moveTo(startX.current, startY.current);
      
      if (tool === 'eraser') {
        context.strokeStyle = '#ffffff';
        context.lineWidth = 10;
      } else {
        context.strokeStyle = color;
        context.lineWidth = 2;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !isDrawing) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pen' || tool === 'eraser') {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'rect') {
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.strokeRect(startX.current, startY.current, x - startX.current, y - startY.current);
    } else if (tool === 'circle') {
      context.strokeStyle = color;
      context.lineWidth = 2;
      const radius = Math.sqrt(Math.pow(x - startX.current, 2) + Math.pow(y - startY.current, 2));
      context.beginPath();
      context.arc(startX.current, startY.current, radius, 0, 2 * Math.PI);
      context.stroke();
    }
    
    setIsDrawing(false);
    saveToHistory();
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'interview-whiteboard.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast.success('Whiteboard saved as image');
  };

  if (!isOpen) return null;

  return (
    <div className={cn("fixed inset-0 bg-black/30 z-40 flex items-center justify-center", className)}>
      <div className="bg-white rounded-lg shadow-lg w-[90%] h-[80%] max-w-5xl flex flex-col overflow-hidden">
        <div className="p-3 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Collaborative Whiteboard</h3>
            <div className="flex items-center gap-1 ml-4">
              <Button
                size="sm"
                variant={tool === 'pen' ? "secondary" : "outline"} 
                onClick={() => setTool('pen')}
                className="h-8 w-8 p-1"
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={tool === 'rect' ? "secondary" : "outline"}
                onClick={() => setTool('rect')}
                className="h-8 w-8 p-1"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={tool === 'circle' ? "secondary" : "outline"}
                onClick={() => setTool('circle')}
                className="h-8 w-8 p-1"
              >
                <Circle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={tool === 'eraser' ? "secondary" : "outline"}
                onClick={() => setTool('eraser')}
                className="h-8 w-8 p-1"
              >
                <Eraser className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleUndo}
                className="h-8 w-8 p-1"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 p-0 cursor-pointer rounded border-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" /> Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
