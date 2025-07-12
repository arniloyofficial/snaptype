import React, { forwardRef, useEffect, useState } from "react";
import { Paper, Box, useTheme, useMediaQuery } from "@mui/material";

const PreviewPanel = forwardRef(({ state }: any, ref: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [responsiveCanvasSize, setResponsiveCanvasSize] = useState({
    width: state.canvasSize.width,
    height: state.canvasSize.height
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
      
      const originalWidth = state.canvasSize.width;
      const originalHeight = state.canvasSize.height;
      
      if (originalWidth <= maxWidth) {
        // If canvas fits, use original size
        setResponsiveCanvasSize({
          width: originalWidth,
          height: originalHeight
        });
      } else {
        // Scale down proportionally
        const scaleFactor = maxWidth / originalWidth;
        setResponsiveCanvasSize({
          width: maxWidth,
          height: Math.round(originalHeight * scaleFactor)
        });
      }
    };

    calculateResponsiveSize();
    
    const handleResize = () => {
      calculateResponsiveSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.canvasSize, isMobile, isTablet]);
  
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
      <Box
        ref={ref}
        sx={{
          width: responsiveCanvasSize.width,
          height: responsiveCanvasSize.height,
          // Fix: Use 'transparent' for truly transparent background
          background: state.transparentBackground ? 
            'transparent' :
            state.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent:
            state.align === "left" ? "flex-start" :
            state.align === "center" ? "center" : "flex-end",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
          borderRadius: 2,
          maxWidth: "100%",
          border: `1px solid ${theme.palette.divider}`,
          mx: 'auto', // Center the canvas
          // Optional: Add a subtle pattern or checkerboard to indicate transparency in the UI
          backgroundImage: state.transparentBackground ? 
            `linear-gradient(45deg, ${theme.palette.divider}1A 25%, transparent 25%),
             linear-gradient(-45deg, ${theme.palette.divider}1A 25%, transparent 25%),
             linear-gradient(45deg, transparent 75%, ${theme.palette.divider}1A 75%),
             linear-gradient(-45deg, transparent 75%, ${theme.palette.divider}1A 75%)` :
            'none',
          backgroundSize: state.transparentBackground ? '20px 20px' : 'auto',
          backgroundPosition: state.transparentBackground ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'auto',
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: state.align,
            fontFamily: state.font,
            fontWeight: state.weight, // This should now properly apply the weight
            fontSize: `${Math.max(state.size * (responsiveCanvasSize.width / state.canvasSize.width), 12)}px`, // Scale font size proportionally
            color: state.textColor,
            lineHeight: state.lineHeight,
            letterSpacing: `${state.letterSpacing}px`,
            wordSpacing: `${state.wordSpacing}px`,
            wordBreak: "break-word",
            transition: "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
            padding: 2,
          }}
        >
          {state.text || <span style={{ opacity: 0.5 }}>Preview your text here!</span>}
        </Box>
      </Box>
    </Paper>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;
