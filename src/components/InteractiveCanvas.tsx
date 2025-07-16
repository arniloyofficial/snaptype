import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { Box, Typography } from "@mui/material";

import { Element, GradientBackground } from "../types";
import RotateHandle from "./RotateHandle";

type InteractiveCanvasProps = {
  elements: Element[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, data: Partial<Element>) => void;
  background: {
    color: string;
    gradient?: GradientBackground | null;
    imageUrl?: string;
    transparent: boolean;
  };
};

export default function InteractiveCanvas({
  elements,
  selectedId,
  onSelect,
  onUpdateElement,
  background,
}: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const onDragStop = (id: string, e: any, d: { x: number; y: number }) => {
    onUpdateElement(id, { x: d.x, y: d.y });
  };

  const onResizeStop = (
    id: string,
    e: MouseEvent | TouchEvent,
    direction: any,
    ref: HTMLElement,
    delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    onUpdateElement(id, {
      width: parseFloat(ref.style.width),
      height: parseFloat(ref.style.height),
      x: position.x,
      y: position.y,
    });
  };

  const onRotate = (id: string, angle: number) => {
    onUpdateElement(id, { rotation: angle });
  };

  const getBackgroundStyle = () => {
    if (background.transparent) {
      return {
        backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                          linear-gradient(-45deg, #ccc 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #ccc 75%),
                          linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
      };
    }

    if (background.gradient) {
      const g = background.gradient;
      const stops = g.stops.map((s) => `${s.color} ${s.position}%`).join(", ");
      if (g.type === "linear") {
        return { background: `linear-gradient(${g.angle}deg, ${stops})` };
      }
      if (g.type === "radial") {
        return {
          background: `radial-gradient(circle at ${g.position.x}% ${g.position.y}%, ${stops})`,
        };
      }
      if (g.type === "conic") {
        return {
          background: `conic-gradient(from ${g.angle}deg at ${g.position.x}% ${g.position.y}%, ${stops})`,
        };
      }
    }

    if (background.imageUrl) {
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    return { backgroundColor: background.color };
  };

  return (
    <Box
      ref={canvasRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: "1px solid #ccc",
        overflow: "hidden",
        userSelect: "none",
        ...getBackgroundStyle(),
      }}
      onClick={() => onSelect(null)}
    >
      {elements.map((el) => {
        const isSelected = el.id === selectedId;

        return (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            onDragStop={(e, d) => onDragStop(el.id, e, d)}
            onResizeStop={(e, dir, ref, delta, pos) =>
              onResizeStop(el.id, e, dir, ref, delta, pos)
            }
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            disableDragging={!isSelected}
            dragHandleClassName="drag-handle"
            style={{
              transform: `rotate(${el.rotation || 0}deg)`,
              border: isSelected ? "2px solid #1976d2" : "none",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isSelected ? "move" : "pointer",
              position: "absolute",
              zIndex: isSelected ? 10 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(el.id);
            }}
          >
            {el.type === "text" ? (
              <Typography
                className="drag-handle"
                sx={{
                  fontFamily: el.fontFamily,
                  fontSize: el.fontSize,
                  fontWeight: el.fontWeight,
                  fontStyle: el.italic ? "italic" : "normal",
                  textDecoration: [
                    el.underline ? "underline" : "",
                    el.strikethrough ? "line-through" : "",
                  ]
                    .filter(Boolean)
                    .join(" ") || "none",
                  color: el.color,
                  textAlign: el.textAlign,
                  lineHeight: el.lineHeight,
                  letterSpacing: el.letterSpacing,
                  wordSpacing: el.wordSpacing,
                  userSelect: "text",
                  whiteSpace: "pre-wrap",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {el.text}
              </Typography>
            ) : el.type === "image" ? (
              <img
                src={el.src}
                alt="element-img"
                className="drag-handle"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            ) : null}

            {isSelected && (
              <RotateHandle
                rotation={el.rotation || 0}
                onRotate={(angle) => onRotate(el.id, angle)}
              />
            )}
          </Rnd>
        );
      })}
    </Box>
  );
}
