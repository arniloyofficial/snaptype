// src/components/RotateHandle.tsx
import React from "react";
import { Box } from "@mui/material";

export default function RotateHandle({
  onMouseDown,
}: {
  onMouseDown: React.MouseEventHandler;
}) {
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "primary.main",
        position: "absolute",
        top: -30,
        left: "50%",
        transform: "translateX(-50%)",
        cursor: "grab",
        zIndex: 10,
      }}
      onMouseDown={onMouseDown}
    />
  );
}
