import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { BackgroundState, TextLayer } from '../App';

interface InteractiveCanvasProps {
  canvasSize: { width: number; height: number };
  backgroundState: BackgroundState;
  textLayers: TextLayer[];
  activeLayerId: string | null;
  onSelectTextLayer: (id: string) => void;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
}

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

const InteractiveCanvas = forwardRef<HTMLDivElement, InteractiveCanvasProps>(
  ({ canvasSize, backgroundState, textLayers, activeLayerId, onSelectTextLayer, onUpdateTextLayer }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const canvasRef = useRef<HTMLDivElement>(null);
    const [responsiveCanvasSize, setResponsiveCanvasSize] = useState({
      width: canvasSize.width,
      height: canvasSize.height,
      scale: 1
    });
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

    // Calculate responsive canvas size
    useEffect(() => {
      const calculateResponsiveSize = () => {
        const containerPadding = 48;
        let maxWidth;
        
        if (isMobile) {
          maxWidth = window.innerWidth - containerPadding - 32;
        } else if (isTablet) {
          maxWidth = window.innerWidth - containerPadding - 64;
        } else {
          maxWidth = Math.min(window.innerWidth - containerPadding - 100, 1200);
        }
        
        const originalWidth = canvasSize.width;
        const originalHeight = canvasSize.height;
        
        if (originalWidth <= maxWidth) {
          setResponsiveCanvasSize({
            width: originalWidth,
            height: originalHeight,
            scale: 1
          });
        } else {
          const scale = maxWidth / originalWidth;
          setResponsiveCanvasSize({
            width: maxWidth,
            height: Math.round(originalHeight * scale),
            scale: scale
          });
        }
      };

      calculateResponsiveSize();
      
      const handleResize = () => {
        calculateResponsiveSize();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [canvasSize, isMobile, isTablet]);

    // Get background style
    const getBackgroundStyle = () => {
      const { type, solidColor, gradientColors, gradientDirection, imageUrl, imageFile, blur, opacity, brightness, contrast, saturation, hue, grayscale, sepia } = backgroundState;
      
      let background = '';
      let filter = '';
      
      // Build filter string
      const filters = [];
      if (blur > 0) filters.push(`blur(${blur}px)`);
      if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
      if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
      if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
      if (hue !== 0) filters.push(`hue-rotate(${hue}deg)`);
      if (grayscale > 0) filters.push(`grayscale(${grayscale}%)`);
      if (sepia > 0) filters.push(`sepia(${sepia}%)`);
      
      filter = filters.length > 0 ? filters.join(' ') : 'none';
      
      switch (type) {
        case 'solid':
          background = solidColor;
          break;
        case 'gradient':
          const direction = gradientDirection.replace('var(--color1)', gradientColors[0]).replace('var(--color2)', gradientColors[1]);
          background = direction;
          break;
        case 'image':
          const imageSource = imageFile ? URL.createObjectURL(imageFile) : imageUrl;
          background = `url(${imageSource}) center/cover no-repeat`;
          break;
        case 'template':
          // Template backgrounds will be handled separately
          background = solidColor;
          break;
        default:
          background = '#ffffff';
      }
      
      return {
        background,
        filter,
        opacity: opacity / 100
      };
    };

    // Get text layer style
    const getTextLayerStyle = (layer: TextLayer) => {
      const scale = responsiveCanvasSize.scale;
      
      const textDecoration = [];
      if (layer.underline) textDecoration.push('underline');
      if (layer.strikethrough) textDecoration.push('line-through');
      
      const fontWeight = layer.bold ? Math.max(layer.weight + 300, 700) : layer.weight;
      
      return {
        position: 'absolute' as const,
        left: `${layer.x * scale}px`,
        top: `${layer.y * scale}px`,
        width: `${layer.width * scale}px`,
        height: `${layer.height * scale}px`,
        fontFamily: layer.font,
        fontWeight,
        fontStyle: layer.italic ? 'italic' : 'normal',
        fontSize: `${layer.size * scale}px`,
        color: layer.color,
        textAlign: layer.align,
        lineHeight: layer.lineHeight,
        letterSpacing: `${layer.letterSpacing}px`,
        wordSpacing: `${layer.wordSpacing}px`,
        textDecoration: textDecoration.length > 0 ? textDecoration.join(' ') : 'none',
        opacity: layer.opacity / 100,
        transform: `rotate(${layer.rotation}deg)`,
        transformOrigin: 'center',
        cursor: activeLayerId === layer.id ? 'move' : 'pointer',
        userSelect: 'none' as const,
        pointerEvents: 'all' as const,
        whiteSpace: 'pre-wrap' as const,
        wordBreak: 'break-word' as const,
        overflow: 'hidden',
        textShadow: layer.shadow.enabled ? 
          `${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color}` : 
          'none',
        WebkitTextStroke: layer.stroke.enabled ? 
          `${layer.stroke.width}px ${layer.stroke.color}` : 
          'none'
      };
    };

    // Handle mouse down on text layer
    const handleMouseDown = useCallback((e: React.MouseEvent, layerId: string) => {
      e.stopPropagation();
      
      if (activeLayerId !== layerId) {
        onSelectTextLayer(layerId);
        return;
      }

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const target = e.target as HTMLElement;
      const layerRect = target.getBoundingClientRect();
      
      // Check if clicking on resize handle
      const x = e.clientX - layerRect.left;
      const y = e.clientY - layerRect.top;
      const handleSize = 8;
      
      let resizeHandle = null;
      
      // Check corners for resize handles
      if (x <= handleSize && y <= handleSize) {
        resizeHandle = 'nw';
      } else if (x >= layerRect.width - handleSize && y <= handleSize) {
        resizeHandle = 'ne';
      } else if (x <= handleSize && y >= layerRect.height - handleSize) {
        resizeHandle = 'sw';
      } else if (x >= layerRect.width - handleSize && y >= layerRect.height - handleSize) {
        resizeHandle = 'se';
      }
      
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

      const deltaX = (e.clientX - dragState.startX) / responsiveCanvasSize.scale;
      const deltaY = (e.clientY - dragState.startY) / responsiveCanvasSize.scale;

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
    }, [dragState, activeLayerId, responsiveCanvasSize.scale, canvasSize, onUpdateTextLayer]);

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

    // Handle canvas click (deselect layers)
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onSelectTextLayer('');
      }
    }, [onSelectTextLayer]);

    // Render resize handles for active layer
    const renderResizeHandles = (layer: TextLayer) => {
      if (activeLayerId !== layer.id) return null;
      
      const scale = responsiveCanvasSize.scale;
      const handleSize = 8;
      
      const handles = [
        { position: 'nw', cursor: 'nw-resize', top: -handleSize/2, left: -handleSize/2 },
        { position: 'ne', cursor: 'ne-resize', top: -handleSize/2, right: -handleSize/2 },
        { position: 'sw', cursor: 'sw-resize', bottom: -handleSize/2, left: -handleSize/2 },
        { position: 'se', cursor: 'se-resize', bottom: -handleSize/2, right: -handleSize/2 }
      ];
      
      return handles.map(handle => (
        <Box
          key={handle.position}
          sx={{
            position: 'absolute',
            width: handleSize,
            height: handleSize,
            backgroundColor: theme.palette.primary.main,
            border: `2px solid ${theme.palette.background.paper}`,
            borderRadius: '50%',
            cursor: handle.cursor,
            zIndex: 1000,
            pointerEvents: 'all',
            ...handle
          }}
        />
      ));
    };

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          borderRadius: 3,
          border: `2px solid ${theme.palette.divider}`,
          maxWidth: '100%',
          overflow: 'hidden',
          mb: 3
        }}
      >
        {/* Wrapper with checkerboard pattern for transparency visualization */}
        <Box
          sx={{
            width: responsiveCanvasSize.width,
            height: responsiveCanvasSize.height,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            backgroundImage: backgroundState.type === 'solid' && backgroundState.solidColor === 'transparent' ? 
              `linear-gradient(45deg, ${theme.palette.divider}1A 25%, transparent 25%),
               linear-gradient(-45deg, ${theme.palette.divider}1A 25%, transparent 25%),
               linear-gradient(45deg, transparent 75%, ${theme.palette.divider}1A 75%),
               linear-gradient(-45deg, transparent 75%, ${theme.palette.divider}1A 75%)` :
              'none',
            backgroundSize: backgroundState.type === 'solid' && backgroundState.solidColor === 'transparent' ? '20px 20px' : 'auto',
            backgroundPosition: backgroundState.type === 'solid' && backgroundState.solidColor === 'transparent' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'auto',
          }}
        >
          {/* Canvas content */}
          <Box
            ref={ref}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              ...getBackgroundStyle()
            }}
            onClick={handleCanvasClick}
          >
            {/* Text layers */}
            {textLayers.map(layer => (
              <Box
                key={layer.id}
                sx={{
                  ...getTextLayerStyle(layer),
                  border: activeLayerId === layer.id ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                  boxSizing: 'border-box'
                }}
                onMouseDown={(e) => handleMouseDown(e, layer.id)}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: layer.align === 'left' ? 'flex-start' : layer.align === 'center' ? 'center' : 'flex-end',
                    padding: '4px',
                    position: 'relative'
                  }}
                >
                  {layer.text || 'New Text Layer'}
                  {renderResizeHandles(layer)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
);

InteractiveCanvas.displayName = 'InteractiveCanvas';

export default InteractiveCanvas;
