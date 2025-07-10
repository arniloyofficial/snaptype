import React, { useEffect, useRef } from "react";
import { Paper } from "@mui/material";

// Utility to load font dynamically
function loadFont(font: string, variant: string) {
  const fontId = `${font.replace(/\s+/g, "-")}-${variant}`;
  if (document.getElementById(fontId)) return;
  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css?family=${font.replace(/ /g, "+")}:${variant}`;
  document.head.appendChild(link);
}

type PreviewPanelProps = {
  text: string;
  font: string;
  style: string;
  size: number;
  color: string;
  bgColor: string;
  alignment: string;
  canvasSize: { width: number; height: number };
};

export default function PreviewPanel({
  text, font, style, size, color, bgColor, alignment, canvasSize
}: PreviewPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFont(font, style);
  }, [font, style]);

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 4, mb: 2, p: 4,
        minHeight: canvasSize.height,
        width: canvasSize.width,
        borderRadius: 4,
        bgcolor: bgColor === "transparent" ? "transparent" : bgColor
      }}
      ref={ref}
      id="preview-panel"
    >
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          color,
          textAlign: alignment as any,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          width: "100%",
          height: "100%",
        }}
      >
        {text || "Your styled text preview will appear here!"}
      </div>
    </Paper>
  );
}
