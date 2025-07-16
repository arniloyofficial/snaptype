import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Switch,
  TextField,
  Button,
  Stack,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Divider,
} from "@mui/material";

import { GradientBackground } from "../types";

type BackgroundPanelProps = {
  background: {
    color: string;
    gradient?: GradientBackground | null;
    imageUrl?: string;
    transparent: boolean;
  };
  onUpdateBackground: (bg: Partial<typeof background>) => void;
};

const gradientTypes = ["linear", "radial", "conic"] as const;

export default function BackgroundPanel({
  background,
  onUpdateBackground,
}: BackgroundPanelProps) {
  const [imageUrlInput, setImageUrlInput] = useState("");

  const handleAddGradientStop = () => {
    if (!background.gradient) {
      onUpdateBackground({
        gradient: {
          type: "linear",
          angle: 90,
          position: { x: 50, y: 50 },
          stops: [{ color: "#000000", position: 0 }, { color: "#ffffff", position: 100 }],
        },
      });
    } else {
      onUpdateBackground({
        gradient: {
          ...background.gradient,
          stops: [
            ...background.gradient.stops,
            { color: "#ffffff", position: 100 },
          ],
        },
      });
    }
  };

  const handleGradientStopChange = (index: number, key: "color" | "position", value: any) => {
    if (!background.gradient) return;
    const newStops = background.gradient.stops.map((stop, i) =>
      i === index ? { ...stop, [key]: value } : stop
    );
    onUpdateBackground({ gradient: { ...background.gradient, stops: newStops } });
  };

  const handleGradientTypeChange = (type: typeof gradientTypes[number]) => {
    if (!background.gradient) {
      onUpdateBackground({
        gradient: {
          type,
          angle: 90,
          position: { x: 50, y: 50 },
          stops: [{ color: "#000000", position: 0 }, { color: "#ffffff", position: 100 }],
        },
      });
    } else {
      onUpdateBackground({ gradient: { ...background.gradient, type } });
    }
  };

  const handleGradientAngleChange = (angle: number) => {
    if (!background.gradient) return;
    onUpdateBackground({ gradient: { ...background.gradient, angle } });
  };

  const handleGradientPositionChange = (pos: { x: number; y: number }) => {
    if (!background.gradient) return;
    onUpdateBackground({ gradient: { ...background.gradient, position: pos } });
  };

  const handleImageUrlAdd = () => {
    if (imageUrlInput.trim()) {
      onUpdateBackground({ imageUrl: imageUrlInput.trim(), gradient: null });
      setImageUrlInput("");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Background Settings
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Typography>Transparent Background</Typography>
        <Switch
          checked={background.transparent}
          onChange={(e) =>
            onUpdateBackground({ transparent: e.target.checked, imageUrl: "", gradient: null })
          }
        />
      </Stack>

      {!background.transparent && (
        <>
          <TextField
            type="color"
            label="Background Color"
            value={background.color}
            onChange={(e) => onUpdateBackground({ color: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Gradient controls */}
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="gradient-type-label">Gradient Type</InputLabel>
            <Select
              labelId="gradient-type-label"
              value={background.gradient?.type || ""}
              label="Gradient Type"
              onChange={(e) => handleGradientTypeChange(e.target.value as any)}
            >
              <MenuItem value="">None</MenuItem>
              {gradientTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {background.gradient && (
            <>
              {(background.gradient.type === "linear" || background.gradient.type === "conic") && (
                <TextField
                  label="Angle (deg)"
                  type="number"
                  value={background.gradient.angle}
                  onChange={(e) => handleGradientAngleChange(Number(e.target.value))}
                  fullWidth
                  sx={{ mb: 2 }}
                  inputProps={{ min: 0, max: 360 }}
                />
              )}

              {(background.gradient.type === "radial" || background.gradient.type === "conic") && (
                <Stack direction="row" spacing={1} mb={2}>
                  <TextField
                    label="Position X (%)"
                    type="number"
                    value={background.gradient.position.x}
                    onChange={(e) =>
                      handleGradientPositionChange({
                        x: Math.min(100, Math.max(0, Number(e.target.value))),
                        y: background.gradient.position.y,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                  <TextField
                    label="Position Y (%)"
                    type="number"
                    value={background.gradient.position.y}
                    onChange={(e) =>
                      handleGradientPositionChange({
                        x: background.gradient.position.x,
                        y: Math.min(100, Math.max(0, Number(e.target.value))),
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Stack>
              )}

              <Typography variant="subtitle1" mb={1}>
                Gradient Stops
              </Typography>
              {background.gradient.stops.map((stop, i) => (
                <Stack key={i} direction="row" spacing={1} alignItems="center" mb={1}>
                  <TextField
                    type="color"
                    value={stop.color}
                    onChange={(e) => handleGradientStopChange(i, "color", e.target.value)}
                    sx={{ width: 60 }}
                  />
                  <TextField
                    label="Position (%)"
                    type="number"
                    value={stop.position}
                    onChange={(e) =>
                      handleGradientStopChange(i, "position", Math.min(100, Math.max(0, Number(e.target.value))))
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Stack>
              ))}
              <Button onClick={handleAddGradientStop} fullWidth>
                Add Gradient Stop
              </Button>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" mb={1}>
            Background Image
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 1 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    onUpdateBackground({ imageUrl: reader.result, gradient: null, transparent: false });
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </Button>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Image URL"
              fullWidth
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
            />
            <Button onClick={handleImageUrlAdd} variant="contained">
              Add
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
