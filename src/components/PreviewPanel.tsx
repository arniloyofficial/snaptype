import React, { forwardRef, useEffect, useState } from "react";
import { Paper, Box, useTheme, useMediaQuery } from "@mui/material";
import { BackgroundState, TextLayer } from "../App";

interface PreviewPanelProps {
  canvasSize: { width: number; height: number };
  backgroundState: BackgroundState;
  textLayers: TextLayer[];
  activeLayerId?: string;
  onSelectTextLayer?: (layerId: string) => void;
  onUpdateTextLayer?: (layerId: string, updates: Partial<TextLayer>) => void;
  interactive?: boolean;
}

const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(
  ({ canvasSize, backgroundState, textLayers, activeLayerId, onSelectTextLayer, onUpdateTextLayer, interactive = false }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [responsiveCanvasSize, setResponsiveCanvasSize] = useState({
      width: canvasSize.width,
      height: canvasSize.height,
      scale: 1
    });

    useEffect(() => {
      const calculateResponsiveSize = () => {
        const containerPadding = 48; // Total padding (24px on each side)
        let maxWidth;
        
        if (isMobile) {
          maxWidth = window.innerWidth - containerPadding - 32; // Extra margin for mobile
        } else if (isTablet) {
          maxWidth = window.innerWidth - containerPadding - 64; // Extra margin for tablet
        } else {
          maxWidth = Math.min(window.innerWidth - containerPadding - 100, 1200); // Desktop max width
        }
        
        const originalWidth = canvasSize.width;
        const originalHeight = canvasSize.height;
        
        if (originalWidth <= maxWidth) {
          // If canvas fits, use original size
          setResponsiveCanvasSize({
            width: originalWidth,
            height: originalHeight,
            scale: 1
          });
        } else {
          // Scale down proportionally
          const scaleFactor = maxWidth / originalWidth;
          setResponsiveCanvasSize({
            width: maxWidth,
            height: Math.round(originalHeight * scaleFactor),
            scale: scaleFactor
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

    // Generate background style based on background state
    const getBackgroundStyle = () => {
      const baseStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      };

      // Apply image filters
      const filters = [];
      if (backgroundState.blur > 0) filters.push(`blur(${backgroundState.blur}px)`);
      if (backgroundState.brightness !== 100) filters.push(`brightness(${backgroundState.brightness}%)`);
      if (backgroundState.contrast !== 100) filters.push(`contrast(${backgroundState.contrast}%)`);
      if (backgroundState.saturation !== 100) filters.push(`saturate(${backgroundState.saturation}%)`);
      if (backgroundState.hue !== 0) filters.push(`hue-rotate(${backgroundState.hue}deg)`);
      if (backgroundState.grayscale > 0) filters.push(`grayscale(${backgroundState.grayscale}%)`);
      if (backgroundState.sepia > 0) filters.push(`sepia(${backgroundState.sepia}%)`);

      switch (backgroundState.type) {
        case 'solid':
          return {
            ...baseStyle,
            background: backgroundState.solidColor,
            filter: filters.join(' '),
            opacity: backgroundState.opacity / 100
          };
        
        case 'gradient':
          const gradientStyle = backgroundState.gradientDirection
            .replace('var(--color1)', backgroundState.gradientColors[0] || '#6750A4')
            .replace('var(--color2)', backgroundState.gradientColors[1] || '#1976D2');
          
          return {
            ...baseStyle,
            background: gradientStyle,
            filter: filters.join(' '),
            opacity: backgroundState.opacity / 100
          };
        
        case 'image':
          const imageUrl = backgroundState.imageFile 
            ? URL.createObjectURL(backgroundState.imageFile)
            : backgroundState.imageUrl;
          
          return {
            ...baseStyle,
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: filters.join(' '),
            opacity: backgroundState.opacity / 100
          };
        
        case 'template':
          // Handle template backgrounds (you can expand this based on your templates)
          return {
            ...baseStyle,
            background: getTemplateBackground(backgroundState.templateId),
            filter: filters.join(' '),
            opacity: backgroundState.opacity / 100
          };
        
        default:
          return {
            ...baseStyle,
            background: 'transparent'
          };
      }
    };

    // Get template background (expand this based on your templates)
    const getTemplateBackground = (templateId: string) => {
      const templates: { [key: string]: string } = {
        'gradient1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'pattern1': 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px)',
        'pattern2': 'radial-gradient(circle at 50% 50%, #667eea 0%, #764ba2 100%)',
      };
      return templates[templateId] || '#ffffff';
    };

    // Build text decoration string
    const getTextDecoration = (layer: TextLayer) => {
      const decorations = [];
      if (layer.underline) decorations.push('underline');
      if (layer.strikethrough) decorations.push('line-through');
      return decorations.length > 0 ? decorations.join(' ') : 'none';
    };

    // Build font weight - handle both bold toggle and weight setting
    const getFontWeight = (layer: TextLayer) => {
      if (layer.bold) {
        return layer.weight >= 600 ? layer.weight : Math.max(layer.weight + 300, 700);
      }
      return layer.weight;
    };

    // Get shadow style
    const getShadowStyle = (layer: TextLayer) => {
      if (!layer.shadow.enabled) return 'none';
      
      return `${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color}`;
    };

    // Get stroke style
    const getStrokeStyle = (layer: TextLayer) => {
      if (!layer.stroke.enabled) return {};
      
      return {
        WebkitTextStroke: `${layer.stroke.width}px ${layer.stroke.color}`,
        textStroke: `${layer.stroke.width}px ${layer.stroke.color}`
      };
    };

    // Handle text layer click
    const handleTextLayerClick = (layerId: string, e: React.MouseEvent) => {
      if (interactive && onSelectTextLayer) {
        e.stopPropagation();
        onSelectTextLayer(layerId);
      }
    };

    // Handle text layer drag (simplified - you might want to use a more sophisticated drag system)
    const handleTextLayerMouseDown = (layerId: string, e: React.MouseEvent) => {
      if (!interactive || !onUpdateTextLayer) return;
      
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const layer = textLayers.find(l => l.id === layerId);
      if (!layer) return;
      
      const startLayerX = layer.x;
      const startLayerY = layer.y;
      
      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = (e.clientX - startX) / responsiveCanvasSize.scale;
        const deltaY = (e.clientY - startY) / responsiveCanvasSize.scale;
        
        onUpdateTextLayer(layerId, {
          x: Math.max(0, Math.min(canvasSize.width - layer.width, startLayerX + deltaX)),
          y: Math.max(0, Math.min(canvasSize.height - layer.height, startLayerY + deltaY))
        });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          border: `2px solid ${theme.palette.divider}`,
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Wrapper with checkerboard pattern for transparency visualization */}
        <Box
          sx={{
            width: responsiveCanvasSize.width,
            height: responsiveCanvasSize.height,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            mx: 'auto',
            position: 'relative',
            // Checkerboard pattern only for visual indication (not captured in export)
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
          {/* Actual canvas content that gets exported */}
          <Box
            ref={ref}
            sx={{
              ...getBackgroundStyle(),
              cursor: interactive ? 'default' : 'auto'
            }}
            onClick={(e) => {
              if (interactive && onSelectTextLayer) {
                // Click on background deselects all layers
                e.stopPropagation();
                onSelectTextLayer('');
              }
            }}
          >
            {/* Render all text layers */}
            {textLayers.map((layer) => (
              <Box
                key={layer.id}
                sx={{
                  position: 'absolute',
                  left: `${(layer.x * responsiveCanvasSize.scale)}px`,
                  top: `${(layer.y * responsiveCanvasSize.scale)}px`,
                  width: `${(layer.width * responsiveCanvasSize.scale)}px`,
                  height: `${(layer.height * responsiveCanvasSize.scale)}px`,
                  transform: `rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity / 100,
                  cursor: interactive ? 'move' : 'default',
                  border: interactive && activeLayerId === layer.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: interactive && activeLayerId === layer.id ? '4px' : 'none',
                  transition: 'border 0.2s ease',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: layer.align === 'left' ? 'flex-start' : layer.align === 'center' ? 'center' : 'flex-end',
                }}
                onClick={(e) => handleTextLayerClick(layer.id, e)}
                onMouseDown={(e) => handleTextLayerMouseDown(layer.id, e)}
              >
                <Box
                  sx={{
                    width: '100%',
                    textAlign: layer.align,
                    fontFamily: layer.font,
                    fontWeight: getFontWeight(layer),
                    fontStyle: layer.italic ? 'italic' : 'normal',
                    textDecoration: getTextDecoration(layer),
                    fontSize: `${Math.max(layer.size * responsiveCanvasSize.scale, 8)}px`,
                    color: layer.color,
                    lineHeight: layer.lineHeight,
                    letterSpacing: `${layer.letterSpacing * responsiveCanvasSize.scale}px`,
                    wordSpacing: `${layer.wordSpacing * responsiveCanvasSize.scale}px`,
                    wordBreak: 'break-word',
                    textShadow: getShadowStyle(layer),
                    ...getStrokeStyle(layer),
                    transition: 'all 0.2s ease',
                    padding: `${4 * responsiveCanvasSize.scale}px`,
                    pointerEvents: interactive ? 'auto' : 'none',
                  }}
                >
                  {layer.text || (interactive ? <span style={{ opacity: 0.5 }}>Click to edit</span> : '')}
                </Box>
              </Box>
            ))}

            {/* Show placeholder if no text layers */}
            {textLayers.length === 0 && (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                  fontSize: '18px',
                  opacity: 0.5,
                }}
              >
                Add a text layer to get started
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    );
  }
);

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;
