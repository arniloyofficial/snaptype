import { useState, useCallback, useRef, useEffect } from 'react';
import { TextLayer } from '../App';

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  resizeHandle: string | null;
}

interface UseCanvasInteractionProps {
  textLayers: TextLayer[];
  activeLayerId: string | null;
  canvasSize: { width: number; height: number };
  scale: number;
  onSelectTextLayer: (id: string) => void;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
}

export const useCanvasInteraction = ({
  textLayers,
  activeLayerId,
  canvasSize,
  scale,
  onSelectTextLayer,
  onUpdateTextLayer
}: UseCanvasInteractionProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    initialWidth: 0,
    initialHeight: 0,
    resizeHandle: null
  });

  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Get resize handle at position
  const getResizeHandle = (x: number, y: number, layerWidth: number, layerHeight: number) => {
    const handleSize = 8;
    
    if (x <= handleSize && y <= handleSize) return 'nw';
    if (x >= layerWidth - handleSize && y <= handleSize) return 'ne';
    if (x <= handleSize && y >= layerHeight - handleSize) return 'sw';
    if (x >= layerWidth - handleSize && y >= layerHeight - handleSize) return 'se';
    
    return null;
  };

  // Handle mouse down on text layer
  const handleMouseDown = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    
    if (activeLayerId !== layerId) {
      onSelectTextLayer(layerId);
      return;
    }

    const target = e.target as HTMLElement;
    const layerRect = target.getBoundingClientRect();
    
    // Check if clicking on resize handle
    const x = e.clientX - layerRect.left;
    const y = e.clientY - layerRect.top;
    
    const resizeHandle = getResizeHandle(x, y, layerRect.width, layerRect.height);
    
    const layer = textLayers.find(l => l.id === layerId);
    if (!layer) return;
    
    setDragState({
      isDragging: !resizeHandle,
      isResizing: !!resizeHandle,
      startX: e.clientX,
      startY: e.clientY,
      initialX: layer.x,
      initialY: layer.y,
      initialWidth: layer.width,
      initialHeight: layer.height,
      resizeHandle
    });
  }, [activeLayerId, textLayers, onSelectTextLayer]);

  // Handle mouse move for dragging/resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!activeLayerId) return;

    const deltaX = (e.clientX - dragState.startX) / scale;
    const deltaY = (e.clientY - dragState.startY) / scale;

    if (dragState.isDragging) {
      const newX = Math.max(0, Math.min(canvasSize.width - dragState.initialWidth, dragState.initialX + deltaX));
      const newY = Math.max(0, Math.min(canvasSize.height - dragState.initialHeight, dragState.initialY + deltaY));
      
      onUpdateTextLayer(activeLayerId, {
        x: newX,
        y: newY
      });
    } else if (dragState.isResizing) {
      let newWidth = dragState.initialWidth;
      let newHeight = dragState.initialHeight;
      let newX = dragState.initialX;
      let newY = dragState.initialY;

      switch (dragState.resizeHandle) {
        case 'se':
          newWidth = Math.max(50, dragState.initialWidth + deltaX);
          newHeight = Math.max(30, dragState.initialHeight + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(50, dragState.initialWidth - deltaX);
          newHeight = Math.max(30, dragState.initialHeight + deltaY);
          newX = dragState.initialX + deltaX;
          break;
        case 'ne':
          newWidth = Math.max(50, dragState.initialWidth + deltaX);
          newHeight = Math.max(30, dragState.initialHeight - deltaY);
          newY = dragState.initialY + deltaY;
          break;
        case 'nw':
          newWidth = Math.max(50, dragState.initialWidth - deltaX);
          newHeight = Math.max(30, dragState.initialHeight - deltaY);
          newX = dragState.initialX + deltaX;
          newY = dragState.initialY + deltaY;
          break;
      }

      // Ensure layer stays within canvas bounds
      newX = Math.max(0, Math.min(canvasSize.width - newWidth, newX));
      newY = Math.max(0, Math.min(canvasSize.height - newHeight, newY));
      newWidth = Math.min(newWidth, canvasSize.width - newX);
      newHeight = Math.min(newHeight, canvasSize.height - newY);

      onUpdateTextLayer(activeLayerId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  }, [dragState, activeLayerId, scale, canvasSize, onUpdateTextLayer]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0,
      initialWidth: 0,
      initialHeight: 0,
      resizeHandle: null
    });
  }, []);

  // Handle canvas click (deselect layers)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectTextLayer('');
    }
  }, [onSelectTextLayer]);

  // Handle layer hover
  const handleLayerMouseEnter = useCallback((layerId: string) => {
    setHoveredLayerId(layerId);
  }, []);

  const handleLayerMouseLeave = useCallback(() => {
    setHoveredLayerId(null);
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!activeLayerId) return;
    
    const step = e.shiftKey ? 10 : 1;
    const layer = textLayers.find(l => l.id === activeLayerId);
    if (!layer) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onUpdateTextLayer(activeLayerId, { y: Math.max(0, layer.y - step) });
        break;
      case 'ArrowDown':
        e.preventDefault();
        onUpdateTextLayer(activeLayerId, { y: Math.min(canvasSize.height - layer.height, layer.y + step) });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onUpdateTextLayer(activeLayerId, { x: Math.max(0, layer.x - step) });
        break;
      case 'ArrowRight':
        e.preventDefault();
        onUpdateTextLayer(activeLayerId, { x: Math.min(canvasSize.width - layer.width, layer.x + step) });
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        // Note: Delete functionality would be handled by parent component
        break;
    }
  }, [activeLayerId, textLayers, canvasSize, onUpdateTextLayer]);

  // Add mouse event listeners
  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.isResizing, handleMouseMove, handleMouseUp]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Get cursor style for layer
  const getLayerCursor = (layerId: string) => {
    if (activeLayerId === layerId) {
      if (dragState.isDragging) return 'grabbing';
      if (dragState.isResizing) {
        switch (dragState.resizeHandle) {
          case 'nw':
          case 'se':
            return 'nw-resize';
          case 'ne':
          case 'sw':
            return 'ne-resize';
          default:
            return 'grab';
        }
      }
      return 'grab';
    }
    return hoveredLayerId === layerId ? 'pointer' : 'default';
  };

  // Check if layer is being interacted with
  const isLayerInteracting = (layerId: string) => {
    return activeLayerId === layerId && (dragState.isDragging || dragState.isResizing);
  };

  return {
    dragState,
    hoveredLayerId,
    canvasRef,
    handleMouseDown,
    handleCanvasClick,
    handleLayerMouseEnter,
    handleLayerMouseLeave,
    getLayerCursor,
    isLayerInteracting,
    getResizeHandle
  };
};
