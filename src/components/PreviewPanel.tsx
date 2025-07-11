import React, { forwardRef } from "react";
import { Paper, Box } from "@mui/material";

const PreviewPanel = forwardRef(({ state }: any, ref: any) => {
  return (
    <Paper
      ref={ref}
      elevation={4}
      sx={{
        mt: 3,
        mb: 3,
        p: 3,
        borderRadius: 4,
        width: state.canvasSize.width,
        height: state.canvasSize.height,
        background: state.bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent:
          state.align === "left" ? "flex-start" :
          state.align === "center" ? "center" : "flex-end",
        overflow: "hidden",
        transition: "all 0.2s cubic-bezier(.47,1.64,.41,.8)",
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
          wordBreak: "break-word",
          transition: "all 0.2s cubic-bezier(.47,1.64,.41,.8)"
        }}
      >
        {state.text || <span style={{ color: "#aaa" }}>Preview your text here!</span>}
      </Box>
    </Paper>
  );
});

export default PreviewPanel;
