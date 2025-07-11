import React, { forwardRef } from "react";
import { Paper, Box } from "@mui/material";

const PreviewPanel = forwardRef(({ state }: any, ref: any) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Box
        ref={ref}
        sx={{
          width: state.canvasSize.width,
          height: state.canvasSize.height,
          background: state.transparentBackground ? "transparent" : state.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent:
            state.align === "left" ? "flex-start" :
            state.align === "center" ? "center" : "flex-end",
          overflow: "hidden",
          transition: "all 0.2s cubic-bezier(.47,1.64,.41,.8)",
          borderRadius: 2,
          maxWidth: "100%",
          // Add checkerboard pattern for transparent background visualization
          ...(state.transparentBackground && {
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          })
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
