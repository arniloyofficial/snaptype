import React, { forwardRef, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface PreviewPanelProps {
  state: any;
}

const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(
  ({ state }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:768px)");

    // Calculate canvas dimensions with responsive logic
    const canvasDimensions = useMemo(() => {
      const aspectRatio = state.canvasSize.width / state.canvasSize.height;
      
      if (isMobile) {
        // For mobile: fixed width with dynamic height
        const mobileWidth = Math.min(350, window.innerWidth - 32); // 16px padding on each side
        const mobileHeight = mobileWidth / aspectRatio;
        
        return {
          width: mobileWidth,
          height: mobileHeight,
        };
      } else {
        // For desktop: fixed height with dynamic width (original logic)
        const fixedHeight = 500;
        const calculatedWidth = fixedHeight * aspectRatio;
        
        return {
          width: calculatedWidth,
          height: fixedHeight,
        };
      }
    }, [state.canvasSize.width, state.canvasSize.height, isMobile]);

    // Calculate font size relative to canvas size
    const responsiveFontSize = useMemo(() => {
      if (isMobile) {
        // For mobile: scale based on width
        const scaleFactor = canvasDimensions.width / state.canvasSize.width;
        return state.size * scaleFactor;
      } else {
        // For desktop: scale based on height (original logic)
        const scaleFactor = canvasDimensions.height / state.canvasSize.height;
        return state.size * scaleFactor;
      }
    }, [state.size, canvasDimensions, state.canvasSize, isMobile]);

    // Calculate responsive spacing
    const responsiveSpacing = useMemo(() => {
      const scaleFactor = isMobile 
        ? canvasDimensions.width / state.canvasSize.width
        : canvasDimensions.height / state.canvasSize.height;
      
      return {
        letterSpacing: state.letterSpacing * scaleFactor,
        wordSpacing: state.wordSpacing * scaleFactor,
      };
    }, [state.letterSpacing, state.wordSpacing, canvasDimensions, state.canvasSize, isMobile]);

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          width: '100%',
          padding: isMobile ? 1 : 2,
          position: 'relative',
        }}
      >
        {/* Preview background pattern (only for visual reference, not exported) */}
        {state.transparentBackground && (
          <Box
            sx={{
              position: 'absolute',
              width: `${canvasDimensions.width}px`,
              height: `${canvasDimensions.height}px`,
              backgroundImage: `linear-gradient(45deg, ${theme.palette.grey[300]} 25%, transparent 25%), 
                               linear-gradient(-45deg, ${theme.palette.grey[300]} 25%, transparent 25%), 
                               linear-gradient(45deg, transparent 75%, ${theme.palette.grey[300]} 75%), 
                               linear-gradient(-45deg, transparent 75%, ${theme.palette.grey[300]} 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              pointerEvents: 'none',
              zIndex: 0,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 0,
            }}
          />
        )}

        {/* Actual canvas content for export */}
        <Box
          ref={ref}
          sx={{
            width: `${canvasDimensions.width}px`,
            height: `${canvasDimensions.height}px`,
            backgroundColor: state.transparentBackground 
              ? 'transparent' 
              : state.bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: state.transparentBackground ? 'none' : `1px solid ${theme.palette.divider}`,
            borderRadius: 0,
            zIndex: 1,
          }}
        >
          {/* Text Content */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: state.align === 'center' ? 'center' : 
                            state.align === 'right' ? 'flex-end' : 'flex-start',
              padding: isMobile ? 1 : 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: state.font,
                fontSize: `${responsiveFontSize}px`,
                fontWeight: state.bold ? 'bold' : state.weight,
                color: state.textColor,
                textAlign: state.align,
                lineHeight: state.lineHeight,
                letterSpacing: `${responsiveSpacing.letterSpacing}px`,
                wordSpacing: `${responsiveSpacing.wordSpacing}px`,
                fontStyle: state.italic ? 'italic' : 'normal',
                textDecoration: [
                  state.underline ? 'underline' : '',
                  state.strikethrough ? 'line-through' : ''
                ].filter(Boolean).join(' ') || 'none',
                maxWidth: '90%',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {state.text || 'Enter your text'}
            </Typography>
          </Box>

          {/* Canvas Info Overlay (only visible when no text) */}
          {!state.text && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 1,
                fontSize: isMobile ? '10px' : '12px',
                fontFamily: 'monospace',
                zIndex: 2,
              }}
            >
              {state.canvasSize.width} × {state.canvasSize.height}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;