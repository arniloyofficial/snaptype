import React, { forwardRef } from "react";
import { Paper, Box, useTheme } from "@mui/material";

const PreviewPanel = forwardRef(({ state }: any, ref: any) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        // Use theme border color for the preview container
        border: `2px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        ref={ref}
        sx={{
          width: state.canvasSize.width,
          height: state.canvasSize.height,
          background: state.transparentBackground ? theme.palette.divider : state.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent:
            state.align === "left" ? "flex-start" :
            state.align === "center" ? "center" : "flex-end",
          overflow: "hidden",
          transition: "all 0.2s cubic-bezier(.47,1.64,.41,.8)",
          borderRadius: 2,
          maxWidth: "100%",
          // Remove the checkerboard pattern - use solid color matching border
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: state.align,
            fontFamily: state.font,
            fontWeight: state.weight,
            fontSize: `${state.size}px`,
            color: state.textColor,
            lineHeight: state.lineHeight,
            letterSpacing: `${state.letterSpacing}px`,
            wordSpacing: `${state.wordSpacing}px`,
            wordBreak: "break-word",
            transition: "all 0.2s cubic-bezier(.47,1.64,.41,.8)",
            padding: 2,
          }}
        >
          {state.text || <span style={{ opacity: 0.5 }}>Preview your text here!</span>}
        </Box>
      </Box>
    </Paper>
  );
});

export default PreviewPanel;
